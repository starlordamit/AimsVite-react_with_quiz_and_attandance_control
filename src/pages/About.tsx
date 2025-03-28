import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  Star,
  Code,
  Sparkles,
  Heart,
  Rocket,
  BookOpen,
  Calendar,
  Clock,
  Bell,
  Users,
  CheckCircle2,
  LineChart,
  Shield,
  Zap,
} from "lucide-react";

const features = [
  {
    title: "Real-time Attendance Tracking",
    description:
      "Monitor attendance with live updates, detailed analytics, and comprehensive insights. Get instant notifications for attendance updates.",
    icon: Star,
    color: "bg-violet-500",
  },
  {
    title: "Advanced Quiz Platform",
    description:
      "Take quizzes with automatic grading, instant feedback, and detailed performance analysis. Support for multiple question types.",
    icon: Sparkles,
    color: "bg-blue-500",
  },
  {
    title: "Dynamic Schedule Management",
    description:
      "View and manage your daily schedule with real-time updates. Get notifications for schedule changes and upcoming classes.",
    icon: Calendar,
    color: "bg-green-500",
  },
  {
    title: "Academic Progress Tracking",
    description:
      "Track your academic performance with detailed analytics, progress charts, and performance insights across all subjects.",
    icon: LineChart,
    color: "bg-pink-500",
  },
  {
    title: "Smart Notifications",
    description:
      "Stay updated with intelligent notifications for classes, quizzes, attendance updates, and important announcements.",
    icon: Bell,
    color: "bg-yellow-500",
  },
  {
    title: "Course Management",
    description:
      "Access course materials, track assignments, and manage your academic resources all in one place.",
    icon: BookOpen,
    color: "bg-indigo-500",
  },
  // {
  //   title: "Faculty Interaction",
  //   description:
  //     "Connect with faculty members, receive updates, and access course-specific communications.",
  //   icon: Users,
  //   color: "bg-teal-500",
  // },
  // {
  //   title: "Performance Analytics",
  //   description:
  //     "Get detailed insights into your academic performance with visual analytics and progress tracking.",
  //   icon: CheckCircle2,
  //   color: "bg-orange-500",
  // },
];

const highlights = [
  {
    title: "Lightning Fast",
    description: "Built with modern technology for optimal performance",
    icon: Zap,
    color: "text-yellow-500",
  },
  {
    title: "Secure",
    description: "Enterprise-grade security for your academic data",
    icon: Shield,
    color: "text-green-500",
  },
  {
    title: "Real-time Updates",
    description: "Stay synchronized with instant updates",
    icon: Clock,
    color: "text-blue-500",
  },
  {
    title: "Smart Integration",
    description: "Seamlessly integrated with academic systems",
    icon: Code,
    color: "text-violet-500",
  },
];

export default function About() {
  useEffect(() => {
    document.title = "About - Student Portal";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black lg:pl-64">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-full h-auto bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
      </div>

      <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-purple-500 dark:from-violet-400 dark:to-purple-400 mb-4">
              Where Innovation Meets Education
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              A next-generation student portal designed to transform your
              academic journey with cutting-edge features, real-time updates,
              and seamless experiences.
            </p>
          </motion.div>
        </div>
        <div className="flex-box justify-center mb-16">
          {/* Developer Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl shadow-lg border border-violet-200 dark:border-violet-800/50 p-12 text-center"
          >
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
                  <img
                    src="https://cms.clyromedia.com/uploads/Amit_Creatorsmela_56b8ca130a_c55500a604.jpg"
                    alt="Developer"
                    className="relative w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
                  />
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-purple-500 dark:from-violet-400 dark:to-purple-400 mb-4">
                  Amit yadav - CSE DS A
                </h2>
                <p className="text-xl text-gray-700 dark:text-gray-300 mb-2 font-medium italic">
                  "Where I venture, others soon follow"
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  A passionate developer dedicated to creating innovative
                  solutions that transform the educational landscape. With a
                  focus on user experience and cutting-edge technology, we're
                  building the future of academic management.
                </p>

                <div className="flex items-center justify-center space-x-6">
                  <a
                    href="https://github.com/starlordamit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg bg-white dark:bg-gray-800 shadow-lg hover:scale-110 transition-transform duration-200"
                  >
                    <Github className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/amit-yadav-710408253/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg bg-white dark:bg-gray-800 shadow-lg hover:scale-110 transition-transform duration-200"
                  >
                    <Linkedin className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </a>
                  <a
                    href="mailto:amit@creatorsmela.com"
                    className="p-3 rounded-lg bg-white dark:bg-gray-800 shadow-lg hover:scale-110 transition-transform duration-200"
                  >
                    <Mail className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </a>
                </div>

                <div className="mt-8 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  <Heart className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-lg">Made with passion and purpose</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {highlights.map((highlight, index) => (
            <motion.div
              key={highlight.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-800"
            >
              <div className="flex justify-center mb-4">
                <highlight.icon className={`w-8 h-8 ${highlight.color}`} />
              </div>
              <h3 className="text-gray-900 dark:text-white font-semibold mb-2">
                {highlight.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {highlight.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Features Grid */}
        {/* <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features for Modern Education
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover the tools and features designed to enhance your academic
              experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 hover:border-violet-200 dark:hover:border-violet-800 transition-all duration-200"
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`p-3 rounded-lg ${feature.color} bg-opacity-10 dark:bg-opacity-20`}
                  >
                    <feature.icon
                      className={`w-6 h-6 ${feature.color.replace(
                        "bg-",
                        "text-"
                      )}`}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div> */}
      </main>
    </div>
  );
}
