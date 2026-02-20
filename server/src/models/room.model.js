import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
      index: true, // Crucial for performance - 6 character alphanumeric (nanoid)
    },
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    settings: {
      allowSelfVoting: {
        type: Boolean,
        default: false,
      },
      hostCanParticipate: {
        type: Boolean,
        default: true,
      },
      maxMembers: {
        type: Number,
        default: 50,
        min: 2,
        max: 100,
      },
      isAnonymousVoting: {
        type: Boolean,
        default: false,
      },
    },
    status: {
      type: String,
      enum: ["waiting", "active", "paused", "completed", "closed"],
      default: "waiting",
    },
  },
  { timestamps: true, versionKey: false },
);

// Indexing for faster lookups
roomSchema.index({ hostId: 1 });
roomSchema.index({ status: 1 });

const Room = mongoose.model("Room", roomSchema);

export default Room;
