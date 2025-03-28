import React, { useState } from 'react';
import { Button, RadioGroup, Radio, Progress } from '@nextui-org/react';
import { ArrowLeft, ArrowRight, Save, LogOut, Clock, CheckCircle2, XCircle, AlertCircle, BookOpen } from 'lucide-react';
import { QuizQuestion as QuizQuestionType } from '../types/quiz';

interface QuizQuestionProps {
  question: QuizQuestionType;
  currentQuestionIndex: number;
  totalQuestions: number;
  timeLeft: { minutes: number; seconds: number } | null;
  selectedAnswer: number | undefined;
  onAnswerSubmit: (questionId: number, answer: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  onSubmitQuiz: () => void;
  submitting: boolean;
  courseName?: string;
  questions: QuizQuestionType[];
  setCurrentQuestionIndex: (index: number) => void;
}

const parseContent = (content: string) => {
  // Remove pre tags
  content = content.replace(/<\/?pre>/g, '');
  
  // Check for image tags
  const imgRegex = /<img[^>]+src="([^">]+)"/g;
  const hasImage = imgRegex.test(content);
  
  // If there's an image, enhance the image tag with responsive classes
  if (hasImage) {
    content = content.replace(imgRegex, (match) => {
      // Add classes for responsive images
      return match.replace('<img', '<img class="max-w-full h-auto rounded-lg shadow-lg"');
    });
  }
  
  // Parse any remaining HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;
  
  return {
    text: tempDiv.textContent || '',
    html: content,
    hasImage
  };
};

export default function QuizQuestion({
  question,
  currentQuestionIndex,
  totalQuestions,
  timeLeft,
  selectedAnswer,
  onAnswerSubmit,
  onPrevious,
  onNext,
  onSubmitQuiz,
  submitting,
  courseName,
  questions,
  setCurrentQuestionIndex,
}: QuizQuestionProps) {
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const attemptedCount = questions.filter(q => q.submitted_answer !== null).length;
  const unattemptedCount = totalQuestions - attemptedCount;
  const progressPercentage = (attemptedCount / totalQuestions) * 100;

  const questionContent = parseContent(question.question);
  const options = question.options.map(option => parseContent(option));

  const handleAnswerSubmit = async (answer: number) => {
    setIsSubmittingAnswer(true);
    await onAnswerSubmit(question.id, answer);
    setIsSubmittingAnswer(false);
  };

  return (
    <div className="space-y-6">
      {/* Header with Progress and Stats */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
              <BookOpen className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {courseName}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {timeLeft && (
              <div className="text-center">
                <div className="flex items-center space-x-2 text-xl font-mono font-bold text-violet-600 dark:text-violet-400">
                  <Clock className="w-5 h-5" />
                  <span>
                    {String(timeLeft.minutes).padStart(2, '0')}:
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Time Left</p>
              </div>
            )}
            <Button
              color="primary"
              startContent={<LogOut className="w-4 h-4" />}
              onClick={onSubmitQuiz}
              isLoading={submitting}
              className="bg-violet-600 hover:bg-violet-700"
            >
              Submit Quiz
            </Button>
          </div>
        </div>

        <Progress 
          value={progressPercentage} 
          className="mb-4"
          color="secondary"
          showValueLabel
          size="lg"
        />

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-violet-50 dark:bg-violet-900/20 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-violet-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{totalQuestions}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Attempted</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{attemptedCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Remaining</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{unattemptedCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Question Content */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
            <div className="border-b border-gray-200 dark:border-gray-800 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Question {currentQuestionIndex + 1}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {question.topic_name} • {question.CO}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-400">
                    {question.marks} {question.marks > 1 ? 'Marks' : 'Mark'}
                  </span>
                  {isSubmittingAnswer ? (
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 animate-pulse">
                      Answering...
                    </span>
                  ) : question.submitted_answer ? (
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                      Answered
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                      Not Answered
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6">
              {questionContent.hasImage ? (
                <div 
                  className="prose prose-lg dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: questionContent.html }}
                />
              ) : (
                <div className="text-lg text-gray-900 dark:text-white whitespace-pre-wrap break-words">
                  {questionContent.text}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Answer Options */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
            <div className="border-b border-gray-200 dark:border-gray-800 p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Answer Options
              </h3>
            </div>

            <div className="p-6">
              <RadioGroup
                value={selectedAnswer?.toString() || question.submitted_answer?.answer.toString() || ""}
                onValueChange={(value) => {
                  if (value) {
                    const answer = parseInt(value);
                    handleAnswerSubmit(answer);
                  }
                }}
                className="space-y-4"
              >
                {options.map((option, index) => (
                  <Radio
                    key={index}
                    value={index.toString()}
                    className="w-full"
                  >
                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      {option.hasImage ? (
                        <div 
                          className="prose dark:prose-invert max-w-none"
                          dangerouslySetInnerHTML={{ __html: option.html }}
                        />
                      ) : (
                        <div className="text-base text-gray-900 dark:text-white whitespace-pre-wrap break-words">
                          {option.text}
                        </div>
                      )}
                    </div>
                  </Radio>
                ))}
              </RadioGroup>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800 p-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="light"
                  startContent={<ArrowLeft className="w-4 h-4" />}
                  onClick={onPrevious}
                  isDisabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>

                <Button
                  color="secondary"
                  variant="ghost"
                  startContent={<Save className="w-4 h-4" />}
                  onClick={() => selectedAnswer !== undefined && handleAnswerSubmit(selectedAnswer)}
                  isDisabled={selectedAnswer === undefined && !question.submitted_answer}
                  isLoading={isSubmittingAnswer}
                >
                  Save
                </Button>

                <Button
                  variant="light"
                  endContent={<ArrowRight className="w-4 h-4" />}
                  onClick={onNext}
                  isDisabled={currentQuestionIndex === totalQuestions - 1}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Question Navigation */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
          Question Navigation
        </h3>
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
          {questions.map((q, index) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`p-2 text-sm font-medium rounded-lg transition-colors
                ${index === currentQuestionIndex
                  ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-400'
                  : q.submitted_answer
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }
                hover:bg-violet-50 dark:hover:bg-violet-900/20
              `}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}