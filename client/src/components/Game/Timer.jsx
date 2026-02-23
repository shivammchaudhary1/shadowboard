/**
 * Countdown timer component - displays remaining seconds with visual indicator
 */
function Timer({ secondsRemaining, totalSeconds, onExpire }) {
  const percentage = totalSeconds > 0 ? (secondsRemaining / totalSeconds) * 100 : 0;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-20">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-slate-700"
          />
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={`${percentage}, 100`}
            className="text-indigo-500 transition-all duration-1000"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white">
          {secondsRemaining}
        </span>
      </div>
      <span className="text-slate-400 text-sm">seconds left</span>
    </div>
  );
}

export default Timer;
