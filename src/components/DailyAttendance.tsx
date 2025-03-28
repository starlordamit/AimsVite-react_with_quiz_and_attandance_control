import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { format, parseISO } from 'date-fns';
import { Clock, CheckCircle2, XCircle, BookOpen, Users } from 'lucide-react';

interface AttendanceRecord {
  id: number;
  state: string;
  date_formatted: string;
  type: string;
  status: string;
  start_time: string;
  end_time: string;
  faculty_name: string;
}

interface DailyAttendanceProps {
  selectedDate: Date;
}

export default function DailyAttendance({ selectedDate }: DailyAttendanceProps) {
  const { auth } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchDailyAttendance = async (date: Date) => {
    if (!auth.user?.id) return;

    try {
      setRefreshing(true);
      const formattedDate = format(date, 'yyyy-MM-dd');
      const response = await fetch(
        `https://abes.platform.simplifii.com/api/v1/cards?type=Attendance&sort_by=+datetime1&equalto___fk_student=${auth.user.id}&like___start_time=${formattedDate}`,
        {
          headers: {
            'Authorization': `Bearer ${auth.token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch attendance records');
      }

      const data = await response.json();
      const sortedRecords = data.response.data.sort((a: AttendanceRecord, b: AttendanceRecord) => {
        return parseISO(a.start_time).getTime() - parseISO(b.start_time).getTime();
      });
      setAttendanceRecords(sortedRecords);
      setError('');
    } catch (err) {
      setError('Failed to load attendance data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (auth.token && auth.user?.id) {
      fetchDailyAttendance(selectedDate);
    }
  }, [auth.token, auth.user?.id, selectedDate]);

  useEffect(() => {
    const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
    if (!isToday) return;

    const intervalId = setInterval(() => fetchDailyAttendance(selectedDate), 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [selectedDate]);

  const formatTime = (timeString: string) => {
    try {
      const date = parseISO(timeString);
      return format(date, 'hh:mm a');
    } catch (err) {
      return timeString;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-24">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">{error}</div>
    );
  }

  const presentCount = attendanceRecords.filter(record => record.status === 'Present').length;
  const absentCount = attendanceRecords.filter(record => record.status === 'Absent').length;

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-400">Present</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{presentCount}</p>
            </div>
            <div className="p-3 bg-white dark:bg-green-900/30 rounded-full">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-400">Absent</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{absentCount}</p>
            </div>
            <div className="p-3 bg-white dark:bg-red-900/30 rounded-full">
              <XCircle className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-2">
        {attendanceRecords.length > 0 ? (
          attendanceRecords.map((record) => (
            <div 
              key={record.id}
              className="flex items-center rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-all duration-200"
            >
              {/* Time Column */}
              <div className="flex-shrink-0 w-32 px-3 py-2 border-r border-gray-100 dark:border-gray-800">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-violet-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatTime(record.start_time)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {record.type === 'L' ? 'Lecture' : 'Practical'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Lecture Content */}
              <div className="flex-1 px-4 py-2">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-violet-500 flex-shrink-0" />
                      <div className="truncate">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {record.faculty_name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTime(record.start_time)} - {formatTime(record.end_time)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 ml-4">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0
                      ${record.status === 'Present'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}
                    >
                      {record.status}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-32 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No lectures recorded for this day
            </p>
          </div>
        )}
      </div>
    </div>
  );
}