import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  Home,
  BookOpen,
  PenTool,
  CheckSquare,
  User,
  Info,
  LogOut,
  Sun,
  Moon,
  Bell,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { auth, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  if (!auth.user) return null;

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Attendance", href: "/attendance", icon: BookOpen },
    { name: "Attempt Quiz", href: "/quiz", icon: PenTool },
    {
      name: "Completed Quizzes",
      href: "/completed-quizzes",
      icon: CheckSquare,
    },
    { name: "About", href: "/about", icon: Info },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="ml-10 border-b border-gray-200 dark:border-gray-800">
            <Link
              to="/dashboard"
              className="flex items-center space-x-3"
              onClick={onClose}
            >
              <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-purple-500 dark:from-violet-400 dark:to-purple-400">
                <img
                  src="/logo.svg"
                  width="70%"
                  marginright="50px"
                  alt="logo"
                />
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
                <img
                  src={auth.user.avatar}
                  alt={auth.user.name}
                  className="relative w-10 h-10 rounded-full border-2 border-violet-200 dark:border-violet-800"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {auth.user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {auth.user.role}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={toggleTheme}
                className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="w-5 h-5 text-yellow-500" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-5 h-5 text-violet-500" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>

              <button
                onClick={logout}
                className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
