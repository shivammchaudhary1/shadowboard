import Vote from "../models/vote.model.js";
import Question from "../models/question.model.js";
import RoomMember from "../models/roomMember.model.js";
import UserModel from "../models/user.model.js";

/**
 * Submit a vote (members only)
 */
const submitVote = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { votedForUser, votedForOption } = req.body;
    const userId = req.userId;

    // Validate that exactly one vote target is provided
    const hasUserVote = !!votedForUser;
    const hasOptionVote = !!votedForOption;

    if ((!hasUserVote && !hasOptionVote) || (hasUserVote && hasOptionVote)) {
      return res.status(400).json({
        message: "Must vote for either a user or an option, but not both",
        success: false,
      });
    }

    // Find question and validate
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        message: "Question not found",
        success: false,
      });
    }

    if (question.status !== "active") {
      return res.status(400).json({
        message: "Question is not currently accepting votes",
        success: false,
      });
    }

    // Check if question has expired
    if (question.endTime && question.endTime < new Date()) {
      return res.status(400).json({
        message: "Question voting period has ended",
        success: false,
      });
    }

    // Check if user is a member of the room
    const membership = await RoomMember.findOne({
      roomId: question.roomId,
      userId,
      status: "active",
    });

    if (!membership) {
      return res.status(403).json({
        message: "Access denied. You are not a member of this room",
        success: false,
      });
    }

    // Check if user has already voted
    const existingVote = await Vote.findOne({
      questionId,
      votedBy: userId,
    });

    if (existingVote) {
      return res.status(400).json({
        message: "You have already voted on this question",
        success: false,
      });
    }

    // Validate vote target based on question type
    if (question.questionType === "member_voting") {
      if (!hasUserVote) {
        return res.status(400).json({
          message: "This question requires voting for a room member",
          success: false,
        });
      }

      // Check if target user is a member of the room
      const targetMember = await RoomMember.findOne({
        roomId: question.roomId,
        userId: votedForUser,
        status: "active",
      });

      if (!targetMember) {
        return res.status(400).json({
          message: "Target user is not a member of this room",
          success: false,
        });
      }

      // Check self-voting rules
      if (votedForUser === userId && !question.settings.allowSelfVoting) {
        return res.status(400).json({
          message: "Self-voting is not allowed for this question",
          success: false,
        });
      }
    } else if (question.questionType === "custom_options") {
      if (!hasOptionVote) {
        return res.status(400).json({
          message: "This question requires voting for a custom option",
          success: false,
        });
      }

      // Check if option exists in question
      const validOption = question.customOptions.find(
        (opt) => opt.optionId === votedForOption,
      );
      if (!validOption) {
        return res.status(400).json({
          message: "Invalid option selected",
          success: false,
        });
      }
    }

    // Create vote
    const voteData = {
      questionId,
      roomId: question.roomId,
      votedBy: userId,
      isAnonymous: question.settings.isAnonymous,
    };

    if (hasUserVote) {
      voteData.votedForUser = votedForUser;
    } else {
      voteData.votedForOption = votedForOption;
    }

    const vote = new Vote(voteData);
    await vote.save();

    // Update question total votes count
    await Question.findByIdAndUpdate(questionId, { $inc: { totalVotes: 1 } });

    res.status(201).json({
      message: "Vote submitted successfully",
      success: true,
      data: {
        voteId: vote._id,
        questionId: vote.questionId,
        submittedAt: vote.submittedAt,
        isAnonymous: vote.isAnonymous,
      },
    });
  } catch (error) {
    console.error("Error submitting vote:", error);

    // Handle duplicate vote error (should not happen due to unique index)
    if (error.code === 11000) {
      return res.status(400).json({
        message: "You have already voted on this question",
        success: false,
      });
    }

    res.status(500).json({
      message: "Failed to submit vote",
      success: false,
    });
  }
};

/**
 * Get vote results for a question (members only)
 */
