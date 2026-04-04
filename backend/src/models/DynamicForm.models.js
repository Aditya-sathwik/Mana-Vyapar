import mongoose, { Schema } from "mongoose";

/**
 * DynamicForm Model: A blueprint for custom merchant forms.
 * Used for Reviews, Surveys, Lead Generation, or Custom Requests.
 */
const dynamicFormSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    merchantId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🏗️ Form Structure
    fields: [
      {
        label: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: ["text", "textarea", "number", "dropdown", "radio", "checkbox", "date"],
        },
        required: {
            type: Boolean,
            default: false,
        },
        placeholder: String,
        defaultValue: Schema.Types.Mixed,
        
        // Options for "dropdown", "radio", or "checkbox"
        options: [
            {
                label: String,
                value: String,
            }
        ],

        // Validation constraints
        validation: {
            min: Number,
            max: Number,
            regex: String,
        }
      }
    ],

    isActive: {
        type: Boolean,
        default: true,
    },
    accessType: {
        type: String,
        enum: ["PUBLIC", "REGISTERED"],
        default: "PUBLIC"
    },

    // 📊 Basic Stats
    totalSubmissions: {
        type: Number,
        default: 0,
    }
  },
  {
    timestamps: true,
  }
);

// Search for forms by merchant
dynamicFormSchema.index({ merchantId: 1, createdAt: -1 });

export const DynamicForm = mongoose.model("DynamicForm", dynamicFormSchema);
