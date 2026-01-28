import mongoose, { Schema } from "mongoose";

const supportTicketSchema = new Schema(
  {
    // Ticket identification
    ticketNumber: {
      type: String,
      unique: true,
      required: true,
    },

    // Merchant reference
    merchantId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    merchantName: {
      type: String,
      required: true,
    },
    merchantContact: {
      phone: String,
      email: String,
    },

    // Issue details
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "Technical Issue",
        "Billing",
        "Feature Request",
        "Bug Report",
        "Account Issue",
        "WhatsApp Integration",
        "Payment Gateway",
        "Other",
      ],
      required: true,
    },

    // Priority
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
      index: true,
    },

    // Status
    status: {
      type: String,
      enum: ["Open", "In Progress", "Waiting for Customer", "Resolved", "Closed"],
      default: "Open",
      index: true,
    },

    // Assignment
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User", // Customer Care user
    },
    assignedAt: {
      type: Date,
    },

    // Conversation/Updates
    updates: [
      {
        message: {
          type: String,
          required: true,
        },
        addedBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        addedByRole: {
          type: String,
          enum: ["Merchant", "Customer Care", "Super Admin"],
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        attachments: [
          {
            url: String,
            filename: String,
            fileType: String,
          },
        ],
        isInternal: {
          type: Boolean,
          default: false, // Internal notes not visible to merchant
        },
      },
    ],

    // Attachments (screenshots, logs, etc.)
    attachments: [
      {
        url: {
          type: String,
          required: true,
        },
        filename: String,
        fileType: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Resolution
    resolution: {
      type: String,
    },
    resolvedAt: {
      type: Date,
    },
    resolvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    // Feedback
    merchantFeedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: String,
      submittedAt: Date,
    },

    // SLA tracking
    responseTime: {
      type: Number, // in minutes
    },
    resolutionTime: {
      type: Number, // in minutes
    },
    firstResponseAt: {
      type: Date,
    },

    // Tags for categorization
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
supportTicketSchema.index({ merchantId: 1, status: 1 });
supportTicketSchema.index({ assignedTo: 1, status: 1 });
supportTicketSchema.index({ priority: 1, status: 1 });
supportTicketSchema.index({ createdAt: -1 });

// Pre-save hook to generate ticket number
supportTicketSchema.pre("save", async function (next) {
  if (this.isNew && !this.ticketNumber) {
    const count = await mongoose.model("SupportTicket").countDocuments();
    this.ticketNumber = `TKT${Date.now()}${count + 1}`;
  }
  next();
});

// Method to add an update/comment
supportTicketSchema.methods.addUpdate = function (
  message,
  addedBy,
  addedByRole,
  attachments = [],
  isInternal = false
) {
  this.updates.push({
    message,
    addedBy,
    addedByRole,
    timestamp: new Date(),
    attachments,
    isInternal,
  });

  // Set first response time if this is the first response from support
  if (!this.firstResponseAt && ["Customer Care", "Super Admin"].includes(addedByRole)) {
    this.firstResponseAt = new Date();
    this.responseTime = Math.floor((this.firstResponseAt - this.createdAt) / 60000); // in minutes
  }

  return this.save();
};

// Method to assign ticket
supportTicketSchema.methods.assignTo = function (userId) {
  this.assignedTo = userId;
  this.assignedAt = new Date();
  if (this.status === "Open") {
    this.status = "In Progress";
  }
  return this.save();
};

// Method to resolve ticket
supportTicketSchema.methods.resolve = function (resolution, resolvedBy) {
  this.status = "Resolved";
  this.resolution = resolution;
  this.resolvedAt = new Date();
  this.resolvedBy = resolvedBy;
  this.resolutionTime = Math.floor((this.resolvedAt - this.createdAt) / 60000); // in minutes
  return this.save();
};

// Method to close ticket
supportTicketSchema.methods.close = function () {
  this.status = "Closed";
  return this.save();
};

export const SupportTicket = mongoose.model("SupportTicket", supportTicketSchema);
