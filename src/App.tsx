import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { TourProvider } from './context/TourContext';
import { NotificationsProvider } from './context/NotificationsContext';
import { NextUIProvider } from '@nextui-org/react';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Header from './components/Header';
import AttendanceDetails from './pages/AttendanceDetails';
import Quiz from './pages/Quiz';
import CompletedQuizzes from './pages/CompletedQuizzes';
import CompletedQuizDetails from './pages/CompletedQuizDetails';
import About from './pages/About';
import WelcomeScreen from './components/WelcomeScreen';
import AddToHomeScreen from './components/AddToHomeScreen';

function App() {
  return (
    <NextUIProvider>
      <ThemeProvider>
        <AuthProvider>
          <NotificationsProvider>
            <TourProvider>
              <Router>
                <AddToHomeScreen />
                <Routes>
                  <Route path="/" element={<LoginForm />} />
                  <Route path="/welcome" element={<WelcomeScreen standalone={true} />} />
                  <Route path="/dashboard" element={
                    <>
                      <Header />
                      <Dashboard />
                    </>
                  } />
                  <Route path="/profile" element={
                    <>
                      <Header />
                      <Profile />
                    </>
                  } />
                  <Route path="/attendance" element={
                    <>
                      <Header />
                      <AttendanceDetails />
                    </>
                  } />
                  <Route path="/quiz" element={
                    <>
                      <Header />
                      <Quiz />
                    </>
                  } />
                  <Route path="/completed-quizzes" element={
                    <>
                      <Header />
                      <CompletedQuizzes />
                    </>
                  } />
                  <Route path="/completed-quizzes/:quizCode" element={
                    <>
                      <Header />
                      <CompletedQuizDetails />
                    </>
                  } />
                  <Route path="/about" element={
                    <>
                      <Header />
                      <About />
                    </>
                  } />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Router>
            </TourProvider>
          </NotificationsProvider>
        </AuthProvider>
      </ThemeProvider>
    </NextUIProvider>
  );
}

export default App;