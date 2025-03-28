import React from 'react';
import { Input, Button, Card, CardBody, CardHeader } from '@nextui-org/react';
import { 
  Lock, 
  Eye, 
  Info, 
  BookOpen, 
  FileText, 
  Timer, 
  CalendarDays, 
  GraduationCap, 
  Users, 
  Clock, 
  LogOut,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Brain,
  Target,
  Shield,
  Zap,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { QuizDetails, QuizWindowResponse } from '../types/quiz';

interface QuizFormProps {
  quizCode: string;
  loading: boolean;
  countdown: { minutes: number; seconds: number } | null;
  windowInfo: QuizWindowResponse | null;
  quizDetails: QuizDetails | null;
  onQuizCodeChange: (code: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onViewDetails: () => void;
  onSubmitQuiz: () => void;
  submitting: boolean;
}

const features = [
  {
    icon: Brain,
    title: 'Smart Navigation',
    description: 'Easily move between questions with visual progress tracking'
  },
  {
    icon: Timer,
    title: 'Live Timer',
    description: 'Real-time countdown timer to manage your time effectively'
  },
  {
    icon: Shield,
    title: 'Auto-save',
    description: 'Never lose your progress with automatic answer saving'
  },
  {
    icon: Target,
    title: 'Progress Tracking',
    description: 'Clear indicators for attempted and pending questions'
  },
  {
    icon: Sparkles,
    title: 'Smart Features',
    description: 'Modern interface with keyboard shortcuts and quick actions'
  },
  {
    icon: HelpCircle,
    title: 'Instant Support',
    description: 'Get help immediately when you need it'
  }
];

export default function QuizForm({
  quizCode,
  loading,
  countdown,
  windowInfo,
  quizDetails,
  onQuizCodeChange,
  onSubmit,
  onViewDetails,
  onSubmitQuiz,
  submitting,
}: QuizFormProps) {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Quiz Entry Section */}
      <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-3xl p-8 mb-12 border border-violet-100 dark:border-violet-800">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-purple-500 dark:from-violet-400 dark:to-purple-400 mb-4">
            Online Quiz Portal
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Enter your quiz code to begin your assessment
          </p>
          
          <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <Input
              label="Quiz Code"
              placeholder="Enter 4-digit code"
              value={quizCode}
              onChange={(e) => onQuizCodeChange(e.target.value.toUpperCase())}
              startContent={<Lock className="w-5 h-5 text-violet-500" />}
              className="flex-1"
              maxLength={4}
              size="lg"
              labelPlacement="outside"
            />
            <Button
              type="submit"
              isLoading={loading}
              className="bg-violet-600 hover:bg-violet-700 text-white h-14 px-8 self-end"
              size="lg"
            >
              Start Quiz
            </Button>
          </form>
        </div>
      </div>

      {/* Quiz Details and Instructions */}
      {windowInfo && quizDetails && (
        <div className="space-y-12">
          {/* Quiz Details Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Quiz Info */}
            <div className="lg:col-span-8 space-y-6">
              {/* Status Message */}
              <div className="bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-800 rounded-lg">
                    <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-medium text-blue-900 dark:text-blue-100">
                      {windowInfo.msg || "Quiz will start soon"}
                    </h2>
                    <p className="mt-2 text-base text-blue-700 dark:text-blue-300">
                      Please wait for the scheduled time. You will be automatically redirected when the quiz begins.
                    </p>
                  </div>
                </div>
              </div>

              {/* Countdown Timer */}
              {countdown && (
                <div className="text-center p-8 rounded-xl border bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border-violet-200 dark:border-violet-800">
                  <h3 className="text-xl font-medium mb-4 text-gray-900 dark:text-white">
                    Quiz Starts In
                  </h3>
                  <div className="text-6xl font-bold font-mono text-violet-600 dark:text-violet-400">
                    {String(countdown.minutes).padStart(2, '0')}:
                    {String(countdown.seconds).padStart(2, '0')}
                  </div>
                </div>
              )}

              {/* Quiz Information */}
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
                      <BookOpen className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {quizDetails.cdata.course_name}
                      </h2>
                      <p className="text-base text-gray-500 dark:text-gray-400 mt-1">
                        {quizDetails.faculty_name}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-3 mb-2">
                        <FileText className="w-5 h-5 text-violet-500" />
                        <span className="text-base font-medium text-gray-900 dark:text-white">
                          Questions
                        </span>
                      </div>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {quizDetails.questions_count}
                      </p>
                    </div>
                    <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-3 mb-2">
                        <Timer className="w-5 h-5 text-violet-500" />
                        <span className="text-base font-medium text-gray-900 dark:text-white">
                          Duration
                        </span>
                      </div>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {quizDetails.duration} mins
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CalendarDays className="w-5 h-5 text-gray-500" />
                        <span className="text-base text-gray-600 dark:text-gray-400">
                          Date
                        </span>
                      </div>
                      <span className="text-base font-medium text-gray-900 dark:text-white">
                        {quizDetails.cdata.date_formatted}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-gray-500" />
                        <span className="text-base text-gray-600 dark:text-gray-400">
                          Timing
                        </span>
                      </div>
                      <span className="text-base font-medium text-gray-900 dark:text-white">
                        {quizDetails.cdata.start_end_time}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="lg:col-span-4">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
                    <Info className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Quiz Instructions
                  </h3>
                </div>

                <div className="space-y-4">
                  {0 ? (
                    <div 
                      className="prose prose-sm dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: quizDetails.cdata.instructions }}
                    />
                  ) : (
                    <ul className="space-y-3">
                      <li className="flex items-start space-x-3">
                        <CheckCircle2 className="w-5 h-5 text-violet-500 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">Read each question carefully before answering</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <CheckCircle2 className="w-5 h-5 text-violet-500 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">Ensure stable internet connection throughout the quiz</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <CheckCircle2 className="w-5 h-5 text-violet-500 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">Do not refresh or close the browser window</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <CheckCircle2 className="w-5 h-5 text-violet-500 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">Submit your answers before the timer runs out</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <CheckCircle2 className="w-5 h-5 text-violet-500 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">You cannot change answers after submission</span>
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
      
          {/* Features Section */}
          <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl mt-4 p-8 border border-violet-100 dark:border-violet-800">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Quiz Features
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Tools and features to enhance your quiz experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-800"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
                      <feature.icon className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
    </div>
  );
}