import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError } from "../../store/slices/notificationSlice";
import { useDispatch } from "react-redux";
import api from "../../config/api";
import CreateQuestionModal from "../Game/CreateQuestionModal";

function RoomLobbyContent({
  roomId,
  room,
  members,
  userRole,
  onRefresh,
  onStartVoting,
  onLeaveRoom,
}) {
  const [showCreateQuestion, setShowCreateQuestion] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    dispatch(showSuccess({ message: "Room ID copied to clipboard!" }));
  };

  const fetchQuestions = useCallback(async () => {
    setLoadingQuestions(true);
    try {
      const { data } = await api.get(`/questions/rooms/${roomId}/questions`);
      if (data.success) {
        setQuestions(data.data.questions);
      }
    } catch (err) {
      dispatch(showError({ message: "Failed to load questions" }));
    } finally {
      setLoadingQuestions(false);
    }
  }, [roomId, dispatch]);

  const handleQuestionCreated = () => {
    setShowCreateQuestion(false);
    fetchQuestions();
    onRefresh();
  };

  const handleStartQuestion = async (questionId) => {
    try {
      const { data } = await api.patch(
        `/questions/questions/${questionId}/start`,
        {},
      );
      if (data.success) {
        dispatch(showSuccess({ message: "Voting started!" }));
        navigate(`/room/${roomId}/vote`);
      }
    } catch (err) {
      dispatch(
        showError({
          message: err.response?.data?.message || "Failed to start question",
        }),
      );
    }
  };

  const isHost = userRole === "host";

  useEffect(() => {
    if (isHost) fetchQuestions();
  }, [isHost, fetchQuestions]);

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-slate-800 border-b border-slate-700 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="text-slate-400 hover:text-white"
          >
            ← Back
          </button>
          <h1 className="text-lg font-bold text-white truncate max-w-[200px]">
            {room?.name}
          </h1>
          <button
            onClick={onLeaveRoom}
            className="text-red-400 hover:text-red-300 text-sm"
          >
            Leave
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Room info & share */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-6">
          <h2 className="text-white font-semibold mb-2">Room Code</h2>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-mono font-bold text-indigo-400 tracking-widest">
              {roomId}
            </span>
            <button
              onClick={copyRoomId}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-slate-300"
            >
              Copy
            </button>
          </div>
          {room?.settings?.isAnonymousVoting && (
            <p className="mt-2 text-amber-400 text-sm">Anonymous voting enabled</p>
          )}
        </div>

        {/* Members list */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-6">
          <h2 className="text-white font-semibold mb-4">
            Members ({members?.length || 0})
          </h2>
          <ul className="space-y-2">
            {members?.map((m) => (
              <li
                key={m.userId}
                className="flex items-center gap-2 text-slate-300"
              >
                <span className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-sm">
                  {m.username?.[0]?.toUpperCase() || "?"}
                </span>
                <span>{m.username}</span>
                {m.role === "host" && (
                  <span className="text-xs bg-indigo-600/30 text-indigo-300 px-2 py-0.5 rounded">
                    Host
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Host: Create question & questions list */}
        {isHost && (
          <>
            <button
              onClick={() => setShowCreateQuestion(true)}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg mb-4"
            >
              + Create Question
            </button>

            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-white font-semibold mb-4">Questions</h2>
              {!loadingQuestions && questions.length === 0 ? (
                <p className="text-slate-400 text-sm">
                  No questions yet. Create one to start voting.
                </p>
              ) : (
                <ul className="space-y-2">
                  {questions.map((q) => (
                    <li
                      key={q.questionId}
                      className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0"
                    >
                      <span className="text-slate-300 truncate flex-1">
                        {q.questionText}
                      </span>
                      {q.status === "draft" && (
                        <button
                          onClick={() => handleStartQuestion(q.questionId)}
                          className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                        >
                          Start
                        </button>
                      )}
                      {q.status === "active" && (
                        <button
                          onClick={() => navigate(`/room/${roomId}/vote`)}
                          className="text-green-400 text-sm"
                        >
                          Voting...
                        </button>
                      )}
                      {q.status === "completed" && (
                        <button
                          onClick={() =>
                            navigate(
                              `/room/${roomId}/results/${q.questionId}`,
                            )
                          }
                          className="text-slate-400 text-sm"
                        >
                          View results
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}

        {/* Member: Start voting if host has started */}
        {!isHost && (
          <button
            onClick={onStartVoting}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg"
          >
            Go to Voting
          </button>
        )}
      </main>

      {showCreateQuestion && (
        <CreateQuestionModal
          roomId={roomId}
          onClose={() => setShowCreateQuestion(false)}
          onSuccess={handleQuestionCreated}
        />
      )}
    </div>
  );
}

export default RoomLobbyContent;
