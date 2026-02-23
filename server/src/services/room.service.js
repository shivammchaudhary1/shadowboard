import Room from "../models/room.model.js";
import RoomMember from "../models/roomMember.model.js";
import Question from "../models/question.model.js";
import Vote from "../models/vote.model.js";
import Invite from "../models/invite.model.js";

/**
 * Room Service Layer
 * Reusable business logic for room operations
 */

/**
 * Check if user has specific role in room
 */
const checkUserRoomAccess = async (roomId, userId, requiredRole = null) => {
  const query = {
    roomId,
    userId,
    status: "active",
  };

  if (requiredRole) {
    query.role = requiredRole;
  }

  const membership = await RoomMember.findOne(query);

  return {
    hasAccess: !!membership,
    membership: membership,
    role: membership?.role || null,
  };
};

/**
 * Get room with validation
 */
const getRoomWithValidation = async (roomId, options = {}) => {
  const { includeHost = true, includeMembers = false } = options;

  let query = Room.findOne({ roomId });

  if (includeHost) {
    query = query.populate("hostId", "username email");
  }

  const room = await query.exec();

  if (!room) {
    throw new Error("Room not found");
  }

  let result = { room };

  if (includeMembers) {
    const members = await RoomMember.find({
      roomId,
      status: "active",
    })
      .populate("userId", "username email")
      .sort({ joinedAt: 1 });

    result.members = members;
  }

  return result;
};

/**
 * Get room statistics
 */
const getRoomStats = async (roomId) => {
  const [
    totalMembers,
    totalQuestions,
    totalVotes,
    activeQuestions,
    completedQuestions,
  ] = await Promise.all([
    RoomMember.countDocuments({ roomId, status: "active" }),
    Question.countDocuments({ roomId }),
    Vote.countDocuments({ roomId }),
    Question.countDocuments({ roomId, status: "active" }),
    Question.countDocuments({ roomId, status: "completed" }),
  ]);

  return {
    totalMembers,
    totalQuestions,
    totalVotes,
    activeQuestions,
    completedQuestions,
    averageVotesPerQuestion:
      totalQuestions > 0 ? Math.round(totalVotes / totalQuestions) : 0,
  };
};

/**
 * Clean expired invites for a room
 */
const cleanExpiredInvites = async (roomId) => {
  const result = await Invite.updateMany(
    {
      roomId,
      status: "sent",
      expiresAt: { $lte: new Date() },
    },
    {
      status: "expired",
    },
  );

  return result.modifiedCount;
};

/**
 * Validate room capacity
 */
const validateRoomCapacity = async (roomId) => {
  const room = await Room.findOne({ roomId });
  if (!room) {
    throw new Error("Room not found");
  }

  const currentMemberCount = await RoomMember.countDocuments({
    roomId,
    status: "active",
  });

  return {
    currentCount: currentMemberCount,
    maxCapacity: room.settings.maxMembers,
    hasSpace: currentMemberCount < room.settings.maxMembers,
    availableSlots: Math.max(0, room.settings.maxMembers - currentMemberCount),
  };
};

/**
 * Check if voting is allowed for user on question
 */
const validateVotingEligibility = async (questionId, userId) => {
  const question = await Question.findById(questionId);
  if (!question) {
    throw new Error("Question not found");
  }

  // Check if question is active
  if (question.status !== "active") {
    throw new Error("Question is not currently accepting votes");
  }

  // Check if question has expired
  if (question.endTime && question.endTime < new Date()) {
    throw new Error("Question voting period has ended");
  }

  // Check room membership
  const membership = await RoomMember.findOne({
    roomId: question.roomId,
    userId,
    status: "active",
  });

  if (!membership) {
    throw new Error("User is not a member of this room");
  }

  // Check if user has already voted
  const existingVote = await Vote.findOne({
    questionId,
    votedBy: userId,
  });

  if (existingVote) {
    throw new Error("User has already voted on this question");
  }

  return {
    question,
    membership,
    canVote: true,
  };
};

/**
 * Get voting options for a question
 */
const getVotingOptions = async (questionId, userId) => {
  const question = await Question.findById(questionId);
  if (!question) {
    throw new Error("Question not found");
  }

  let options = [];

  if (question.questionType === "member_voting") {
    // Get room members as voting options
    let membersQuery = {
      roomId: question.roomId,
      status: "active",
    };

    // Exclude self if self-voting is not allowed
    if (!question.settings.allowSelfVoting) {
      membersQuery.userId = { $ne: userId };
    }

    const members = await RoomMember.find(membersQuery).populate(
      "userId",
      "username email",
    );

    options = members.map((member) => ({
      type: "user",
      userId: member.userId._id,
      username: member.userId.username,
      email: member.userId.email,
    }));
  } else {
    // Custom options
    options = question.customOptions.map((option) => ({
      type: "option",
      optionId: option.optionId,
      optionText: option.optionText,
    }));
  }

  return {
    question,
    options,
  };
};

export {
  checkUserRoomAccess,
  getRoomWithValidation,
  getRoomStats,
  cleanExpiredInvites,
  validateRoomCapacity,
  validateVotingEligibility,
  getVotingOptions,
};
