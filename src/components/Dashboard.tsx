import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationsContext";
import { useTour } from "../context/TourContext";
import { Link } from "react-router-dom";
import {
  Bell,
  Pencil,
  ChevronRight,
  Calendar,
  Clock,
  GraduationCap,
  BookOpen,
  ExternalLink,
  Loader2,
} from "lucide-react";
import AttendanceSummaryCard from "./AttendanceSummaryCard";
import Schedule from "./Schedule";
import WelcomeScreen from "./WelcomeScreen";
import { DASHBOARD_TOUR_STEPS } from "../context/TourContext";

export default function Dashboard() {
  const { auth } = useAuth();
  const {
    notifications,
    loading: notificationsLoading,
    error,
    fetchNotifications,
  } = useNotifications();
  const { showTour, setShowTour, setCurrentTourSteps } = useTour();
  const [mounted, setMounted] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [totalSummary, setTotalSummary] = useState<any>(null);
  const [attendanceLoading, setAttendanceLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchAttendance = async () => {
    try {
      setRefreshing(true);
      const response = await fetch(
        "https://abes.platform.simplifii.com/api/v1/custom/getCFMappedWithStudentID?embed_attendance_summary=1",
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch attendance data");
      }

      const data = await response.json();
      const total = data.response.data.find(
        (item: any) => item.cdata.course_code === "Total"
      );
      setTotalSummary(total);
    } catch (err) {
      console.error("Failed to load attendance data");
    } finally {
      setAttendanceLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    setCurrentTourSteps(DASHBOARD_TOUR_STEPS);

    if (!localStorage.getItem("dashboardTourCompleted")) {
      setShowTour(true);
    }

    if (auth.token) {
      fetchAttendance();
    }
  }, [auth.token]);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("[data-notifications]")) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleTourCallback = (data: { status: string }) => {
    if (data.status === "finished" || data.status === "skipped") {
      localStorage.setItem("dashboardTourCompleted", "true");
      setShowTour(false);
    }
  };

  if (!auth.token || !auth.user) {
    window.location.href = "/";
    return null;
  }

  // Show welcome screen if it's enabled
  if (showWelcome) {
    return <WelcomeScreen onComplete={() => setShowWelcome(false)} />;
  }

  const NotificationsDropdown = () => (
    <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Notifications
        </h3>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {notificationsLoading ? (
          <div className="p-4 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-violet-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500 dark:text-red-400">
            {error}
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No new notifications
          </div>
        ) : (
          notifications.map((notification, index) => (
            <a
              key={index}
              href={notification.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {notification.author}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {notification.details}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-400">
                      {notification.dept}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
                      Section {notification.section}
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0 ml-4" />
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );

  const stats = [
    {
      title: "Current Semester",
      value: `Semester ${auth.user.semester}`,
      icon: Calendar,
      color: "bg-blue-500",
      description: "Academic progress",
    },
    {
      title: "Academic Year",
      value: `Year - ${auth.user.year}`,
      icon: Clock,
      color: "bg-purple-500",
      description: "Current year of study",
    },
    {
      title: "Batch",
      value: `${auth.user.batch - 4} - ${auth.user.batch}`,
      icon: GraduationCap,
      color: "bg-green-500",
      description: "Graduation year",
    },
    {
      title: "Section",
      value: auth.user.section,
      icon: BookOpen,
      color: "bg-yellow-500",
      description: "Class section",
    },
  ];

  const quickLinks = [
    {
      title: "Attend Quiz",
      description: "Take your scheduled quizzes",
      icon: Pencil,
      link: "/quiz",
      color: "bg-violet-500",
    },
  ];

  return (
    <div
      className={`min-h-screen bg-gray-50 dark:bg-black transition-all duration-700 ${
        mounted ? "opacity-100" : "opacity-0"
      } lg:pl-64`}
    >
      <div className="absolute top-0 left-0 w-auto h-auto pointer-events-none">
        <div className="absolute w-full h-auto bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]"></div>
      </div>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="tour-welcome flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-purple-500 dark:from-violet-400 dark:to-purple-400">
              Welcome, {auth.user.name}!
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Here's what's happening with your academic journey
            </p>
          </div>
          <div className="mt-4 md:mt-0 hidden lg:flex items-center space-x-4">
            <div className="relative" data-notifications>
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  fetchNotifications();
                }}
                className="relative p-2 rounded-full bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-violet-500 rounded-full"></span>
                )}
              </button>

              {showNotifications && <NotificationsDropdown />}
            </div>
            <Link
              to="/profile"
              className="flex items-center space-x-2 px-3 py-1.5 bg-white dark:bg-gray-900 rounded-full shadow-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <img
                src={auth.user.avatar}
                alt={auth.user.name}
                className="w-5 h-5 rounded-full"
              />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Profile
              </span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="tour-stats grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-4 hover:border-violet-200 dark:hover:border-violet-800 transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-lg ${stat.color} bg-opacity-10 dark:bg-opacity-20`}
                >
                  <stat.icon
                    className={`w-5 h-5 ${stat.color.replace("bg-", "text-")}`}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {stat.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-5 space-y-8">
            {/* Attendance Summary Card */}
            {totalSummary && (
              <div className="tour-attendance-summary">
                <AttendanceSummaryCard
                  summary={totalSummary.attendance_summary}
                  onRefresh={fetchAttendance}
                  refreshing={refreshing}
                />
              </div>
            )}

            {/* Quick Links */}
            <div className="tour-quick-links bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                Quick Access
              </h3>
              <div className="space-y-2">
                {quickLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.link}
                    className="group flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-lg ${link.color} bg-opacity-10 dark:bg-opacity-20`}
                      >
                        <link.icon
                          className={`w-4 h-4 ${link.color.replace(
                            "bg-",
                            "text-"
                          )}`}
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {link.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {link.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-violet-500 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="tour-schedule lg:col-span-7">
            <Schedule />
          </div>
        </div>
      </main>
    </div>
  );
}
