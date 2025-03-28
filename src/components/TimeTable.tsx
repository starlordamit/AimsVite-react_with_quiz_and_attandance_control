import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { format, parseISO, isAfter, isBefore, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { Book, Clock, CheckCircle2, GraduationCap, Users, BookOpen } from 'lucide-react';

interface TimeSlot {
  time: string[][];
  course: string;
  course_details: {
    batch_year: string;
    branch: string;
    faculty_name: string;
    section: string;
    subject_code: string;
    subject_name: string;
  };
}

interface DaySchedule {
  classes: TimeSlot[];
  date: string;
  weekday: string;
}

interface TimeTableData {
  [key: string]: DaySchedule;
}

interface TimeTableProps {
  selectedDate: Date;
}

export default function TimeTable({ selectedDate }: TimeTableProps) {
  const { auth } = useAuth();
  const [timeTable, setTimeTable] = useState<TimeTableData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchTimeTable = async () => {
      try {
        const response = await fetch('https://aims.dev80.tech/timetable', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ token: auth.token }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch timetable');
        }

        const data = await response.json();
        setTimeTable(data);
      } catch (err) {
        setError('Failed to load timetable');
      } finally {
        setLoading(false);
      }
    };

    if (auth.token) {
      fetchTimeTable();
    }
  }, [auth.token]);

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

  if (!timeTable) return null;

  const getLectureStatus = (timeSlots: string[][], selectedDate: Date) => {
    const now = currentTime;
    const selectedDateStart = startOfDay(selectedDate);
    const selectedDateEnd = endOfDay(selectedDate);
    const todayStart = startOfDay(now);
    
    // If selected date is in the past
    if (isBefore(selectedDateEnd, todayStart)) {
      return 'completed';
    }
    
    // If selected date is in the future
    if (isAfter(selectedDateStart, now)) {
      return 'upcoming';
    }
    
    // For today's lectures
    for (const slot of timeSlots) {
      const [startTimeStr, endTimeStr] = slot;
      const lectureStart = parseISO(`${format(selectedDate, 'yyyy-MM-dd')}T${startTimeStr}`);
      const lectureEnd = parseISO(`${format(selectedDate, 'yyyy-MM-dd')}T${endTimeStr}`);
      
      if (isWithinInterval(now, { start: lectureStart, end: lectureEnd })) {
        return 'ongoing';
      }
      
      if (isBefore(now, lectureStart)) {
        return 'upcoming';
      }
      
      if (isAfter(now, lectureEnd)) {
        return 'completed';
      }
    }
    
    return 'upcoming';
  };

  const getAllTimeSlots = () => {
    const slots = new Set<string>();
    Object.values(timeTable).forEach(day => {
      day.classes.forEach(lecture => {
        lecture.time.forEach(time => {
          slots.add(time[0]);
        });
      });
    });
    return Array.from(slots).sort();
  };

  const timeSlots = getAllTimeSlots();
  const selectedDaySchedule = timeTable[Object.keys(timeTable).find(key => 
    timeTable[key].date === format(selectedDate, 'yyyy-MM-dd')
  ) || ''];

  const getLectureForTimeSlot = (startTime: string) => {
    if (!selectedDaySchedule) return null;
    return selectedDaySchedule.classes.find(lecture => 
      lecture.time.some(time => time[0] === startTime)
    );
  };

  const getStatusStyles = (status: string | null) => {
    switch (status) {
      case 'ongoing':
        return {
          bg: 'bg-green-50 dark:bg-green-900/10',
          border: 'border-green-200 dark:border-green-800',
          text: 'text-green-800 dark:text-green-400',
          badge: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
        };
      case 'completed':
        return {
          bg: 'bg-gray-50 dark:bg-gray-900/50',
          border: 'border-gray-200 dark:border-gray-800',
          text: 'text-gray-800 dark:text-gray-400',
          badge: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
        };
      case 'upcoming':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/10',
          border: 'border-blue-200 dark:border-blue-800',
          text: 'text-blue-800 dark:text-blue-400',
          badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
        };
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-900/50',
          border: 'border-gray-100 dark:border-gray-800/50',
          text: 'text-gray-800 dark:text-gray-400',
          badge: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
        };
    }
  };

  return (
    <div className="p-4">
      <div className="grid gap-2">
        {timeSlots.map((startTime, index) => {
          const lecture = getLectureForTimeSlot(startTime);
          const time = parseISO(`2025-01-01T${startTime}`);
          const status = lecture ? getLectureStatus(lecture.time, selectedDate) : null;
          const styles = getStatusStyles(status);
          
          return (
            <div 
              key={index}
              className={`flex flex-col sm:flex-row items-start sm:items-center rounded-lg border ${styles.border} transition-all duration-200 ${styles.bg}`}
            >
              {/* Time Column */}
              <div className="flex-shrink-0 w-full sm:w-32 p-3 sm:border-r border-gray-100 dark:border-gray-800 border-b sm:border-b-0">
                <div className="flex items-center space-x-2">
                  <Clock className={`w-4 h-4 ${status === 'ongoing' ? 'text-green-500 animate-pulse' : 'text-violet-500'}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {format(time, 'hh:mm a')}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Period {index + 1}
                    </p>
                  </div>
                </div>
              </div>

              {/* Lecture Content */}
              <div className="flex-1 p-3 sm:px-4 w-full">
                {lecture ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        {status === 'ongoing' && (
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        )}
                        <BookOpen className={`w-4 h-4 flex-shrink-0 ${status === 'ongoing' ? 'text-green-500' : 'text-violet-500'}`} />
                        <div className="truncate">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {lecture.course_details.subject_name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {lecture.course_details.subject_code} • {lecture.course_details.faculty_name}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {lecture.course_details.section}
                        </span>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${styles.badge}`}>
                        {status === 'ongoing' ? 'In Progress' 
                          : status === 'completed' ? 'Completed' 
                          : 'Upcoming'}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full py-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No lecture scheduled
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}