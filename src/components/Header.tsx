import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationsContext";
import { Menu, Bell, ExternalLink, Loader2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Header() {
  const { auth } = useAuth();
  const { notifications, loading, error, fetchNotifications } =
    useNotifications();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setShowSidebar(false);
    setShowNotifications(false);
  }, [location]);

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

  if (!auth.user) return null;

  const NotificationsDropdown = () => (
    <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Notifications
        </h3>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {loading ? (
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

  return (
    <>
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 lg:hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setShowSidebar(true)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>

          <div className="flex items-center space-x-2">
            <div className="relative" data-notifications>
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  fetchNotifications();
                }}
                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
              className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <img
                src={auth.user.avatar}
                alt={auth.user.name}
                className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)} />
    </>
  );
}
