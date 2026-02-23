import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { showSuccess, showError } from "../store/slices/notificationSlice";
import api from "../config/api";
import CreateRoomForm from "../components/Room/CreateRoomForm";
import JoinRoomForm from "../components/Room/JoinRoomForm";

function Home() {
  const [activeTab, setActiveTab] = useState("create");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleRoomCreated = (roomId) => {
    dispatch(showSuccess({ message: "Room created successfully!" }));
    navigate(`/room/${roomId}`);
  };

  const handleRoomJoined = (roomId) => {
    dispatch(showSuccess({ message: "Joined room successfully!" }));
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">🎯 Shadow Board</h1>
          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-sm">{user?.username}</span>
            <button
              onClick={() => navigate("/notification-test")}
              className="text-slate-400 hover:text-white text-sm"
            >
              Test
            </button>
            <button
              onClick={() => dispatch(logout()) && navigate("/login")}
              className="text-slate-400 hover:text-white text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-white text-center mb-2">
          Voting Game
        </h2>
        <p className="text-slate-400 text-center mb-8">
          Create a room or join an existing one to start voting
        </p>

        {/* Tab switcher */}
        <div className="flex rounded-lg bg-slate-800 p-1 mb-8">
          <button
            onClick={() => setActiveTab("create")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "create"
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Create Room
          </button>
          <button
            onClick={() => setActiveTab("join")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "join"
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Join Room
          </button>
        </div>

        {activeTab === "create" ? (
          <CreateRoomForm onSuccess={handleRoomCreated} />
        ) : (
          <JoinRoomForm onSuccess={handleRoomJoined} />
        )}
      </main>
    </div>
  );
}

export default Home;
