import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Rocket,
  Zap,
  Sparkles,
  BookOpen,
  BrainCircuit,
  Shield,
  Target,
} from "lucide-react";

export default function WelcomeScreen() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const controls = useAnimation();

  useEffect(() => {
    if (!auth.token) navigate("/");
  }, [auth.token, navigate]);

  const handleGetStarted = async () => {
    await controls.start({ opacity: 0, transition: { duration: 0.3 } });
    localStorage.setItem("hasSeenWelcome", "true");
    navigate("/dashboard");
  };

  const floatingVariants = {
    float: {
      y: [-10, 10, -10],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50 dark:bg-gray-900 overflow-auto p-4 w-100% h-full">
      {/* Optimized Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-blue-500/5 to-emerald-500/5 dark:from-violet-900/10 dark:via-blue-900/10 dark:to-emerald-900/10 mt-10"
        animate={{
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
        }}
      />

      {/* Mobile-optimized Floating Elements */}
      <motion.div
        className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full blur-[40px] opacity-10 dark:opacity-15"
        variants={floatingVariants}
        animate="float"
      />
      <motion.div
        className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full blur-[40px] opacity-10 dark:opacity-15"
        variants={floatingVariants}
        animate="float"
        transition={{ delay: 2 }}
      />

      {/* Main Content Container */}
      <motion.div
        className="relative z-10 w-full max-w-6xl px-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Section - Mobile Optimized */}
          <motion.div
            className="w-full lg:w-1/2 space-y-6 text-center lg:text-left"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <motion.div
              className="inline-block"
              initial={{ scale: 0 }}
              animate={{
                scale: 1,
                transition: {
                  type: "tween",
                  duration: 0.4,
                  delay: 0.2,
                },
              }}
            >
              <Rocket className="w-20 h-20 text-violet-600 dark:text-violet-400 mx-auto lg:mx-0 mt-10" />
            </motion.div>

            <motion.div
              className="space-y-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1,
                transition: { delay: 0.4 },
              }}
            >
              <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-blue-600 dark:from-violet-400 dark:to-blue-400 leading-tight">
                AIMS - ABES Information Management System
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 font-medium">
                All in one platform for track your academics
              </p>
            </motion.div>
          </motion.div>

          {/* Right Section - Mobile-first Grid */}
          <motion.div
            className="w-full lg:w-1/2"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="grid grid-cols-1 gap-4 sm:gap-5">
              {[
                {
                  icon: BookOpen,
                  title: "Quiz",
                  description: "Most Advanced Quiz System in ABES",
                  color: "text-violet-600 dark:text-violet-300",
                },
                {
                  icon: BrainCircuit,
                  title: "Automatic Calculations",
                  description: "Helps to Reach your target Attandance",
                  color: "text-blue-600 dark:text-blue-300",
                },
                {
                  icon: Target,
                  title: "All Attendace",
                  description: "Real-time Attandance tracking",
                  color: "text-emerald-600 dark:text-emerald-300",
                },
                {
                  icon: Shield,
                  title: "Time Table and Daily Attandance Tracker",
                  description: "Track your daily attandance",
                  color: "text-cyan-600 dark:text-cyan-300",
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="p-4 sm:p-5 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/30 shadow-sm hover:shadow-md transition-all"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    transition: {
                      delay: 0.6 + index * 0.1,
                      type: "tween",
                      duration: 0.3,
                    },
                  }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <motion.div
                      className={`p-2 sm:p-3 rounded-lg bg-gradient-to-br from-violet-500/10 to-blue-500/10`}
                    >
                      <feature.icon
                        className={`w-6 h-6 sm:w-7 sm:h-7 ${feature.color}`}
                      />
                    </motion.div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Mobile-friendly CTA Button */}
        <motion.div
          className="flex justify-center mt-8 sm:mt-12"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            transition: { delay: 1 },
          }}
        >
          <motion.button
            onClick={handleGetStarted}
            className="flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 text-white rounded-lg sm:rounded-xl shadow-lg bg-gradient-to-r from-violet-600 to-blue-600 active:scale-95"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-base sm:text-lg font-semibold">
              Launch Dashboard
            </span>
            <motion.div
              animate={{ x: [0, 3, 0] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >
              <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.div>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
