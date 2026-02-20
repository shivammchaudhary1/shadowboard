import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      index: true,
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    inviteToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["sent", "accepted", "declined", "expired"],
      default: "sent",
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 }, // MongoDB TTL for auto cleanup
    },
    acceptedAt: {
      type: Date,
    },
    acceptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, versionKey: false },
);

// Compound indexes for performance
inviteSchema.index({ roomId: 1, email: 1 });
inviteSchema.index({ invitedBy: 1, status: 1 });

const Invite = mongoose.model("Invite", inviteSchema);

export default Invite;
