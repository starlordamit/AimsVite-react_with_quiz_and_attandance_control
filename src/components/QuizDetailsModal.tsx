import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody } from '@nextui-org/react';
import { 
  BookOpen, 
  FileText, 
  Timer, 
  CalendarDays, 
  Clock, 
  GraduationCap, 
  Users,
  Building
} from 'lucide-react';
import { QuizDetails } from '../types/quiz';

interface QuizDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizDetails: QuizDetails | null;
}

export default function QuizDetailsModal({
  isOpen,
  onClose,
  quizDetails,
}: QuizDetailsModalProps) {
  if (!quizDetails) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
                  <BookOpen className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {quizDetails.cdata.course_name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {quizDetails.master_course_code} • {quizDetails.faculty_name}
                  </p>
                </div>
              </div>
            </ModalHeader>
            <ModalBody className="space-y-6">
              {/* Course Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Department</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{quizDetails.dept}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Section</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Section {quizDetails.section}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <GraduationCap className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Batch</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{quizDetails.batch}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Questions</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{quizDetails.questions_count}</p>
                  </div>
                </div>
              </div>

              {/* Quiz Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-violet-50 dark:bg-violet-900/20 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <Timer className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {quizDetails.duration} mins
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Login Window</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {quizDetails.login_window} mins
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <CalendarDays className="w-5 h-5 text-gray-400" />
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Schedule</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                      {quizDetails.cdata.date_formatted}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                      {quizDetails.cdata.start_end_time}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Login Time</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                      {quizDetails.cdata.login_time_formatted}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Marks</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                      {quizDetails.total_marks}
                    </p>
                  </div>
                </div>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}