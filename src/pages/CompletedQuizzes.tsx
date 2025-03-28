import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  MinusCircle,
  ChevronDown,
  Eye,
  RotateCw,
  Search,
  Filter,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import {
  Input,
  Button,
  Spinner,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import QuizDetailsModal from "../components/QuizDetailsModal";

interface CompletedQuiz {
  sl_num: number;
  quiz_uc: string;
  quiz_link: string;
  master_course_code: string;
  student_name: string;
  roll_number: string | null;
  admission_number: string;
  marks_obtained: number;
  correct: number;
  incorrect: number;
  not_attempted: number;
  loggedin_at: string;
  status: string;
}

interface QuizDetails {
  msg: string;
  response: {
    data: CompletedQuiz[];
  };
}

export default function CompletedQuizzes() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quizzes, setQuizzes] = useState<CompletedQuiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<CompletedQuiz[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "marks" | "course">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!auth.token || !auth.user) {
      navigate("/");
    }
  }, [auth.token, auth.user, navigate]);

  const fetchQuizzes = async () => {
    if (!auth.token) return;

    try {
      setRefreshing(true);
      const response = await fetch(
        "https://abes.platform.simplifii.com/api/v1/custom/myEvaluatedQuizzes",
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch quizzes");
      }

      const data: QuizDetails = await response.json();
      setQuizzes(data.response.data);
      setFilteredQuizzes(data.response.data);
    } catch (err) {
      setError("Failed to load completed quizzes");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [auth.token]);

  useEffect(() => {
    let filtered = [...quizzes];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (quiz) =>
          quiz.master_course_code
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          quiz.quiz_uc.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "date":
          comparison =
            new Date(b.loggedin_at).getTime() -
            new Date(a.loggedin_at).getTime();
          break;
        case "marks":
          comparison = b.marks_obtained - a.marks_obtained;
          break;
        case "course":
          comparison = a.master_course_code.localeCompare(b.master_course_code);
          break;
      }
      return sortOrder === "asc" ? -comparison : comparison;
    });

    setFilteredQuizzes(filtered);
  }, [quizzes, searchTerm, sortBy, sortOrder]);

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd MMM yyyy, hh:mm a");
    } catch {
      return dateString;
    }
  };

  const handleViewDetails = (quizUc: string) => {
    navigate(`/completed-quizzes/${quizUc}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <Spinner size="lg" color="secondary" />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gray-50 dark:bg-black ${
        mounted ? "opacity-100" : "opacity-0"
      } transition-all duration-500 lg:pl-64`}
    >
      <div className="absolute top-0 left-0 w-full h-auto pointer-events-none">
        <div className="absolute w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]"></div>
      </div>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Completed Quizzes
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              View your quiz history and performance
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="light"
              isIconOnly
              onClick={fetchQuizzes}
              isLoading={refreshing}
            >
              <RotateCw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </Button>

            <Input
              placeholder="Search by course code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              startContent={<Search className="w-4 h-4 text-gray-400" />}
              className="max-w-xs"
            />

            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="flat"
                  startContent={<Filter className="w-4 h-4" />}
                >
                  Sort by
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Sort options"
                selectedKeys={new Set([sortBy])}
                selectionMode="single"
                onAction={(key) => {
                  if (key === sortBy) {
                    setSortOrder((order) => (order === "asc" ? "desc" : "asc"));
                  } else {
                    setSortBy(key as typeof sortBy);
                    setSortOrder("desc");
                  }
                }}
              >
                <DropdownItem key="date">Date</DropdownItem>
                <DropdownItem key="marks">Marks</DropdownItem>
                <DropdownItem key="course">Course</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>

        {error ? (
          <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 p-4 rounded-lg">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredQuizzes.map((quiz) => (
              <div
                key={quiz.quiz_uc}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 hover:border-violet-200 dark:hover:border-violet-800 transition-all duration-200"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <BookOpen className="w-5 h-5 text-violet-500" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {quiz.master_course_code}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-400">
                        {quiz.quiz_uc}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(quiz.loggedin_at)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{quiz.status}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    color="secondary"
                    variant="bordered"
                    startContent={<Eye className="w-4 h-4" />}
                    onClick={() => handleViewDetails(quiz.quiz_uc)}
                  >
                    View Details
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Correct
                        </p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {quiz.correct}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <XCircle className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Incorrect
                        </p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {quiz.incorrect}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <MinusCircle className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Not Attempted
                        </p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {quiz.not_attempted}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-violet-50 dark:bg-violet-900/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Marks Obtained
                        </p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {quiz.marks_obtained}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredQuizzes.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm
                    ? "No quizzes match your search"
                    : "No completed quizzes found"}
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <QuizDetailsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedQuiz(null);
        }}
        quizDetails={null}
      />
    </div>
  );
}
