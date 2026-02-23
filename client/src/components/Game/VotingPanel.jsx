function VotingPanel({ options, questionType, selectedId, onSelect, disabled }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {options.map((opt) => {
        const id = questionType === "member_voting" ? opt.userId : opt.optionId;
        const label =
          questionType === "member_voting" ? opt.username : opt.optionText;
        const isSelected = selectedId === id;

        return (
          <button
            key={id}
            type="button"
            onClick={() => !disabled && onSelect(id)}
            disabled={disabled}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              isSelected
                ? "border-indigo-500 bg-indigo-500/20 text-white"
                : "border-slate-600 bg-slate-800 hover:border-slate-500 text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
            }`}
          >
            <span className="font-medium">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default VotingPanel;
