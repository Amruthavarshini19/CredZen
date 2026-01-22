import { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { MCQQuestion } from './lessonData';
import { Button } from '@/app/components/ui/button';

interface MCQViewerProps {
  questions: MCQQuestion[];
  onComplete: (score: number, totalQuestions: number) => void;
}

export function MCQViewer({ questions, onComplete }: MCQViewerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    Array(questions.length).fill(null)
  );
  const [showResult, setShowResult] = useState(false);
  const [submittedAnswers, setSubmittedAnswers] = useState<(number | null)[]>(
    Array(questions.length).fill(null)
  );

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = selectedAnswers[currentQuestionIndex];
  const isAnswered = currentAnswer !== null;
  const isCorrect = isAnswered && currentAnswer === currentQuestion.correctAnswer;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleSelectOption = (optionIndex: number) => {
    if (!showResult) {
      const newAnswers = [...selectedAnswers];
      newAnswers[currentQuestionIndex] = optionIndex;
      setSelectedAnswers(newAnswers);
    }
  };

  const handleSubmitAnswer = () => {
    if (isAnswered && !showResult) {
      setShowResult(true);
      const newSubmittedAnswers = [...submittedAnswers];
      newSubmittedAnswers[currentQuestionIndex] = currentAnswer;
      setSubmittedAnswers(newSubmittedAnswers);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowResult(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowResult(false);
    }
  };

  const handleFinish = () => {
    const correctCount = submittedAnswers.filter(
      (answer, idx) => answer === questions[idx].correctAnswer
    ).length;
    onComplete(correctCount, questions.length);
  };

  const allAnswered = selectedAnswers.every(answer => answer !== null);
  const allSubmitted = submittedAnswers.every(answer => answer !== null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Practice Questions</h3>
          <span className="text-sm font-medium text-gray-300">
            {currentQuestionIndex + 1} / {questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
        <p className="text-lg font-semibold text-white mb-2">{currentQuestion.question}</p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {currentQuestion.options.map((option, index) => {
          const isSelected = currentAnswer === index;
          const isSubmitted = submittedAnswers[currentQuestionIndex] !== null;
          const isOptionCorrect = index === currentQuestion.correctAnswer;
          const showCorrectAnswer = isSubmitted && isOptionCorrect;
          const showWrongAnswer = isSubmitted && isSelected && !isCorrect;

          return (
            <button
              key={index}
              onClick={() => handleSelectOption(index)}
              disabled={isSubmitted}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 font-medium flex items-start gap-3 ${
                showCorrectAnswer
                  ? 'bg-green-500/20 border-green-500 text-green-100'
                  : showWrongAnswer
                  ? 'bg-red-500/20 border-red-500 text-red-100'
                  : isSelected && !isSubmitted
                  ? 'bg-blue-500/20 border-blue-400 text-blue-100'
                  : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-gray-600 hover:bg-gray-800'
              } ${isSubmitted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 text-sm font-bold">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="flex-1">{option}</span>
              {showCorrectAnswer && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
              {showWrongAnswer && <XCircle className="w-5 h-5 flex-shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Result/Explanation */}
      {showResult && (
        <div
          className={`border-l-4 rounded-lg p-4 ${
            isCorrect
              ? 'bg-green-500/10 border-green-500 text-green-100'
              : 'bg-red-500/10 border-red-500 text-red-100'
          }`}
        >
          <p className="font-semibold mb-2">
            {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
          </p>
          <p className="text-sm">{currentQuestion.explanation}</p>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3">
        <Button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white"
        >
          Previous
        </Button>

        {!showResult && !isAnswered && (
          <Button
            disabled
            className="flex-1 bg-gray-600 text-gray-400 cursor-not-allowed"
          >
            Select an answer to continue
          </Button>
        )}

        {!showResult && isAnswered && (
          <Button
            onClick={handleSubmitAnswer}
            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
          >
            Submit Answer
          </Button>
        )}

        {showResult && currentQuestionIndex < questions.length - 1 && (
          <Button
            onClick={handleNext}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            Next Question
          </Button>
        )}

        {showResult && currentQuestionIndex === questions.length - 1 && allSubmitted && (
          <Button
            onClick={handleFinish}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
          >
            Finish Quiz
          </Button>
        )}
      </div>

      {/* Answer Summary */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
        <p className="text-xs font-medium text-gray-400 mb-3">QUESTIONS ANSWERED</p>
        <div className="flex flex-wrap gap-2">
          {questions.map((_, idx) => {
            const isAnswered = submittedAnswers[idx] !== null;
            const isQCorrect = submittedAnswers[idx] === questions[idx].correctAnswer;
            return (
              <button
                key={idx}
                onClick={() => {
                  setCurrentQuestionIndex(idx);
                  setShowResult(false);
                }}
                className={`w-8 h-8 rounded-lg font-semibold text-xs transition-all ${
                  isAnswered
                    ? isQCorrect
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
