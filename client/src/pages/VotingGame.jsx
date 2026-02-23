import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showError, showSuccess } from "../store/slices/notificationSlice";
import api from "../config/api";
import Timer from "../components/Game/Timer";
import QuestionDisplay from "../components/Game/QuestionDisplay";
import VotingPanel from "../components/Game/VotingPanel";
import ResultsDisplay from "../components/Game/ResultsDisplay";

function VotingGame() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [results, setResults] = useState(null);
  const [phase, setPhase] = useState("voting"); // voting | ended | results
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const timerRef = useRef(null);

  const fetchActiveQuestion = useCallback(async () => {
    try {
      const { data } = await api.get(
        `/questions/rooms/${roomId}/questions/active`,
      );
      if (data.success && data.data.question) {
        setActiveQuestion(data.data);
        setPhase("voting");
        setVoted(false);
        setSelectedId(null);
        setResults(null);

        const q = data.data.question;
        const timeLimit = q.settings?.timeLimit;
        let totalSeconds = 15;
        if (timeLimit && timeLimit > 0) {
          totalSeconds = Math.round(timeLimit * 60);
        }
        if (q.startTime && q.endTime) {
          const endMs = new Date(q.endTime).getTime();
          const now = Date.now();
          const remaining = Math.max(0, Math.ceil((endMs - now) / 1000));
          setSecondsRemaining(Math.min(remaining, totalSeconds));
        } else {
          setSecondsRemaining(totalSeconds);
        }
      } else {
        setActiveQuestion(null);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setActiveQuestion(null);
      } else {
        dispatch(showError({ message: "Failed to load question" }));
      }
    } finally {
      setLoading(false);
    }
  }, [roomId, dispatch]);

  useEffect(() => {
    fetchActiveQuestion();
  }, [fetchActiveQuestion]);

  const submitVote = useCallback(
    async (id) => {
      const q = activeQuestion?.question;
      if (!q) return;
      try {
        const payload =
          q.questionType === "member_voting"
            ? { votedForUser: id }
            : { votedForOption: id };
        const { data } = await api.post(
          `/votes/questions/${q.questionId}/vote`,
          payload,
        );
        if (data.success) {
          setVoted(true);
          dispatch(showSuccess({ message: "Vote submitted!" }));
        }
      } catch (err) {
        dispatch(
          showError({
            message: err.response?.data?.message || "Failed to submit vote",
          }),
        );
      }
    },
    [activeQuestion, dispatch],
  );

  const fetchResults = useCallback(async () => {
    if (!activeQuestion?.question) return;
    try {
      const { data } = await api.get(
        `/votes/questions/${activeQuestion.question.questionId}/results`,
      );
      if (data.success) {
        setResults(data.data);
        setPhase("results");
      }
    } catch (err) {
      dispatch(showError({ message: "Failed to load results" }));
    }
  }, [activeQuestion, dispatch]);

  const handleTimerExpire = useCallback(async () => {
    setPhase("ended");
    if (!voted && selectedId && activeQuestion?.question) {
      await submitVote(selectedId);
    }
    fetchResults();
  }, [activeQuestion, voted, selectedId, submitVote, fetchResults]);

  useEffect(() => {
    if (phase !== "voting" || secondsRemaining <= 0 || !activeQuestion) return;

    timerRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimerExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [
    phase,
    secondsRemaining,
    activeQuestion?.question?.questionId,
    handleTimerExpire,
  ]);

  const handleVoteSelect = (id) => {
    setSelectedId(id);
  };

  const handleSubmitVote = () => {
    if (selectedId && !voted) {
      submitVote(selectedId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!activeQuestion && !results) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4">
        <p className="text-slate-400 text-center mb-4">
          No active question. Wait for the host to start one.
        </p>
        <button
          onClick={() => navigate(`/room/${roomId}`)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg"
        >
          Back to Lobby
        </button>
      </div>
    );
  }

  const q = activeQuestion?.question;
  const options = activeQuestion?.availableOptions || [];
  const totalSeconds = q?.settings?.timeLimit
    ? Math.round(q.settings.timeLimit * 60)
    : 15;

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-slate-800 border-b border-slate-700 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(`/room/${roomId}`)}
            className="text-slate-400 hover:text-white"
          >
            ← Lobby
          </button>
          <h1 className="text-lg font-bold text-white">Voting</h1>
          <div className="w-12" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {phase === "results" && results ? (
          <>
            <QuestionDisplay
              questionText={results.question.questionText}
              isAnonymous={results.question.settings?.isAnonymous}
            />
            <ResultsDisplay
              results={results.results}
              questionType={results.question.questionType}
              totalVotes={results.totalVotes}
              isAnonymous={results.question.settings?.isAnonymous}
            />
            <div className="mt-8 flex gap-2">
              <button
                onClick={() => navigate(`/room/${roomId}`)}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg"
              >
                Back to Lobby
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <Timer
                secondsRemaining={secondsRemaining}
                totalSeconds={totalSeconds}
                onExpire={handleTimerExpire}
              />
            </div>
            <QuestionDisplay
              questionText={q?.questionText}
              isAnonymous={q?.settings?.isAnonymous}
            />
            <VotingPanel
              options={options}
              questionType={q?.questionType}
              selectedId={selectedId}
              onSelect={handleVoteSelect}
              disabled={voted || phase === "ended"}
            />
            {!voted && selectedId && phase === "voting" && (
              <button
                onClick={handleSubmitVote}
                className="mt-6 w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg"
              >
                Submit Vote
              </button>
            )}
            {voted && phase === "voting" && (
              <p className="mt-4 text-center text-green-400">Vote submitted!</p>
            )}
            {phase === "ended" && !results && (
              <p className="mt-4 text-center text-slate-400">
                Loading results...
              </p>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default VotingGame;
