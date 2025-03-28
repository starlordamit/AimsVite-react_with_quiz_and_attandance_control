import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Book } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AttendanceData {
  cdata: {
    course_code: string;
    course_name: string;
  };
  faculty_name: string;
  attendance_summary: {
    Present: number;
    Absent: number;
    Total: number;
    Percent: string;
  };
  cf_id: number;
}

export default function AttendanceSummary() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch('https://abes.platform.simplifii.com/api/v1/custom/getCFMappedWithStudentID?embed_attendance_summary=1', {
          headers: {
            'Authorization': `Bearer ${auth.token}`,
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch attendance data');
        }

        const data = await response.json();
        // Filter out the total summary and courses with no attendance
        const courses = data.response.data.filter((item: AttendanceData) => 
          item.cdata.course_code !== 'Total' && 
          item.attendance_summary.Total > 0
        );

        // Store each course's data in localStorage with its cf_id
        courses.forEach((course: AttendanceData) => {
          localStorage.setItem(`course_${course.cf_id}`, JSON.stringify(course));
        });

        setAttendanceData(courses);
      } catch (err) {
        setError('Failed to load attendance data');
      } finally {
        setLoading(false);
      }
    };

    if (auth.token) {
      fetchAttendance();
    }
  }, [auth.token]);

  const handleCourseClick = (course: AttendanceData) => {
    navigate(`/attendance?course_id=${course.cf_id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  const getColorByPercentage = (percent: number) => {
    if (percent >= 85) return '#22c55e';
    if (percent >= 75) return '#eab308';
    return '#ef4444';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {attendanceData.map((course, index) => {
        const percentage = parseFloat(course.attendance_summary.Percent);
        return (
          <div 
            key={index}
            onClick={() => handleCourseClick(course)}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 hover:border-violet-200 dark:hover:border-violet-800 transition-all duration-200 cursor-pointer"
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
            </div>

            <div className="flex items-center justify-between">
              <div className="w-24 h-24">
                <CircularProgressbar
                  value={percentage}
                  text={`${percentage}%`}
                  styles={buildStyles({
                    textSize: '20px',
                    pathColor: getColorByPercentage(percentage),
                    textColor: getColorByPercentage(percentage),
                    trailColor: '#e5e7eb',
                  })}
                />
              </div>
              <div className="flex-1 ml-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Present</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {course.attendance_summary.Present}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Absent</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {course.attendance_summary.Absent}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Total</span>
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
  );
}