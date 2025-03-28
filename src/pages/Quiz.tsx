import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { format, parseISO, differenceInSeconds } from "date-fns";
import type {
  QuizWindowResponse,
  QuizResponse,
  QuizQuestion,
  QuizQuestions,
  SubmitAnswerResponse,
  QuizDetails,
  QuizStatus,
} from "../types/quiz";
import QuizModal from "../components/QuizModal";
import QuizForm from "../components/QuizForm";
import QuizQuestionComponent from "../components/QuizQuestion";
import QuizDetailsModal from "../components/QuizDetailsModal";

export default function Quiz() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Basic state
  const [mounted, setMounted] = useState(false);
  const [quizCode, setQuizCode] = useState(() => {
    // Initialize from URL parameter if available
    return searchParams.get("quiz_id") || "";
  });
  const [loading, setLoading] = useState(false);
  const [quizStatus, setQuizStatus] = useState<QuizStatus>("idle");

  // Quiz data state
  const [windowInfo, setWindowInfo] = useState<QuizWindowResponse | null>(null);
  const [quizDetails, setQuizDetails] = useState<QuizDetails | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  // Timer state
  const [countdown, setCountdown] = useState<{
    minutes: number;
    seconds: number;
  } | null>(null);
  const [timeLeft, setTimeLeft] = useState<{
    minutes: number;
    seconds: number;
  } | null>(null);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Modal state
  const [modalConfig, setModalConfig] = useState<{
    show: boolean;
    type: "error" | "info" | "countdown" | "success";
    title: string;
    message: string;
    countdown?: { minutes: number; seconds: number } | null;
  }>({
    show: false,
    type: "error",
    title: "",
    message: "",
    countdown: null,
  });

  // Quiz details modal state
  const [showQuizDetails, setShowQuizDetails] = useState(false);

  // Auto-redirect effect
  useEffect(() => {
    if (quizStatus === "waiting" && windowInfo?.response?.data) {
      const checkTime = () => {
        const now = new Date();
        const startTime = parseISO(windowInfo.response.data.start_time);

        if (now >= startTime) {
          fetchQuestions();
        }
      };

      // Check every second
      const intervalId = setInterval(checkTime, 1000);
      return () => clearInterval(intervalId);
    }
  }, [quizStatus, windowInfo]);

  // Initialize quiz from URL parameter
  useEffect(() => {
    if (auth.token && quizCode) {
      fetchQuizDetails();
    }
  }, [auth.token]);

  // Update URL when quiz code changes
  useEffect(() => {
    if (quizCode) {
      const url = new URL(window.location.href);
      url.searchParams.set("quiz_id", quizCode);
      window.history.replaceState({}, "", url.toString());
    } else {
      const url = new URL(window.location.href);
      url.searchParams.delete("quiz_id");
      window.history.replaceState({}, "", url.toString());
    }
  }, [quizCode]);

  // Authentication check
  useEffect(() => {
    setMounted(true);
    if (!auth.token || !auth.user) {
      navigate("/");
    }
  }, [auth.token, auth.user, navigate]);

  // Quiz start countdown
  useEffect(() => {
    if (quizStatus !== "waiting" || !windowInfo?.response?.data) return;

    const updateCountdown = () => {
      const now = new Date();
      const loginTime = parseISO(windowInfo.response.data.login_time);
      const startTime = parseISO(windowInfo.response.data.start_time);

      // If we're before login time
      if (now < loginTime) {
        const diff = differenceInSeconds(loginTime, now);
        const newCountdown = {
          minutes: Math.floor(diff / 60),
          seconds: diff % 60,
        };
        setCountdown(newCountdown);

        // Update modal countdown if showing login window countdown
        if (modalConfig.type === "countdown" && modalConfig.show) {
          setModalConfig((prev) => ({
            ...prev,
            countdown: newCountdown,
          }));
        }
      }
      // If we're between login time and start time
      else if (now < startTime) {
        const diff = differenceInSeconds(startTime, now);
        setCountdown({
          minutes: Math.floor(diff / 60),
          seconds: diff % 60,
        });
        // When login time is reached, fetch quiz details again
        if (modalConfig.type === "countdown") {
          setModalConfig((prev) => ({ ...prev, show: false }));
          fetchQuizDetails();
        }
      }
      // If we're past start time
      else {
        setCountdown(null);
        fetchQuestions();
      }
    };

    updateCountdown();
    const intervalId = setInterval(updateCountdown, 1000);
    return () => clearInterval(intervalId);
  }, [quizStatus, windowInfo, modalConfig.type, modalConfig.show]);

  // Quiz duration countdown
  useEffect(() => {
    if (quizStatus !== "active" || !quizDetails) return;

    const updateTimeLeft = () => {
      const now = new Date();
      const endTime = parseISO(quizDetails.end_time);

      if (now < endTime) {
        const diff = differenceInSeconds(endTime, now);
        setTimeLeft({
          minutes: Math.floor(diff / 60),
          seconds: diff % 60,
        });
      } else {
        setTimeLeft(null);
        handleSubmitQuiz();
      }
    };

    updateTimeLeft();
    const intervalId = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(intervalId);
  }, [quizStatus, quizDetails]);

  // Auto-refresh questions when active
  useEffect(() => {
    if (quizStatus !== "active" || !quizCode) return;

    const intervalId = setInterval(() => {
      fetchQuestions();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(intervalId);
  }, [quizStatus, quizCode]);

  const showModal = (
    type: "error" | "info" | "countdown" | "success",
    title: string,
    message: string,
    countdown?: { minutes: number; seconds: number } | null
  ) => {
    setModalConfig({
      show: true,
      type,
      title,
      message,
      countdown,
    });
  };

  const fetchQuizDetails = async () => {
    if (!auth.user?.pin || !auth.user?.username || !quizCode) {
      showModal("error", "Error", "Missing required information");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        "https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-1c23ee6f-939a-44b2-9c4e-d17970ddd644/abes/fetchQuizDetails",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            pin: auth.user.pin,
            quiz_uc: quizCode,
            user_unique_code: auth.user.username,
          }),
        }
      );

      const data: QuizResponse = await response.json();

      if (response.status === 403 || response.status === 406) {
        showModal("error", "Error", data.msg || "Invalid Quiz ID");
        setQuizStatus("error");
        return;
      }

      if (data.msg && data.msg.includes("Login window has expired.")) {
        showModal("error", "Error", data.msg || "Login window has expired");
        setQuizStatus("error");
        return;
      }

      if (data.msg && data.msg.includes("Login Window is not started yet")) {
        const loginTime = parseISO(data.response.data.login_time);
        const now = new Date();
        const diff = differenceInSeconds(loginTime, now);
        const countdownValue = {
          minutes: Math.floor(diff / 60),
          seconds: diff % 60,
        };

        setWindowInfo({
          msg: data.msg,
          response: {
            data: data.response.data,
          },
        });
        setQuizStatus("waiting");

        showModal("countdown", "Login Window", data.msg, countdownValue);

        // Show success message
        showModal(
          "success",
          "Quiz Code Accepted",
          "You will be automatically redirected when the quiz starts."
        );
        return;
      }

      // Check if quiz details are available
      if (data.data || (data.response && data.response.data)) {
        const quizData = data.data || data.response?.data;
        if (quizData) {
          setQuizDetails(quizData);

          // Check if we need to set up login window timer
          const now = new Date();
          const loginTime = parseISO(quizData.login_time);
          const startTime = parseISO(quizData.start_time);

          if (now < loginTime) {
            setWindowInfo({
              msg: "Login Window is not started yet.",
              response: {
                data: {
                  now: format(now, "yyyy-MM-dd HH:mm:ss"),
                  login_time: quizData.login_time,
                  start_time: quizData.start_time,
                  end_time: quizData.end_time,
                },
              },
            });
            setQuizStatus("waiting");

            // Show modal with timing information
            showModal(
              "info",
              "Quiz Status",
              `Login window starts at ${format(
                loginTime,
                "hh:mm a"
              )}\nQuiz starts at ${format(startTime, "hh:mm a")}`
            );
          } else {
            await checkQuizStatus();
          }
        }
      }
    } catch (err) {
      showModal("error", "Error", "Failed to fetch quiz details");
      setQuizStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const checkQuizStatus = async () => {
    if (!auth.user?.pin || !auth.user?.username || !quizCode) return;

    try {
      const response = await fetch(
        "https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-1c23ee6f-939a-44b2-9c4e-d17970ddd644/abes/getQuestionsForQuiz",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            pin: auth.user.pin,
            quiz_uc: quizCode,
            user_unique_code: auth.user.username,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 400 && data.msg === "Test is already over.") {
        showModal("error", "Error", "This quiz has already ended");
        setQuizStatus("completed");
        return;
      }

      if (
        data.msg === "Test is not started yet." ||
        data.msg === "Login Window is not started yet."
      ) {
        setWindowInfo({
          msg: data.msg,
          response: {
            data: data.response.data,
          },
        });
        setQuizStatus("waiting");

        // Show modal with timing information
        const loginTime = format(
          parseISO(data.response.data.login_time),
          "hh:mm a"
        );
        const startTime = format(
          parseISO(data.response.data.start_time),
          "hh:mm a"
        );
        showModal(
          "info",
          "Quiz Status",
          `Login window starts at ${loginTime}\nQuiz starts at ${startTime}`
        );
      } else if (data.msg === "Login window has expired.") {
        showModal("error", "Error", "Login window has expired");
        setQuizStatus("error");
      } else if (data.response?.data?.length > 0) {
        setQuestions(data.response.data);
        setQuizStatus("active");
      } else {
        showModal("error", "Error", data.msg || "Failed to check quiz status");
        setQuizStatus("error");
      }
    } catch (err) {
      showModal("error", "Error", "Failed to check quiz status");
      setQuizStatus("error");
    }
  };

  const fetchQuestions = async () => {
    if (!auth.user?.pin || !auth.user?.username || !quizCode) return;

    try {
      const response = await fetch(
        "https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-1c23ee6f-939a-44b2-9c4e-d17970ddd644/abes/getQuestionsForQuiz",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            pin: auth.user.pin,
            quiz_uc: quizCode,
            user_unique_code: auth.user.username,
          }),
        }
      );

      const data: QuizQuestions = await response.json();

      if (data.response?.data) {
        setQuestions(data.response.data);

        // Set answers from submitted_answer data
        const submittedAnswers: Record<number, number> = {};
        data.response.data.forEach((question) => {
          if (question.submitted_answer) {
            submittedAnswers[question.id] = question.submitted_answer.answer;
          }
        });
        setAnswers(submittedAnswers);

        setQuizStatus("active");
        setWindowInfo(null);
      } else {
        showModal("error", "Error", data.msg || "Failed to fetch questions");
      }
    } catch (err) {
      showModal("error", "Error", "Failed to fetch questions");
      setQuizStatus("error");
    }
  };

  const handleAnswerSubmit = async (questionId: number, answer: number) => {
    if (!auth.user?.pin || !auth.user?.username || !quizCode) return;

    try {
      const response = await fetch(
        "https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-1c23ee6f-939a-44b2-9c4e-d17970ddd644/abes/submitAnswer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            quiz_uc: quizCode,
            question_id: questionId,
            user_unique_code: auth.user.username,
            answer,
            pin: auth.user.pin,
          }),
        }
      );

      const data: SubmitAnswerResponse = await response.json();

      if (data.msg === "Answer successfully recorded") {
        setAnswers((prev) => ({ ...prev, [questionId]: answer }));
        // Update the question's submitted_answer in the questions array
        setQuestions((prev) =>
          prev.map((q) =>
            q.id === questionId
              ? {
                  ...q,
                  submitted_answer: {
                    answer,
                    answered_on: Date.now(),
                  },
                }
              : q
          )
        );
      } else {
        showModal("error", "Error", data.msg || "Failed to submit answer");
      }
    } catch (err) {
      showModal("error", "Error", "Failed to submit answer");
    }
  };

  const handleSubmitQuiz = async () => {
    if (submitting || !auth.user?.pin || !auth.user?.username || !quizCode)
      return;

    try {
      setSubmitting(true);
      const response = await fetch(
        "https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-1c23ee6f-939a-44b2-9c4e-d17970ddd644/abes/submitAndExitQuiz",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            quiz_uc: quizCode,
            user_unique_code: auth.user.username,
            pin: auth.user.pin,
          }),
        }
      );

      if (response.ok) {
        setQuizStatus("completed");
        setSubmitSuccess(true);
        setTimeout(() => {
          navigate("/completed-quizzes");
        }, 3000);
      } else {
        const data = await response.json();
        showModal("error", "Error", data.msg || "Failed to submit quiz");
      }
    } catch (err) {
      showModal("error", "Error", "Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Quiz Submitted Successfully
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Redirecting to completed quizzes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gray-50 dark:bg-black ${
        mounted ? "opacity-100" : "opacity-0"
      } transition-all duration-500 lg:pl-64`}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-full h-auto bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
        {/* <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-500 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-10 animate-blob" /> */}
        {/* <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-10 animate-blob animation-delay-2000" /> */}
      </div>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {quizStatus === "active" && questions[currentQuestionIndex] ? (
          <QuizQuestionComponent
            question={questions[currentQuestionIndex]}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            timeLeft={timeLeft}
            selectedAnswer={answers[questions[currentQuestionIndex].id]}
            onAnswerSubmit={handleAnswerSubmit}
            onPrevious={() =>
              setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
            }
            onNext={() =>
              setCurrentQuestionIndex((prev) =>
                Math.min(questions.length - 1, prev + 1)
              )
            }
            onSubmitQuiz={handleSubmitQuiz}
            submitting={submitting}
            courseName={quizDetails?.cdata.course_name}
            questions={questions}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
          />
        ) : (
          <QuizForm
            quizCode={quizCode}
            loading={loading}
            countdown={countdown}
            windowInfo={windowInfo}
            quizDetails={quizDetails}
            onQuizCodeChange={setQuizCode}
            onSubmit={(e) => {
              e.preventDefault();
              if (!quizCode) {
                showModal("error", "Error", "Please enter a quiz code");
                return;
              }
              fetchQuizDetails();
            }}
            onViewDetails={() => setShowQuizDetails(true)}
            onSubmitQuiz={handleSubmitQuiz}
            submitting={submitting}
          />
        )}
      </main>

      <QuizModal
        isOpen={modalConfig.show}
        onClose={() => setModalConfig((prev) => ({ ...prev, show: false }))}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        countdown={modalConfig.countdown}
      />

      <QuizDetailsModal
        isOpen={showQuizDetails}
        onClose={() => setShowQuizDetails(false)}
        quizDetails={quizDetails}
      />
    </div>
  );
}
