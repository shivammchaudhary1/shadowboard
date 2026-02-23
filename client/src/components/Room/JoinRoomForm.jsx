import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showError } from "../../store/slices/notificationSlice";
import api from "../../config/api";

function JoinRoomForm({ onSuccess }) {
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get("token");

  const [roomId, setRoomId] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleJoinByRoomId = async (e) => {
    e.preventDefault();
    const id = roomId.trim();
    if (!id || id.length !== 6) {
      dispatch(showError({ message: "Enter a valid 6-character room ID" }));
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post(`/rooms/${id}/join`);
      if (data.success) {
        onSuccess(data.data.roomId);
      }
    } catch (err) {
      dispatch(
        showError({
          message: err.response?.data?.message || "Failed to join room",
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleJoinByInvite = async (e) => {
    e.preventDefault();
    if (!inviteToken) return;
    setLoading(true);
    try {
      const { data } = await api.post("/invites/join", { token: inviteToken });
      if (data.success) {
        onSuccess(data.data.roomId);
      }
    } catch (err) {
      dispatch(
        showError({
          message: err.response?.data?.message || "Invalid or expired invite",
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  if (inviteToken) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <p className="text-slate-300 mb-4">
          You&apos;ve been invited to join a room. Click below to join.
        </p>
        <button
          onClick={handleJoinByInvite}
          disabled={loading}
          className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg disabled:opacity-50"
        >
          {loading ? "Joining..." : "Join via Invite"}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleJoinByRoomId}
      className="bg-slate-800 rounded-xl p-6 border border-slate-700"
    >
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Room ID (6 characters)
        </label>
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value.replace(/\s/g, "").slice(0, 6))}
          className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 font-mono text-center text-lg tracking-widest uppercase"
          placeholder="abc123"
          maxLength={6}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg disabled:opacity-50"
      >
        {loading ? "Joining..." : "Join Room"}
      </button>
    </form>
  );
}

export default JoinRoomForm;
