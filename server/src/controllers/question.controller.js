import Question from "../models/question.model.js";
import RoomMember from "../models/roomMember.model.js";
import Room from "../models/room.model.js";
import UserModel from "../models/user.model.js";
import { nanoid } from "nanoid";

/**
 * Create a new question (host only)
 */
const createQuestion = async (req, res) => {
  try {
    const { roomId } = req.params;
    const {
      questionText,
      questionType = "member_voting",
      customOptions = [],
      settings = {},
    } = req.body;
    const userId = req.userId;

    // Validate required fields
    if (!questionText || !questionText.trim()) {
      return res.status(400).json({
        message: "Question text is required",
        success: false,
      });
    }

    // Check if user is the host of the room
    const membership = await RoomMember.findOne({
      roomId,
      userId,
      role: "host",
      status: "active",
    });

    if (!membership) {
      return res.status(403).json({
        message: "Only the room host can create questions",
        success: false,
      });
    }

    // Validate room exists and is active
    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({
        message: "Room not found",
        success: false,
      });
    }

    if (room.status === "closed" || room.status === "completed") {
      return res.status(403).json({
        message: "Cannot create questions in a closed room",
        success: false,
      });
    }

    // Validate custom options if questionType is custom_options
    let processedCustomOptions = [];
    if (questionType === "custom_options") {
      if (!customOptions || customOptions.length < 2) {
        return res.status(400).json({
          message:
            "At least 2 custom options are required for custom option questions",
          success: false,
        });
      }

      processedCustomOptions = customOptions.map((option) => ({
        optionText: option.optionText?.trim(),
        optionId: nanoid(8), // Generate unique option ID
      }));

      // Validate option texts
      if (processedCustomOptions.some((opt) => !opt.optionText)) {
        return res.status(400).json({
          message: "All custom options must have text",
          success: false,
        });
      }
    }

    // Create question
    const questionData = {
      roomId,
      questionText: questionText.trim(),
      createdBy: userId,
      questionType: questionType,
      customOptions: processedCustomOptions,
      settings: {
        allowMultipleVotes: settings.allowMultipleVotes || false,
        allowSelfVoting:
          settings.allowSelfVoting !== undefined
            ? settings.allowSelfVoting
            : room.settings.allowSelfVoting,
        isAnonymous:
          settings.isAnonymous !== undefined
            ? settings.isAnonymous
            : room.settings.isAnonymousVoting,
        timeLimit: settings.timeLimit || 0,
      },
    };

    const question = new Question(questionData);
    const savedQuestion = await question.save();

    res.status(201).json({
      message: "Question created successfully",
      success: true,
      data: {
        questionId: savedQuestion._id,
        questionText: savedQuestion.questionText,
        questionType: savedQuestion.questionType,
        customOptions: savedQuestion.customOptions,
        settings: savedQuestion.settings,
        status: savedQuestion.status,
        createdAt: savedQuestion.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating question:", error);
    res.status(500).json({
      message: "Failed to create question",
      success: false,
    });
  }
};

/**
 * Start/Activate a question (host only)
 */
const startQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const userId = req.userId;

    // Find question and verify host permission
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        message: "Question not found",
        success: false,
      });
    }

    // Check if user is the host
    const membership = await RoomMember.findOne({
      roomId: question.roomId,
      userId,
      role: "host",
      status: "active",
    });

    if (!membership) {
      return res.status(403).json({
        message: "Only the room host can start questions",
        success: false,
      });
    }

    // Deactivate any other active questions in the room
    await Question.updateMany(
      { roomId: question.roomId, status: "active" },
      {
        status: "completed",
        endTime: new Date(),
      },
    );

    // Activate this question
    question.status = "active";
    question.startTime = new Date();

    // Set end time if there's a time limit
    if (question.settings.timeLimit > 0) {
      question.endTime = new Date(
        Date.now() + question.settings.timeLimit * 60 * 1000,
      );
    }

    await question.save();

    res.status(200).json({
      message: "Question started successfully",
      success: true,
      data: {
        questionId: question._id,
        status: question.status,
        startTime: question.startTime,
        endTime: question.endTime,
      },
    });
  } catch (error) {
    console.error("Error starting question:", error);
    res.status(500).json({
      message: "Failed to start question",
      success: false,
    });
  }
};

/**
 * Get room questions (members only)
 */
