import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import {
  Book,
  ArrowLeft,
  RotateCw,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  CalendarDays,
  Users,
  GraduationCap,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { format, parseISO } from "date-fns";
import "react-circular-progressbar/dist/styles.css";

interface AttendanceData {
  id: number;
  cdata: {
    course_code: string;
    course_name: string;
    academic_session: string;
    students_count_formatted: number;
  };
  faculty_name: string;
  attendance_summary: {
    Present: number;
    Absent: number;
    Total: number;
    Percent: string;
  };
  cf_id: number;
  batch: string;
  section: string;
}

interface AttendanceRecord {
  id: number;
  state: string;
  date_formatted: string;
  type: string;
  status: string;
  start_time: string;
  end_time: string;
}

export default function AttendanceDetails() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("course_id");
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalSummary, setTotalSummary] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<AttendanceData | null>(
    null
  );
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);
  const [loadingRecords, setLoadingRecords] = useState(false);

  const fetchAttendanceRecords = useCallback(
    async (course: AttendanceData) => {
      if (!auth.user?.id || !course?.id) {
        console.error("Missing required parameters:", {
          userId: auth.user?.id,
          courseId: course?.id,
        });
        return;
      }

      try {
        setLoadingRecords(true);
        const response = await fetch(
          `https://abes.platform.simplifii.com/api/v1/cards?type=Attendance&sort_by=+datetime1&equalto___fk_student=${auth.user.id}&equalto___cf_id=${course.id}`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch attendance records");
        }

        const data = await response.json();
        setAttendanceRecords(data.response.data);
      } catch (err) {
        console.error("Failed to load attendance records:", err);
      } finally {
        setLoadingRecords(false);
      }
    },
    [auth.token, auth.user?.id]
  );

  const fetchAttendance = async () => {
    if (!auth.user?.id) {
      console.error("User ID not found");
      navigate("/");
      return;
    }

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
      const courses = data.response.data.filter(
        (item: AttendanceData) =>
          item.cdata.course_code !== "Total" &&
          item.attendance_summary.Total > 0
      );

      courses.forEach((course: AttendanceData) => {
        localStorage.setItem(`course_${course.cf_id}`, JSON.stringify(course));
      });

      const total = data.response.data.find(
        (item: any) => item.cdata.course_code === "Total"
      );
      setAttendanceData(courses);
      setTotalSummary(total);

      if (courseId) {
        const selectedCourse = courses.find(
          (course) => course.cf_id === parseInt(courseId)
        );
        if (selectedCourse) {
          setSelectedCourse(selectedCourse);
          fetchAttendanceRecords(selectedCourse);
        }
      }

      setError("");
    } catch (err) {
      setError("Failed to load attendance data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (auth.token && auth.user?.id) {
      fetchAttendance();
    } else {
      navigate("/");
    }
  }, [auth.token, auth.user?.id]);

  useEffect(() => {
    if (!selectedCourse) return;

    const intervalId = setInterval(() => {
      fetchAttendanceRecords(selectedCourse);
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [selectedCourse, fetchAttendanceRecords]);

  if (!auth.user?.id) {
    navigate("/");
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  const getColorByPercentage = (percent: number) => {
    if (percent >= 85) return "#22c55e";
    if (percent >= 75) return "#eab308";
    return "#ef4444";
  };

  const handleBackClick = () => {
    if (selectedCourse) {
      setSelectedCourse(null);
      setAttendanceRecords([]);
      navigate("/attendance");
    } else {
      navigate("/dashboard");
    }
  };

  const handleCourseClick = (course: AttendanceData) => {
    if (!course?.id) {
      console.error("Invalid course data:", course);
      return;
    }

    setSelectedCourse(course);
    fetchAttendanceRecords(course);
    navigate(`/attendance?course_id=${course.cf_id}`);
  };

  const formatTime = (timeString: string) => {
    try {
      const date = parseISO(timeString);
      return format(date, "hh:mm a");
    } catch (err) {
      return timeString;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black lg:pl-64">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBackClick}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {selectedCourse ? "Back to All Subjects" : "Back to Dashboard"}
          </button>
          <button
            onClick={fetchAttendance}
            disabled={refreshing}
            className={`flex items-center px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-all duration-200 ${
              refreshing ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            <RotateCw
              className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {selectedCourse
              ? selectedCourse.cdata.course_name
              : "Attendance Overview"}
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {selectedCourse
              ? `${selectedCourse.faculty_name} • ${selectedCourse.cdata.course_code}`
              : "Detailed view of your attendance across all subjects"}
          </p>
        </div>

        {selectedCourse ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
                    <CalendarDays className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Academic Session
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedCourse.cdata.academic_session}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
                    <Users className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Class Size
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedCourse.cdata.students_count_formatted} Students
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
                    <GraduationCap className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Batch & Section
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      Batch {selectedCourse.batch} • Section{" "}
                      {selectedCourse.section}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
                <div className="w-32 h-32 mx-auto md:mx-0 mb-6 md:mb-0">
                  <CircularProgressbar
                    value={parseFloat(
                      selectedCourse.attendance_summary.Percent
                    )}
                    text={selectedCourse.attendance_summary.Percent}
                    styles={buildStyles({
                      textSize: "20px",
                      pathColor: getColorByPercentage(
                        parseFloat(selectedCourse.attendance_summary.Percent)
                      ),
                      textColor: getColorByPercentage(
                        parseFloat(selectedCourse.attendance_summary.Percent)
                      ),
                      trailColor: "#e5e7eb",
                    })}
                  />
                </div>
                <div className="flex-1 grid grid-cols-3 gap-8 text-center md:text-left">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Present
                    </p>
                    <p className="text-3xl font-bold text-green-500">
                      {selectedCourse.attendance_summary.Present}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Classes
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Absent
                    </p>
                    <p className="text-3xl font-bold text-red-500">
                      {selectedCourse.attendance_summary.Absent}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Classes
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Total
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {selectedCourse.attendance_summary.Total}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Classes
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Lecture History
                </h3>
                <button
                  onClick={() => fetchAttendanceRecords(selectedCourse)}
                  disabled={loadingRecords}
                  className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300"
                >
                  <RotateCw
                    className={`w-5 h-5 ${
                      loadingRecords ? "animate-spin" : ""
                    }`}
                  />
                </button>
              </div>

              {loadingRecords ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-violet-500"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {attendanceRecords.map((record) => (
                    <div
                      key={record.id}
                      className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div
                            className={`mt-1 p-2 rounded-full 
                            ${
                              record.status === "Present"
                                ? "bg-green-100 dark:bg-green-900/30"
                                : "bg-red-100 dark:bg-red-900/30"
                            }`}
                          >
                            {record.status === "Present" ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-500" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {record.date_formatted}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 mt-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatTime(record.start_time)} -{" "}
                                {formatTime(record.end_time)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium
                            ${
                              record.status === "Present"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            }`}
                          >
                            {record.status}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            {record.type === "L" ? "Lecture" : "Practical"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {totalSummary && (
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Overall Summary
                </h2>
                <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
                  <div className="w-32 h-32 mx-auto md:mx-0 mb-6 md:mb-0">
                    <CircularProgressbar
                      value={parseFloat(
                        totalSummary.attendance_summary.Percent
                      )}
                      text={totalSummary.attendance_summary.Percent}
                      styles={buildStyles({
                        textSize: "20px",
                        pathColor: getColorByPercentage(
                          parseFloat(totalSummary.attendance_summary.Percent)
                        ),
                        textColor: getColorByPercentage(
                          parseFloat(totalSummary.attendance_summary.Percent)
                        ),
                        trailColor: "#e5e7eb",
                      })}
                    />
                  </div>
                  <div className="flex-1 grid grid-cols-3 gap-8 text-center md:text-left">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Present
                      </p>
                      <p className="text-3xl font-bold text-green-500">
                        {totalSummary.attendance_summary.Present}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Classes
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Absent
                      </p>
                      <p className="text-3xl font-bold text-red-500">
                        {totalSummary.attendance_summary.Total -
                          totalSummary.attendance_summary.Present}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Classes
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Total
                      </p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {totalSummary.attendance_summary.Total}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Classes
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {attendanceData.map((course, index) => {
                const percentage = parseFloat(
                  course.attendance_summary.Percent
                );

                return (
                  <div
                    key={index}
                    onClick={() => handleCourseClick(course)}
                    className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 hover:border-violet-200 dark:hover:border-violet-800 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Book className="w-5 h-5 text-violet-500" />
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                            {course.cdata.course_name}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {course.faculty_name}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {course.cdata.course_code}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-violet-500 transition-colors" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="w-24 h-24">
                        <CircularProgressbar
                          value={percentage}
                          text={`${percentage}%`}
                          styles={buildStyles({
                            textSize: "20px",
                            pathColor: getColorByPercentage(percentage),
                            textColor: getColorByPercentage(percentage),
                            trailColor: "#e5e7eb",
                          })}
                        />
                      </div>
                      <div className="flex-1 ml-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              Present
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {course.attendance_summary.Present}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              Absent
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {course.attendance_summary.Absent}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              Total
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {course.attendance_summary.Total}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
