function ResultsDisplay({ results, questionType, totalVotes, isAnonymous }) {
  return (
    <div className="space-y-4">
      <p className="text-slate-400 text-center text-sm">
        Total votes: {totalVotes}
        {isAnonymous && " (anonymous)"}
      </p>
      <div className="space-y-3">
        {results.map((r, idx) => (
          <div
            key={r.type === "user" ? r.user.userId : r.option.optionId}
            className="bg-slate-800 rounded-xl p-4 border border-slate-700"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-medium">
                {r.type === "user" ? r.user.username : r.option.optionText}
              </span>
              <span className="text-indigo-400 font-semibold">
                {r.voteCount} {r.voteCount === 1 ? "vote" : "votes"}
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${totalVotes > 0 ? (r.voteCount / totalVotes) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResultsDisplay;
