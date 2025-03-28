import React, { useState } from "react";
import TimeTable from "./TimeTable";
import DailyAttendance from "./DailyAttendance";
import { Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { format, parseISO, subDays, addDays } from "date-fns";

export default function Schedule() {
  const [activeTab, setActiveTab] = useState<"timetable" | "attendance">(
    "timetable"
  );
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handlePreviousDay = () => {
    setSelectedDate((prev) => subDays(prev, 1));
  };

  const handleNextDay = () => {
    const nextDay = addDays(selectedDate, 1);
    setSelectedDate(nextDay);
    if (nextDay <= new Date()) {
      setSelectedDate(nextDay);
    }
  };

  const isToday =
    format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4">
          {/* Tabs */}
          <div className="flex overflow-x-auto scrollbar-hide -mx-4 sm:mx-0">
            <button
              onClick={() => setActiveTab("timetable")}
              className={`flex items-center px-6 py-4 text-sm font-medium transition-colors relative whitespace-nowrap
                ${
                  activeTab === "timetable"
                    ? "text-violet-600 dark:text-violet-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
            >
              <Clock className="w-4 h-4 mr-2" />
              Time Table
              {activeTab === "timetable" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-violet-600 dark:bg-violet-400" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("attendance")}
              className={`flex items-center px-6 py-4 text-sm font-medium transition-colors relative whitespace-nowrap
                ${
                  activeTab === "attendance"
                    ? "text-violet-600 dark:text-violet-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Daily Attendance
              {activeTab === "attendance" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-violet-600 dark:bg-violet-400" />
              )}
            </button>
          </div>
          {/* Date Picker */}
          {/* // File: src/components/DayNavigator.tsx | Component starts at line 1 */}
          <div className="flex items-center justify-center space-x-1 py-4 sm:py-0 border-t sm:border-t-0 border-gray-200 dark:border-gray-800">
            <button
              onClick={handlePreviousDay}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <div className="text-center min-w-[120px]">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {format(selectedDate, "EEEE")}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {format(selectedDate, "MMMM d")}
              </p>
            </div>
            <button
              onClick={handleNextDay}
              disabled={isToday}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {activeTab === "timetable" ? (
        <TimeTable selectedDate={selectedDate} />
      ) : (
        <DailyAttendance selectedDate={selectedDate} />
      )}
    </div>
  );
}
