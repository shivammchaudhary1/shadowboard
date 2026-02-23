import { useState } from "react";
import { useDispatch } from "react-redux";
import { showError } from "../../store/slices/notificationSlice";
import api from "../../config/api";

function CreateRoomForm({ onSuccess }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      dispatch(showError({ message: "Room name is required" }));
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/rooms", {
        name: name.trim(),
        description: description.trim(),
        settings: { isAnonymousVoting: isAnonymous },
      });
      if (data.success) {
        onSuccess(data.data.roomId);
      }
    } catch (err) {
      dispatch(
        showError({
          message: err.response?.data?.message || "Failed to create room",
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-800 rounded-xl p-6 border border-slate-700"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Room Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g. Game Night Voting"
            maxLength={100}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 resize-none"
            placeholder="What's this room about?"
            rows={2}
            maxLength={500}
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="anonymous"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="rounded bg-slate-700 border-slate-600 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="anonymous" className="text-sm text-slate-300">
            Anonymous voting
          </label>
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Room"}
      </button>
    </form>
  );
}

export default CreateRoomForm;
