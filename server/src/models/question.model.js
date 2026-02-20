import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      index: true,
    },
    questionText: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questionType: {
      type: String,
      enum: ["member_voting", "custom_options"], // member_voting = vote for room members, custom_options = predefined choices
      default: "member_voting",
    },
    customOptions: [
      {
        optionText: {
          type: String,
          required: true,
          trim: true,
        },
        optionId: {
          type: String,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      enum: ["draft", "active", "completed", "cancelled"],
      default: "draft",
    },
    settings: {
      allowMultipleVotes: {
        type: Boolean,
        default: false, // One vote per user per question
      },
      allowSelfVoting: {
        type: Boolean,
        default: false,
      },
      isAnonymous: {
        type: Boolean,
        default: false,
      },
      timeLimit: {
        type: Number, // In minutes, 0 = no time limit
        default: 0,
      },
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
    totalVotes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, versionKey: false },
);

// Indexes for performance
questionSchema.index({ roomId: 1, status: 1 });
questionSchema.index({ createdBy: 1 });

const Question = mongoose.model("Question", questionSchema);

export default Question;
