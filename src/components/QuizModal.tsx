import React, { useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'error' | 'success' | 'info' | 'countdown';
  title: string;
  message: string;
  countdown?: { minutes: number; seconds: number } | null;
}

export default function QuizModal({ 
  isOpen, 
  onClose, 
  type, 
  title, 
  message,
  countdown 
}: QuizModalProps) {
  // Auto-close success messages after 1 second
  useEffect(() => {
    if (type === 'success' && isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [type, isOpen, onClose]);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="sm"
      hideCloseButton={type === 'countdown' || type === 'success'}
      isDismissable={type !== 'countdown' && type !== 'success'}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center space-x-2">
                {type === 'error' ? (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                ) : type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : type === 'countdown' ? (
                  <Clock className="w-5 h-5 text-violet-500" />
                ) : (
                  <Clock className="w-5 h-5 text-blue-500" />
                )}
                <span className={
                  type === 'error' ? 'text-red-500' : 
                  type === 'success' ? 'text-green-500' :
                  type === 'countdown' ? 'text-violet-500' :
                  'text-blue-500'
                }>
                  {title}
                </span>
              </div>
            </ModalHeader>
            <ModalBody>
              <p className="text-gray-600 dark:text-gray-400">
                {message}
              </p>
              {type === 'countdown' && countdown && (
                <div className="mt-4 text-center">
                  <div className="text-4xl font-mono font-bold text-violet-600 dark:text-violet-400">
                    {String(countdown.minutes).padStart(2, '0')}:
                    {String(countdown.seconds).padStart(2, '0')}
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    until login window opens
                  </p>
                </div>
              )}
            </ModalBody>
            {type !== 'countdown' && type !== 'success' && (
              <ModalFooter>
                <Button 
                  color={
                    type === 'error' ? 'danger' : 
                    type === 'success' ? 'success' :
                    'secondary'
                  } 
                  variant="light" 
                  onPress={onClose}
                >
                  Close
                </Button>
              </ModalFooter>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
}