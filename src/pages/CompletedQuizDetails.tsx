import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  GraduationCap,
  Users,
  BookOpen,
  Timer,
  Award,
  Target,
  AlertCircle
} from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface QuizResult {
  correct: number;
  correct_answer: number;
  marks_obtained: number;
  submitted_answer: {
    answer: number;
    answered_on: number;
  };
}

interface QuizQuestion {
  CO: string;
  id: number;
  type: string;
  marks: number;
  answer: string;
  options: string[];
  question: string;
  topic_name: string;
  bloom_level: string;
  time_to_solve: number;
  correct_choices: number;
  submitted_answer: {
    answer: number;
    answered_on: number;
  };
  multiple_correct: number;
}

interface QuizSummary {
  student_name: string;
  student_adm_number: string;
  master_course_code: string;
  dept: string;
  section: string;
  start_end_time: string;
  ended_by_student: number;
  total_marks: number;
  marks_obtained: number;
  quiz_id: number;
  cf_id: number;
  student_id: number;
  correct: number;
  incorrect: number;
  not_attempted: number;
  login_time: string;
  end_time: string;
}

interface QuizResponse {
  msg: string;
  time_now: number;
  start_time: number;
  end_time: number;
  result: Record<string, QuizResult>;
  summary: QuizSummary;
  response: {
    data: QuizQuestion[];
  };
}

export default function CompletedQuizDetails() {
  const { auth } = useAuth();
  const { quizCode } = useParams<{ quizCode: string }>();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState<QuizResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!auth.token || !auth.user) {
      navigate('/');
      return;
    }
    fetchQuizDetails();
  }, [auth.token, auth.user, quizCode]);

  const fetchQuizDetails = async () => {
    if (!auth.user?.pin || !auth.user?.username || !quizCode) return;

    try {
      const response = await fetch(
        'https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-1c23ee6f-939a-44b2-9c4e-d17970ddd644/abes/getQuestionsForQuiz',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            pin: auth.user.pin,
            quiz_uc: quizCode,
            user_unique_code: auth.user.username,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch quiz details');
      }

      const data: QuizResponse = await response.json();
      setQuizData(data);
    } catch (err) {
      setError('Failed to load quiz details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  if (error || !quizData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="text-red-500 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <p>{error || 'Failed to load quiz details'}</p>
        </div>
      </div>
    );
  }

  const { summary, response: { data: questions } } = quizData;

  const formatDateTime = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'dd MMM yyyy, hh:mm a');
    } catch {
      return dateString;
    }
  };

  const calculateDuration = () => {
    const start = parseISO(summary.login_time);
    const end = parseISO(summary.end_time);
    const diffInMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
    return `${diffInMinutes} minutes`;
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-black ${mounted ? 'opacity-100' : 'opacity-0'} transition-all duration-500 lg:pl-64`}>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/completed-quizzes')}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">Back to Completed Quizzes</span>
            <span className="sm:hidden">Back</span>
          </button>
        </div>

        {/* Quiz Summary */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-4 sm:p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 sm:p-3 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-violet-600 dark:text-violet-400" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">
                    {summary.master_course_code}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {summary.student_name}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <GraduationCap className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Department</p>
                    <p className="text-gray-900 dark:text-white truncate">{summary.dept}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Section</p>
                    <p className="text-gray-900 dark:text-white truncate">Section {summary.section}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Timing</p>
                    <p className="text-gray-900 dark:text-white truncate">{summary.start_end_time}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Timer className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                    <p className="text-gray-900 dark:text-white truncate">{calculateDuration()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center pt-6 lg:pt-0 border-t lg:border-t-0 border-gray-200 dark:border-gray-800">
              <div className="w-32 h-32 sm:w-40 sm:h-40 mb-4">
                <CircularProgressbar
                  value={(summary.marks_obtained / summary.total_marks) * 100}
                  text={`${Math.round((summary.marks_obtained / summary.total_marks) * 100)}%`}
                  styles={buildStyles({
                    textSize: '20px',
                    pathColor: '#8b5cf6',
                    textColor: '#8b5cf6',
                    trailColor: '#e5e7eb',
                  })}
                />
              </div>
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-violet-600 dark:text-violet-400">
                  {summary.marks_obtained}/{summary.total_marks}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Total Score
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Correct</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white truncate">
                    {summary.correct}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Incorrect</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white truncate">
                    {summary.incorrect}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Not Attempted</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white truncate">
                    {summary.not_attempted}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {questions.map((question, index) => (
            <div
              key={question.id}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden"
            >
              <div className="border-b border-gray-200 dark:border-gray-800 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      Q{index + 1}.
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-violet-500" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {question.marks} {question.marks > 1 ? 'marks' : 'mark'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-400">
                      {question.CO}
                    </span>
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
                      {question.bloom_level}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <div
                  className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none mb-6 overflow-x-auto"
                  dangerouslySetInnerHTML={{ __html: question.question }}
                />

                <div className="space-y-3">
                  {question.options.map((option, optionIndex) => {
                    const isSelected = question.submitted_answer.answer === optionIndex;
                    const isCorrect = quizData.result[question.id].correct_answer === optionIndex;

                    return (
                      <div
                        key={optionIndex}
                        className={`p-4 rounded-lg flex items-start space-x-3 ${
                          isSelected
                            ? isCorrect
                              ? 'bg-green-100 dark:bg-green-900/30'
                              : 'bg-red-100 dark:bg-red-900/30'
                            : isCorrect
                            ? 'bg-green-50 dark:bg-green-900/20'
                            : 'bg-gray-50 dark:bg-gray-800/50'
                        }`}
                      >
                        <div className="flex-shrink-0 mt-1">
                          {isSelected ? (
                            isCorrect ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-500" />
                            )
                          ) : isCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : null}
                        </div>
                        <div
                          className="prose prose-sm sm:prose-base dark:prose-invert max-w-none flex-1 overflow-x-auto"
                          dangerouslySetInnerHTML={{ __html: option }}
                        />
                      </div>
                    );
                  })}
                </div>

                {question.answer && (
                  <div className="mt-6 p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                    <p className="font-medium text-violet-900 dark:text-violet-100 mb-2">
                      Explanation
                    </p>
                    <div
                      className="prose prose-sm sm:prose-base dark:prose-invert max-w-none overflow-x-auto"
                      dangerouslySetInnerHTML={{ __html: question.answer }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}