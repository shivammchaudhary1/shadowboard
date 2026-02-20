// Sub-schema for individual questions within a room
const questionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    options: [
      {
        text: { type: String, required: true },
        voteCount: { type: Number, default: 0 }
      }
    ],
    isActive: { type: Boolean, default: false }, // Is this the current live question?
    startTime: Date,
    endTime: Date,
    status: {
      type: String,
      enum: ['pending', 'voting', 'completed'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

const roomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
      index: true // Crucial for performance
    },
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    // Track who is currently in the room
    participants: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          index: true
        },
        username: String,
        joinedAt: { type: Date, default: Date.now }
      }
    ],
    // The "History" of questions asked in this specific room
    questions: [questionSchema],

    // Helper field to quickly find the "Current" live question index
    currentQuestionIndex: {
      type: Number,
      default: 0
    },

    roomStatus: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open'
    }
  },
  { timestamps: true, versionKey: false }
);

// Indexing for faster lookups during high-concurrency voting
roomSchema.index({ roomId: 1, 'questions.isActive': 1 });

const Room = mongoose.model('Room', roomSchema);
export default Room;
