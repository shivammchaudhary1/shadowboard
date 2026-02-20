import { nanoid } from "nanoid";
import Invite from "../models/invite.model.js";
import Room from "../models/room.model.js";
import RoomMember from "../models/roomMember.model.js";
import UserModel from "../models/user.model.js";
import { sendMail } from "../config/libraries/nodeMailer.js";
import config from "../config/envs/default.js";

/**
 * Email template for room invitations
 */
const createInviteEmailTemplate = (
  inviterName,
  roomName,
  roomId,
  inviteLink,
) => {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .room-info { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .button { display: inline-block; background-color: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #6B7280; font-size: 14px; }
        .room-id { font-size: 24px; font-weight: bold; color: #4F46E5; letter-spacing: 2px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 You're Invited to Join a Voting Room!</h1>
        </div>
        <div class="content">
            <p>Hi there!</p>
            <p><strong>${inviterName}</strong> has invited you to join a voting room on Shadow Board.</p>
            
            <div class="room-info">
                <h3>Room Details:</h3>
                <p><strong>Room Name:</strong> ${roomName}</p>
                <p><strong>Room ID:</strong> <span class="room-id">${roomId}</span></p>
                <p><strong>Invited by:</strong> ${inviterName}</p>
            </div>
            
            <p>You can join the room in two ways:</p>
            <ol>
                <li><strong>Quick Join:</strong> <a href="${inviteLink}" class="button">Join Room Now</a></li>
                <li><strong>Manual Join:</strong> Go to Shadow Board and enter room ID: <strong>${roomId}</strong></li>
            </ol>
            
            <p>Get ready to participate in fun voting sessions and see what the group thinks!</p>
        </div>
        <div class="footer">
            <p>© 2026 Shadow Board. Happy Voting! 🗳️</p>
        </div>
    </div>
</body>
</html>
  `;
};

/**
 * Send room invitation via email (host only)
 */
const sendRoomInvite = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { email, message } = req.body;
    const userId = req.userId;

    // Validate email
    if (!email || !email.trim()) {
      return res.status(400).json({
        message: "Email address is required",
        success: false,
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        message: "Invalid email address format",
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
        message: "Only the room host can send invitations",
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

    if (room.status === "closed" || room.status === "completed") {
      return res.status(403).json({
        message: "Cannot send invitations for a closed room",
        success: false,
      });
    }

    // Check if user is already a member
    const existingMember = await RoomMember.findOne({
      roomId,
      status: "active",
    }).populate("userId", "email");

    const memberEmails = existingMember ? [existingMember.userId.email] : [];
    if (memberEmails.includes(email.trim().toLowerCase())) {
      return res.status(400).json({
        message: "User is already a member of this room",
        success: false,
      });
    }

    // Check if invitation already exists and is still valid
    const existingInvite = await Invite.findOne({
      roomId,
      email: email.trim().toLowerCase(),
      status: "sent",
      expiresAt: { $gt: new Date() },
    });

    if (existingInvite) {
      return res.status(400).json({
        message: "An active invitation has already been sent to this email",
        success: false,
      });
    }

    // Generate invite token and create invite record
    const inviteToken = nanoid(32);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const invite = new Invite({
      roomId,
      invitedBy: userId,
      email: email.trim().toLowerCase(),
      inviteToken,
      expiresAt,
    });

    await invite.save();

    // Create invitation link
    const inviteLink = `${config.frontendUrl}/join-room?token=${inviteToken}`;

    // Send email
    const emailSubject = `🎯 Invitation to join "${room.name}" - Shadow Board`;
    const emailContent = createInviteEmailTemplate(
      room.hostId.username,
      room.name,
      roomId,
      inviteLink,
    );

    const emailResult = await sendMail(
      email.trim(),
      emailSubject,
      emailContent,
    );

    if (emailResult.success) {
      res.status(200).json({
        message: "Invitation sent successfully",
        success: true,
        data: {
          email: email.trim(),
          inviteToken,
          expiresAt,
          inviteLink,
        },
      });
    } else {
      // Delete the invite record if email failed
      await Invite.findByIdAndDelete(invite._id);

      res.status(500).json({
        message: "Failed to send invitation email",
        success: false,
        error: emailResult.error,
      });
    }
  } catch (error) {
    console.error("Error sending room invite:", error);
    res.status(500).json({
      message: "Failed to send invitation",
      success: false,
    });
  }
};

/**
 * Join room via invitation token
 */
const joinRoomViaInvite = async (req, res) => {
  try {
    const { token } = req.body;
    const userId = req.userId;

    if (!token) {
      return res.status(400).json({
        message: "Invitation token is required",
        success: false,
      });
    }

    // Find valid invitation
    const invite = await Invite.findOne({
      inviteToken: token,
      status: "sent",
      expiresAt: { $gt: new Date() },
    });

    if (!invite) {
      return res.status(404).json({
        message: "Invalid or expired invitation token",
        success: false,
      });
    }

    // Check if room still exists and is active
    const room = await Room.findOne({ roomId: invite.roomId });
    if (!room) {
      return res.status(404).json({
        message: "Room not found",
        success: false,
      });
    }

    if (room.status === "closed" || room.status === "completed") {
      return res.status(403).json({
        message: "Room is no longer accepting new members",
        success: false,
      });
    }

    // Check if user is already a member
    const existingMember = await RoomMember.findOne({
      roomId: invite.roomId,
      userId,
      status: "active",
    });

    if (existingMember) {
      // Mark invite as accepted even if user is already a member
      invite.status = "accepted";
      invite.acceptedAt = new Date();
      invite.acceptedBy = userId;
      await invite.save();

      return res.status(200).json({
        message: "You are already a member of this room",
        success: true,
        data: {
          roomId: invite.roomId,
          roomName: room.name,
          role: existingMember.role,
          alreadyMember: true,
        },
      });
    }

    // Check room capacity
    const activeMembersCount = await RoomMember.countDocuments({
      roomId: invite.roomId,
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
      roomId: invite.roomId,
      userId,
      role: "member",
      status: "active",
    });
    await newMember.save();

    // Mark invite as accepted
    invite.status = "accepted";
    invite.acceptedAt = new Date();
    invite.acceptedBy = userId;
    await invite.save();

    // Get user details for response
    const user = await UserModel.findById(userId).select("username email");

    res.status(200).json({
      message: "Successfully joined room via invitation",
      success: true,
      data: {
        roomId: invite.roomId,
        roomName: room.name,
        role: "member",
        joinedAt: newMember.joinedAt,
        user: {
          username: user.username,
          email: user.email,
        },
        alreadyMember: false,
      },
    });
  } catch (error) {
    console.error("Error joining room via invite:", error);
    res.status(500).json({
      message: "Failed to join room via invitation",
      success: false,
    });
  }
};

/**
 * Get room invitations (host only)
 */
const getRoomInvites = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.userId;
    const { status } = req.query;

    // Check if user is the host of the room
    const membership = await RoomMember.findOne({
      roomId,
      userId,
      role: "host",
      status: "active",
    });

    if (!membership) {
      return res.status(403).json({
        message: "Only the room host can view invitations",
        success: false,
      });
    }

    // Build query filter
    let queryFilter = { roomId };
    if (status) {
      queryFilter.status = status;
    }

    // Get invitations with inviter details
    const invites = await Invite.find(queryFilter)
      .populate("invitedBy", "username email")
      .populate("acceptedBy", "username email")
      .sort({ createdAt: -1 });

    const invitesData = invites.map((invite) => ({
      inviteId: invite._id,
      email: invite.email,
      status: invite.status,
      invitedBy: {
        userId: invite.invitedBy._id,
        username: invite.invitedBy.username,
        email: invite.invitedBy.email,
      },
      acceptedBy: invite.acceptedBy
        ? {
            userId: invite.acceptedBy._id,
            username: invite.acceptedBy.username,
            email: invite.acceptedBy.email,
          }
        : null,
      createdAt: invite.createdAt,
      expiresAt: invite.expiresAt,
      acceptedAt: invite.acceptedAt,
    }));

    res.status(200).json({
      message: "Room invitations retrieved successfully",
      success: true,
      data: {
        invites: invitesData,
        count: invitesData.length,
      },
    });
  } catch (error) {
    console.error("Error getting room invites:", error);
    res.status(500).json({
      message: "Failed to get room invitations",
      success: false,
    });
  }
};

export { sendRoomInvite, joinRoomViaInvite, getRoomInvites };
