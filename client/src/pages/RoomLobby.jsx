import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showError, showSuccess } from "../store/slices/notificationSlice";
import api from "../config/api";
import RoomLobbyContent from "../components/Room/RoomLobbyContent";

function RoomLobby() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRoomDetails = async () => {
    try {
      const { data } = await api.get(`/rooms/${roomId}`);
      if (data.success) {
        setRoomData(data.data);
      }
    } catch (err) {
      dispatch(
        showError({
          message: err.response?.data?.message || "Failed to load room",
        }),
      );
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomDetails();
  }, [roomId]);

  const handleStartVoting = () => {
    navigate(`/room/${roomId}/vote`);
  };

  const handleLeaveRoom = async () => {
    try {
      const { data } = await api.post(`/rooms/${roomId}/leave`);
      if (data.success) {
        dispatch(showSuccess({ message: "Left room successfully" }));
        navigate("/");
      }
    } catch (err) {
      dispatch(
        showError({
          message: err.response?.data?.message || "Failed to leave room",
        }),
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading room...</div>
      </div>
    );
  }

  if (!roomData) return null;

  return (
    <RoomLobbyContent
      roomId={roomId}
      room={roomData.room}
      members={roomData.members}
      userRole={roomData.userRole}
      onRefresh={fetchRoomDetails}
      onStartVoting={handleStartVoting}
      onLeaveRoom={handleLeaveRoom}
    />
  );
}

export default RoomLobby;
