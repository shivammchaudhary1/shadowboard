import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
      index: true,
    },
    roomId: {
      type: String,
      required: true,
      index: true,
    },
    votedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // For member voting (voting for room members)
    votedForUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // For custom option voting (voting for predefined options)
    votedForOption: {
      type: String, // optionId from Question.customOptions
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    voteWeight: {
      type: Number,
      default: 1, // For future weighted voting if needed
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true, versionKey: false },
);

// Compound indexes for performance and constraints
voteSchema.index({ questionId: 1, votedBy: 1 }, { unique: true }); // One vote per user per question
voteSchema.index({ questionId: 1, votedForUser: 1 });
voteSchema.index({ questionId: 1, votedForOption: 1 });
voteSchema.index({ roomId: 1, votedBy: 1 });

// Validate that either votedForUser or votedForOption is provided, but not both
voteSchema.pre("save", function (next) {
  const hasUserVote = !!this.votedForUser;
  const hasOptionVote = !!this.votedForOption;

  if ((!hasUserVote && !hasOptionVote) || (hasUserVote && hasOptionVote)) {
    return next(
      new Error("Must vote for either a user or an option, but not both"),
    );
  }

  next();
});

const Vote = mongoose.model("Vote", voteSchema);

export default Vote;
