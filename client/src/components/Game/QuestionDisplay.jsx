function QuestionDisplay({ questionText, isAnonymous }) {
  return (
    <div className="text-center mb-6">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
        {questionText}
      </h2>
      {isAnonymous && (
        <p className="text-amber-400 text-sm">Votes are anonymous</p>
      )}
    </div>
  );
}

export default QuestionDisplay;
