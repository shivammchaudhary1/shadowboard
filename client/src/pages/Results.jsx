import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showError } from "../store/slices/notificationSlice";
import api from "../config/api";
import QuestionDisplay from "../components/Game/QuestionDisplay";
import ResultsDisplay from "../components/Game/ResultsDisplay";

function Results() {
  const { roomId, questionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const { data } = await api.get(
          `/votes/questions/${questionId}/results`,
        );
        if (data.success) {
          setResults(data.data);
        }
      } catch (err) {
        dispatch(
          showError({
            message: err.response?.data?.message || "Failed to load results",
          }),
        );
        navigate(`/room/${roomId}`);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [questionId, roomId, navigate, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading results...</div>
      </div>
    );
  }

  if (!results) return null;

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
          <h1 className="text-lg font-bold text-white">Results</h1>
          <div className="w-12" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
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
        <button
          onClick={() => navigate(`/room/${roomId}`)}
          className="mt-8 w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg"
        >
          Back to Lobby
        </button>
      </main>
    </div>
  );
}

export default Results;
