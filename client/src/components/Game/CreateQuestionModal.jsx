import { useState } from "react";
import { useDispatch } from "react-redux";
import { showError } from "../../store/slices/notificationSlice";
import api from "../../config/api";

function CreateQuestionModal({ roomId, onClose, onSuccess }) {
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("member_voting");
  const [customOptions, setCustomOptions] = useState(["", ""]);
  const [timeLimit, setTimeLimit] = useState(15);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const addOption = () => {
    setCustomOptions([...customOptions, ""]);
  };

  const updateOption = (index, value) => {
    const updated = [...customOptions];
    updated[index] = value;
    setCustomOptions(updated);
  };

  const removeOption = (index) => {
    if (customOptions.length <= 2) return;
    setCustomOptions(customOptions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!questionText.trim()) {
      dispatch(showError({ message: "Question text is required" }));
      return;
    }
    if (questionType === "custom_options") {
      const valid = customOptions.filter((o) => o.trim());
      if (valid.length < 2) {
        dispatch(showError({ message: "At least 2 options required" }));
        return;
      }
    }
    setLoading(true);
    try {
      const payload = {
        questionText: questionText.trim(),
        questionType,
        settings: {
          timeLimit: timeLimit / 60,
        },
      };
      if (questionType === "custom_options") {
        payload.customOptions = customOptions
          .filter((o) => o.trim())
          .map((optionText) => ({ optionText: optionText.trim() }));
      }
      const { data } = await api.post(
        `/questions/rooms/${roomId}/questions`,
        payload,
      );
      if (data.success) {
        onSuccess();
      }
    } catch (err) {
      dispatch(
        showError({
          message: err.response?.data?.message || "Failed to create question",
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-700">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Create Question
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Question *
              </label>
              <input
                type="text"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-500"
                placeholder="e.g. Most handsome person?"
                maxLength={500}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Type
              </label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white"
              >
                <option value="member_voting">Vote for room members</option>
                <option value="custom_options">Custom options</option>
              </select>
            </div>
            {questionType === "custom_options" && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Options (min 2)
                </label>
                {customOptions.map((opt, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => updateOption(i, e.target.value)}
                      className="flex-1 px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white"
                      placeholder={`Option ${i + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeOption(i)}
                      disabled={customOptions.length <= 2}
                      className="px-3 text-red-400 hover:text-red-300 disabled:opacity-30"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addOption}
                  className="text-indigo-400 hover:text-indigo-300 text-sm"
                >
                  + Add option
                </button>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Voting time (seconds)
              </label>
              <select
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white"
              >
                <option value={15}>15 seconds</option>
                <option value={20}>20 seconds</option>
                <option value={30}>30 seconds</option>
                <option value={60}>60 seconds</option>
              </select>
            </div>
            <div className="flex gap-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateQuestionModal;
