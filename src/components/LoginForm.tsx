import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Moon,
  Sun,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Users,
  Mail,
  CheckCircle2,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import type { LoginResponse } from "../types/auth";
import {
  Input,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import useSWR from "swr";
import CountUp from "react-countup";
import { motion } from "framer-motion";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch login stats");
  }
  return response.json();
};

export default function LoginForm() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { auth, login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordUsername, setForgotPasswordUsername] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState("");

  const { data: loginStats, error: loginStatsError } = useSWR(
    "https://x8ki-letl-twmt.n7.xano.io/api:uRfEYk4A/user",
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  useEffect(() => {
    setMounted(true);
    if (auth.token) {
      const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
      if (!hasSeenWelcome) {
        navigate("/welcome");
      } else {
        navigate("/dashboard");
      }
    }
  }, [auth.token, navigate]);

  const handleInputChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
      setError("");
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError("Please enter both username and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://aims.dev80.tech/v2/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data: LoginResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      login(data.token, {
        id: data.id,
        batch: data.batch,
        email: data.email,
        mobile: data.mobile,
        name: data.name,
        pin: data.pin,
        role: data.role,
        roll_number: data.roll_number,
        section: data.section,
        semester: data.semester,
        username: data.username,
        year: data.year,
        avatar: `https://i.pravatar.cc/700?u=${data.email}_kitna_copy_krega`,
      });

      const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
      if (!hasSeenWelcome) {
        navigate("/welcome");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotPasswordUsername) {
      setForgotPasswordError("Please enter your username");
      return;
    }

    setForgotPasswordLoading(true);
    setForgotPasswordError("");
    setForgotPasswordSuccess("");

    try {
      const response = await fetch(
        "https://abes.platform.simplifii.com/api/v1/forgotpassword",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            username: forgotPasswordUsername,
            reset_password_base_url:
              "https://abes.web.simplifii.com/reset_password.php",
          }),
        }
      );

      const data = await response.json();

      if (data.msg.includes("successfully")) {
        setForgotPasswordSuccess(data.msg);
        setTimeout(() => {
          setShowForgotPassword(false);
          setForgotPasswordUsername("");
          setForgotPasswordSuccess("");
        }, 3000);
      } else {
        setForgotPasswordError(data.msg);
      }
    } catch (err) {
      setForgotPasswordError("Failed to process request. Please try again.");
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black ${
        mounted ? "opacity-100" : "opacity-0"
      } transition-all duration-500`}
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-full h-auto bg-[radial-gradient(circle_at_50%_120%,rgba(75, 72, 239, 0.1),rgba(67, 101, 133, 0))]" />
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-2 rounded-lg bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? (
          <Sun className="w-5 h-5 text-violet-400" />
        ) : (
          <Moon className="w-5 h-5 text-violet-600" />
        )}
      </button>

      {/* Login Card */}
      <div className="w-full max-w-md mx-4">
        <motion.div
          className="text-center mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-block p-1 mb-6">
            <img
              src="/assets/logo-DL9kQcUo.svg"
              alt="Logo"
              className="w-40 h-40"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to access your dashboard
          </p>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 flex items-center space-x-2"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}

              <Input
                label="Username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleInputChange("username")}
                startContent={<User className="w-4 h-4 text-violet-500" />}
                variant="bordered"
                isInvalid={!!error}
                classNames={{
                  label: "text-gray-600 dark:text-gray-400",
                  input: "text-gray-800 dark:text-white",
                  inputWrapper: [
                    "bg-white dark:bg-gray-900",
                    "hover:bg-gray-50 dark:hover:bg-gray-800/50",
                    "group-data-[focused=true]:bg-gray-50 dark:group-data-[focused=true]:bg-gray-800/50",
                  ],
                }}
              />

              <Input
                label="Password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange("password")}
                type={showPassword ? "text" : "password"}
                startContent={<Lock className="w-4 h-4 text-violet-500" />}
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                }
                variant="bordered"
                isInvalid={!!error}
                classNames={{
                  label: "text-gray-600 dark:text-gray-400",
                  input: "text-gray-800 dark:text-white",
                  inputWrapper: [
                    "bg-white dark:bg-gray-900",
                    "hover:bg-gray-50 dark:hover:bg-gray-800/50",
                    "group-data-[focused=true]:bg-gray-50 dark:group-data-[focused=true]:bg-gray-800/50",
                  ],
                }}
              />

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500 dark:border-gray-600 dark:bg-gray-800 dark:checked:bg-violet-500"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300"
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium"
                size="lg"
                isLoading={loading}
                spinner={<Loader2 className="w-5 h-5 animate-spin" />}
              >
                Sign in
              </Button>
            </form>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-b-2xl">
            <div className="flex flex-col items-center space-y-4">
              {/* <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <button className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium">
                  Contact administrator
                </button>
              </p> */}

              {/* Login Stats */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                >
                  <Users className="w-4 h-4 text-violet-500" />
                </motion.div>
                <div className="flex items-baseline space-x-1">
                  {loginStatsError ? (
                    <span className="text-sm text-red-500 dark:text-red-400">
                      Failed to load stats
                    </span>
                  ) : !loginStats ? (
                    <Loader2 className="w-4 h-4 text-violet-500 animate-spin" />
                  ) : (
                    <>
                      <CountUp
                        end={loginStats.tlog}
                        duration={2.5}
                        separator=","
                        className="text-sm font-semibold text-violet-600 dark:text-violet-400"
                      />
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 2.5 }}
                        className="text-xs text-gray-500 dark:text-gray-400"
                      >
                        total logins till now
                      </motion.span>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.p
          className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          New Version , New Look with New Features
        </motion.p>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        scrollBehavior="inside"
        isOpen={showForgotPassword}
        onClose={() => {
          setShowForgotPassword(false);
          setForgotPasswordUsername("");
          setForgotPasswordError("");
          setForgotPasswordSuccess("");
        }}
        size="md"
        // className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 sm:p-6"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Reset Password
              </ModalHeader>
              <ModalBody>
                {forgotPasswordSuccess ? (
                  <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{forgotPasswordSuccess}</span>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Enter your username and we'll send a password reset link
                      to your email address.
                    </p>
                    {forgotPasswordError && (
                      <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 flex items-center space-x-2">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm">{forgotPasswordError}</span>
                      </div>
                    )}
                    <Input
                      label="Username"
                      placeholder="Enter your username"
                      value={forgotPasswordUsername}
                      onChange={(e) => {
                        setForgotPasswordUsername(e.target.value);
                        setForgotPasswordError("");
                      }}
                      startContent={
                        <Mail className="w-4 h-4 text-violet-500" />
                      }
                      variant="bordered"
                      isInvalid={!!forgotPasswordError}
                    />
                  </>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                {!forgotPasswordSuccess && (
                  <Button
                    color="secondary"
                    onClick={handleForgotPassword}
                    isLoading={forgotPasswordLoading}
                  >
                    Reset Password
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
