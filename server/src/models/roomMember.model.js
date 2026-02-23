import mongoose from "mongoose";

const roomMemberSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      index: true, // For performance
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["host", "member"],
      default: "member",
    },
    status: {
      type: String,
      enum: ["active", "left", "kicked"],
      default: "active",
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    leftAt: {
      type: Date,
    },
    socketId: {
      type: String, // For real-time Socket.io integration
    },
  },
  { timestamps: true, versionKey: false },
);

// Compound index for efficient room member queries
roomMemberSchema.index({ roomId: 1, userId: 1 }, { unique: true });
roomMemberSchema.index({ roomId: 1, status: 1 });

const RoomMember = mongoose.model("RoomMember", roomMemberSchema);

export default RoomMember;
