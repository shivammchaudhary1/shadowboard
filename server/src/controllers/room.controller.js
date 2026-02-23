import { nanoid } from "nanoid";
import Room from "../models/room.model.js";
import RoomMember from "../models/roomMember.model.js";
import UserModel from "../models/user.model.js";

/**
 * Create a new room (authenticated users only)
 * Only the creator becomes the host
 */
const createRoom = async (req, res) => {
  try {
    const { name, description, settings = {} } = req.body;
    const hostId = req.userId;

    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Room name is required",
        success: false,
      });
    }

    // Generate unique 6-character room ID
    const roomId = nanoid(6);

    // Create room with default settings merged with user preferences
    const roomData = {
      roomId,
      hostId,
      name: name.trim(),
      description: description?.trim() || "",
      settings: {
        allowSelfVoting: settings.allowSelfVoting || false,
        hostCanParticipate:
          settings.hostCanParticipate !== undefined
            ? settings.hostCanParticipate
            : true,
        maxMembers: settings.maxMembers || 50,
        isAnonymousVoting: settings.isAnonymousVoting || false,
      },
    };

    const room = new Room(roomData);
    const savedRoom = await room.save();

    // Add host as room member
    const hostMember = new RoomMember({
      roomId,
      userId: hostId,
      role: "host",
      status: "active",
    });
    await hostMember.save();

    res.status(201).json({
      message: "Room created successfully",
      success: true,
      data: {
        roomId: savedRoom.roomId,
        name: savedRoom.name,
        description: savedRoom.description,
        settings: savedRoom.settings,
        status: savedRoom.status,
        createdAt: savedRoom.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({
      message: "Failed to create room",
      success: false,
    });
  }
};

/**
 * Join room by room ID
 * Authenticated users only
 */
const joinRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.userId;

    // Validate room ID format
    if (!roomId || roomId.length !== 6) {
      return res.status(400).json({
        message: "Invalid room ID format",
        success: false,
      });
    }

    // Check if room exists
    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({
        message: "Room not found",
        success: false,
      });
    }

    // Check if room is open for joining
    if (room.status === "closed" || room.status === "completed") {
      return res.status(403).json({
        message: "Room is not accepting new members",
        success: false,
      });
    }

    // Check if user is already in the room
    const existingMember = await RoomMember.findOne({
      roomId,
      userId,
      status: "active",
    });

    if (existingMember) {
      return res.status(400).json({
        message: "You are already a member of this room",
        success: false,
      });
    }

    // Check room capacity
    const activeMembersCount = await RoomMember.countDocuments({
      roomId,
      status: "active",
    });

    if (activeMembersCount >= room.settings.maxMembers) {
      return res.status(403).json({
        message: "Room has reached maximum capacity",
        success: false,
      });
    }

    // Add user as room member
    const newMember = new RoomMember({
      roomId,
      userId,
      role: "member",
      status: "active",
    });
    await newMember.save();

    // Get user details for response
    const user = await UserModel.findById(userId).select("username email");

    res.status(200).json({
      message: "Joined room successfully",
      success: true,
      data: {
        roomId,
        roomName: room.name,
        role: "member",
        joinedAt: newMember.joinedAt,
        user: {
          username: user.username,
          email: user.email,
        },
      },
    });
  } catch (error) {
    console.error("Error joining room:", error);
    res.status(500).json({
      message: "Failed to join room",
      success: false,
    });
  }
};

/**
 * Get room details with members
 * Only accessible to room members
 */
const getRoomDetails = async (req, res) => {
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

    // Get room details
    const room = await Room.findOne({ roomId }).populate(
      "hostId",
      "username email",
    );

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
        success: false,
      });
    }

    // Get all active members with user details
    const members = await RoomMember.find({
      roomId,
      status: "active",
    })
      .populate("userId", "username email")
      .sort({ joinedAt: 1 });

    const membersData = members.map((member) => ({
      userId: member.userId._id,
      username: member.userId.username,
      email: member.userId.email,
      role: member.role,
      joinedAt: member.joinedAt,
    }));

    res.status(200).json({
      message: "Room details retrieved successfully",
      success: true,
      data: {
        room: {
          roomId: room.roomId,
          name: room.name,
          description: room.description,
          settings: room.settings,
          status: room.status,
          host: {
            userId: room.hostId._id,
            username: room.hostId.username,
            email: room.hostId.email,
          },
          createdAt: room.createdAt,
          updatedAt: room.updatedAt,
        },
        members: membersData,
        memberCount: membersData.length,
        userRole: membership.role,
      },
    });
  } catch (error) {
    console.error("Error getting room details:", error);
    res.status(500).json({
      message: "Failed to get room details",
      success: false,
    });
  }
};

/**
 * Leave room
 * Members can leave, host can close the room
 */
const leaveRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.userId;

    // Find user's membership
    const membership = await RoomMember.findOne({
      roomId,
      userId,
      status: "active",
    });

    if (!membership) {
      return res.status(404).json({
        message: "You are not a member of this room",
        success: false,
      });
    }

    // Update membership status
    membership.status = "left";
    membership.leftAt = new Date();
    await membership.save();

    // If host is leaving, close the room
    if (membership.role === "host") {
      await Room.findOneAndUpdate({ roomId }, { status: "closed" });

      res.status(200).json({
        message: "Room closed successfully",
        success: true,
        data: { roomClosed: true },
      });
    } else {
      res.status(200).json({
        message: "Left room successfully",
        success: true,
        data: { roomClosed: false },
      });
    }
  } catch (error) {
    console.error("Error leaving room:", error);
    res.status(500).json({
      message: "Failed to leave room",
      success: false,
    });
  }
};

/**
 * Get user's rooms (as host or member)
 */
const getUserRooms = async (req, res) => {
  try {
    const userId = req.userId;

    // Get all rooms where user is an active member
    const memberships = await RoomMember.find({
      userId,
      status: "active",
    }).sort({ joinedAt: -1 });

    const roomIds = memberships.map((m) => m.roomId);

    // Get room details
    const rooms = await Room.find({
      roomId: { $in: roomIds },
    })
      .populate("hostId", "username email")
      .sort({ updatedAt: -1 });

    // Combine room data with membership info
    const roomsData = rooms.map((room) => {
      const membership = memberships.find((m) => m.roomId === room.roomId);
      return {
        roomId: room.roomId,
        name: room.name,
        description: room.description,
        status: room.status,
        userRole: membership.role,
        joinedAt: membership.joinedAt,
        host: {
          username: room.hostId.username,
          email: room.hostId.email,
        },
        createdAt: room.createdAt,
        updatedAt: room.updatedAt,
      };
    });

    res.status(200).json({
      message: "User rooms retrieved successfully",
      success: true,
      data: {
        rooms: roomsData,
        count: roomsData.length,
      },
    });
  } catch (error) {
    console.error("Error getting user rooms:", error);
    res.status(500).json({
      message: "Failed to get user rooms",
      success: false,
    });
  }
};

export { createRoom, joinRoom, getRoomDetails, leaveRoom, getUserRooms };