const getQuestionResults = async (req, res) => {
  try {
    const { questionId } = req.params;
    const userId = req.userId;
    const { includeVoteDetails = "false" } = req.query;

    // Find question and validate
    const question = await Question.findById(questionId).populate(
      "createdBy",
      "username email",
    );

    if (!question) {
      return res.status(404).json({
        message: "Question not found",
        success: false,
      });
    }

    // Check if user is a member of the room
    const membership = await RoomMember.findOne({
      roomId: question.roomId,
      userId,
      status: "active",
    });

    if (!membership) {
      return res.status(403).json({
        message: "Access denied. You are not a member of this room",
        success: false,
      });
    }

    // Get all votes for the question
    let votesQuery = Vote.find({ questionId });

    if (includeVoteDetails === "true") {
      votesQuery = votesQuery
        .populate("votedBy", "username email")
        .populate("votedForUser", "username email");
    }

    const votes = await votesQuery.exec();

    // Process results based on question type
    let results = [];
    let voteDetails = [];

    if (question.questionType === "member_voting") {
      // Group votes by votedForUser
      const votesByUser = {};

      for (const vote of votes) {
        const targetUserId = vote.votedForUser.toString();
        if (!votesByUser[targetUserId]) {
          votesByUser[targetUserId] = [];
        }
        votesByUser[targetUserId].push(vote);
      }

      // Get user details for vote targets
      const targetUserIds = Object.keys(votesByUser);
      const targetUsers = await UserModel.find({
        _id: { $in: targetUserIds },
      }).select("username email");

      results = targetUsers
        .map((user) => ({
          type: "user",
          user: {
            userId: user._id,
            username: user.username,
            email: user.email,
          },
          voteCount: votesByUser[user._id.toString()].length,
          percentage:
            targetUserIds.length > 0
              ? Math.round(
                  (votesByUser[user._id.toString()].length / votes.length) *
                    100,
                )
              : 0,
        }))
        .sort((a, b) => b.voteCount - a.voteCount);

      // Prepare vote details if requested
      if (includeVoteDetails === "true") {
        voteDetails = votes.map((vote) => ({
          voteId: vote._id,
          votedBy: question.settings.isAnonymous
            ? null
            : {
                userId: vote.votedBy._id,
                username: vote.votedBy.username,
              },
          votedFor: {
            userId: vote.votedForUser._id,
            username: vote.votedForUser.username,
          },
          submittedAt: vote.submittedAt,
          isAnonymous: vote.isAnonymous,
        }));
      }
    } else {
      // Custom options voting
      const votesByOption = {};

      for (const vote of votes) {
        const optionId = vote.votedForOption;
        if (!votesByOption[optionId]) {
          votesByOption[optionId] = [];
        }
        votesByOption[optionId].push(vote);
      }

      results = question.customOptions
        .map((option) => ({
          type: "option",
          option: {
            optionId: option.optionId,
            optionText: option.optionText,
          },
          voteCount: votesByOption[option.optionId]?.length || 0,
          percentage:
            votes.length > 0
              ? Math.round(
                  ((votesByOption[option.optionId]?.length || 0) /
                    votes.length) *
                    100,
                )
              : 0,
        }))
        .sort((a, b) => b.voteCount - a.voteCount);

      // Prepare vote details if requested
      if (includeVoteDetails === "true") {
        voteDetails = votes.map((vote) => {
          const option = question.customOptions.find(
            (opt) => opt.optionId === vote.votedForOption,
          );
          return {
            voteId: vote._id,
            votedBy: question.settings.isAnonymous
              ? null
              : {
                  userId: vote.votedBy._id,
                  username: vote.votedBy.username,
                },
            votedFor: {
              optionId: vote.votedForOption,
              optionText: option?.optionText || "Unknown Option",
            },
            submittedAt: vote.submittedAt,
            isAnonymous: vote.isAnonymous,
          };
        });
      }
    }

    res.status(200).json({
      message: "Question results retrieved successfully",
      success: true,
      data: {
        question: {
          questionId: question._id,
          questionText: question.questionText,
          questionType: question.questionType,
          status: question.status,
          totalVotes: question.totalVotes,
          settings: question.settings,
          createdBy: {
            userId: question.createdBy._id,
            username: question.createdBy.username,
          },
          startTime: question.startTime,
          endTime: question.endTime,
          createdAt: question.createdAt,
        },
        results,
        voteDetails: includeVoteDetails === "true" ? voteDetails : undefined,
        totalVotes: votes.length,
        userRole: membership.role,
      },
    });
  } catch (error) {
    console.error("Error getting question results:", error);
    res.status(500).json({
      message: "Failed to get question results",
      success: false,
    });
  }
};

/**
 * Get user's vote for a specific question
 */
const getUserVote = async (req, res) => {
  try {
    const { questionId } = req.params;
    const userId = req.userId;

    // Find question and validate access
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        message: "Question not found",
        success: false,
      });
    }

    // Check if user is a member of the room
    const membership = await RoomMember.findOne({
      roomId: question.roomId,
      userId,
      status: "active",
    });

    if (!membership) {
      return res.status(403).json({
        message: "Access denied. You are not a member of this room",
        success: false,
      });
    }

    // Find user's vote
    const userVote = await Vote.findOne({
      questionId,
      votedBy: userId,
    }).populate("votedForUser", "username email");

    if (!userVote) {
      return res.status(404).json({
        message: "No vote found for this question",
        success: false,
        data: { hasVoted: false },
      });
    }

    // Prepare response based on vote type
    let voteTarget = null;
    if (userVote.votedForUser) {
      voteTarget = {
        type: "user",
        user: {
          userId: userVote.votedForUser._id,
          username: userVote.votedForUser.username,
          email: userVote.votedForUser.email,
        },
      };
    } else if (userVote.votedForOption) {
      const option = question.customOptions.find(
        (opt) => opt.optionId === userVote.votedForOption,
      );
      voteTarget = {
        type: "option",
        option: {
          optionId: userVote.votedForOption,
          optionText: option?.optionText || "Unknown Option",
        },
      };
    }

    res.status(200).json({
      message: "User vote retrieved successfully",
      success: true,
      data: {
        hasVoted: true,
        vote: {
          voteId: userVote._id,
          questionId: userVote.questionId,
          voteTarget,
          submittedAt: userVote.submittedAt,
          isAnonymous: userVote.isAnonymous,
        },
      },
    });
  } catch (error) {
    console.error("Error getting user vote:", error);
    res.status(500).json({
      message: "Failed to get user vote",
      success: false,
    });
  }
};

export { submitVote, getQuestionResults, getUserVote };
