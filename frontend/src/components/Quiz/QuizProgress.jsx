function QuizProgress({ currentQuestionIndex, totalQuestions }) {
  return (
    <div className="demo-quiz__progress">
      <span>
        Fråga {currentQuestionIndex + 1} av {totalQuestions}
      </span>

      <span>⏱ Ingen timer</span>
    </div>
  );
}

export default QuizProgress;