const getRoomQuestions = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.userId;
    const { status, includeCompleted = "true" } = req.query;

    // Check if user is a member of the room
    const membership = await RoomMember.findOne({
      roomId,
      userId,
      status: "active",
    });

    if (!membership) {
      return res.status(403).json({
        message: "Access denied. You are not a member of this room",
        success: false,
      });
    }

    // Build query filter
    let queryFilter = { roomId };
    if (status) {
      queryFilter.status = status;
    } else if (includeCompleted === "false") {
      queryFilter.status = { $ne: "completed" };
    }

    // Get questions with creator details
    const questions = await Question.find(queryFilter)
      .populate("createdBy", "username email")
      .sort({ createdAt: -1 });

    const questionsData = questions.map((q) => ({
      questionId: q._id,
      questionText: q.questionText,
      questionType: q.questionType,
      customOptions: q.customOptions,
      status: q.status,
      totalVotes: q.totalVotes,
      settings: q.settings,
      startTime: q.startTime,
      endTime: q.endTime,
      createdBy: {
        userId: q.createdBy._id,
        username: q.createdBy.username,
      },
      createdAt: q.createdAt,
      updatedAt: q.updatedAt,
    }));

    res.status(200).json({
      message: "Room questions retrieved successfully",
      success: true,
      data: {
        questions: questionsData,
        count: questionsData.length,
        userRole: membership.role,
      },
    });
  } catch (error) {
    console.error("Error getting room questions:", error);
    res.status(500).json({
      message: "Failed to get room questions",
      success: false,
    });
  }
};

/**
 * Get active question for voting
 */
const getActiveQuestion = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.userId;

    // Check if user is a member of the room
    const membership = await RoomMember.findOne({
      roomId,
      userId,
      status: "active",
    });

    if (!membership) {
      return res.status(403).json({
        message: "Access denied. You are not a member of this room",
        success: false,
      });
    }

    // Get active question
    const activeQuestion = await Question.findOne({
      roomId,
      status: "active",
    }).populate("createdBy", "username email");

    if (!activeQuestion) {
      return res.status(404).json({
        message: "No active question found",
        success: false,
      });
    }

    // For member voting questions, get available members to vote for
    let availableOptions = [];
    if (activeQuestion.questionType === "member_voting") {
      let membersQuery = { roomId, status: "active" };

      // Exclude self if self-voting is not allowed
      if (!activeQuestion.settings.allowSelfVoting) {
        membersQuery.userId = { $ne: userId };
      }

      const members = await RoomMember.find(membersQuery).populate(
        "userId",
        "username email",
      );

      availableOptions = members.map((member) => ({
        type: "user",
        userId: member.userId._id,
        username: member.userId.username,
        email: member.userId.email,
      }));
    } else {
      // For custom options
      availableOptions = activeQuestion.customOptions.map((option) => ({
        type: "option",
        optionId: option.optionId,
        optionText: option.optionText,
      }));
    }

    res.status(200).json({
      message: "Active question retrieved successfully",
      success: true,
      data: {
        question: {
          questionId: activeQuestion._id,
          questionText: activeQuestion.questionText,
          questionType: activeQuestion.questionType,
          status: activeQuestion.status,
          totalVotes: activeQuestion.totalVotes,
          settings: activeQuestion.settings,
          startTime: activeQuestion.startTime,
          endTime: activeQuestion.endTime,
          createdBy: {
            userId: activeQuestion.createdBy._id,
            username: activeQuestion.createdBy.username,
          },
          createdAt: activeQuestion.createdAt,
        },
        availableOptions,
        userRole: membership.role,
      },
    });
  } catch (error) {
    console.error("Error getting active question:", error);
    res.status(500).json({
      message: "Failed to get active question",
      success: false,
    });
  }
};

/**
 * End/Complete a question (host only)
 */
const endQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const userId = req.userId;

    // Find question and verify host permission
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        message: "Question not found",
        success: false,
      });
    }

    // Check if user is the host
    const membership = await RoomMember.findOne({
      roomId: question.roomId,
      userId,
      role: "host",
      status: "active",
    });

    if (!membership) {
      return res.status(403).json({
        message: "Only the room host can end questions",
        success: false,
      });
    }

    if (question.status !== "active") {
      return res.status(400).json({
        message: "Question is not currently active",
        success: false,
      });
    }

    // End the question
    question.status = "completed";
    question.endTime = new Date();
    await question.save();

    res.status(200).json({
      message: "Question ended successfully",
      success: true,
      data: {
        questionId: question._id,
        status: question.status,
        endTime: question.endTime,
        totalVotes: question.totalVotes,
      },
    });
  } catch (error) {
    console.error("Error ending question:", error);
    res.status(500).json({
      message: "Failed to end question",
      success: false,
    });
  }
};

export {
  createQuestion,
  startQuestion,
  getRoomQuestions,
  getActiveQuestion,
  endQuestion,
};
