function LoadingSpinner({ size = "md" }) {
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div
      className={`${sizeClasses[size] || sizeClasses.md} border-slate-600 border-t-indigo-500 rounded-full animate-spin`}
      role="status"
      aria-label="Loading"
    />
  );
}

export default LoadingSpinner;
