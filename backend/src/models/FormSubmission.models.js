import mongoose, { Schema } from "mongoose";

/**
 * FormSubmission Model: Captures the actual customer responses.
 * Designed to handle flexible, schema-less field data for business logic accuracy.
 */
const formSubmissionSchema = new Schema(
  {
    formId: {
      type: Schema.Types.ObjectId,
      ref: "DynamicForm",
      required: true,
      index: true,
    },
    merchantId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Optional customer context
    customerId: {
      type: Schema.Types.ObjectId,
      refPath: "customerModel",
    },
    customerModel: {
      type: String,
      enum: ["Customer", "User"],
    },

    // 📦 Flat list of responses for easy analysis
    responses: [
      {
        fieldLabel: {
            type: String,
            required: true,
        },
        value: {
            type: Schema.Types.Mixed, // Can be String, Number, or Object based on field type
            required: true,
        }
      }
    ],

    // Basic scoring (For reviews/ratings)
    overallRating: {
        type: Number,
        min: 0,
        max: 5,
    },

    metadata: {
        type: Schema.Types.Mixed,
    }
  },
  {
    timestamps: true,
  }
);

// High-speed retrieval for merchant analysis
formSubmissionSchema.index({ formId: 1, createdAt: -1 });
formSubmissionSchema.index({ merchantId: 1, createdAt: -1 });

export const FormSubmission = mongoose.model("FormSubmission", formSubmissionSchema);
