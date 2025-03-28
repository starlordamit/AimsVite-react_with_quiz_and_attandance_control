import React, { createContext, useContext, useState } from 'react';
import { Step } from 'react-joyride';

interface TourContextType {
  showTour: boolean;
  setShowTour: (show: boolean) => void;
  currentTourSteps: Step[];
  setCurrentTourSteps: (steps: Step[]) => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const DASHBOARD_TOUR_STEPS: Step[] = [
  {
    target: '.tour-welcome',
    content: 'Welcome to your dashboard! Here you can see your academic progress and daily activities.',
    disableBeacon: true,
  },
  {
    target: '.tour-stats',
    content: 'Quick overview of your academic information including semester, year, and section.',
  },
  {
    target: '.tour-attendance-summary',
    content: 'Track your overall attendance percentage and get detailed statistics.',
  },
  {
    target: '.tour-quick-links',
    content: 'Access important resources and features quickly from here.',
  },
  {
    target: '.tour-schedule',
    content: 'View your daily schedule and attendance records. Switch between timetable and attendance views.',
  },
];

export function TourProvider({ children }: { children: React.ReactNode }) {
  const [showTour, setShowTour] = useState(false);
  const [currentTourSteps, setCurrentTourSteps] = useState<Step[]>([]);

  return (
    <TourContext.Provider value={{ showTour, setShowTour, currentTourSteps, setCurrentTourSteps }}>
      {children}
    </TourContext.Provider>
  );
}

export const useTour = () => {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};