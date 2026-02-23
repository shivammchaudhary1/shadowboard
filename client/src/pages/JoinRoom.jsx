import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showSuccess, showError } from "../store/slices/notificationSlice";
import api from "../config/api";

/**
 * Join room via invite link (?token=xxx)
 * User must be logged in - ProtectedRoute wraps this
 */
function JoinRoom() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const { data } = await api.post("/invites/join", { token });
      if (data.success) {
        dispatch(showSuccess({ message: "Joined room successfully!" }));
        navigate(`/room/${data.data.roomId}`);
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

  if (!token) {
    navigate("/", { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 max-w-md w-full text-center">
        <h1 className="text-xl font-bold text-white mb-2">
          You&apos;ve been invited!
        </h1>
        <p className="text-slate-400 mb-6">
          Join the voting room to participate.
        </p>
        <button
          onClick={handleJoin}
          disabled={loading}
          className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg disabled:opacity-50"
        >
          {loading ? "Joining..." : "Join Room"}
        </button>
        <button
          onClick={() => navigate("/")}
          className="mt-4 text-slate-400 hover:text-white text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default JoinRoom;
