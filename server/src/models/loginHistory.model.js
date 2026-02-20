import mongoose from "mongoose";

const loginHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    registerLog: {
      timestamp: {
        type: Date,
        default: Date.now,
      },
      ipAddress: String,
      userAgent: String,
    },

    loginLogs: [
      {
        timestamp: {
          type: Date,
          default: Date.now,
        },
        ipAddress: String,
        userAgent: String,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const LoginHistoryModel = mongoose.model("LoginHistory", loginHistorySchema);

export default LoginHistoryModel;
