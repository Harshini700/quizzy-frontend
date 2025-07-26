import { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';

import Sidebar from './components/Sidebar';
import CreateQuizForm from './pages/CreateQuizForm';
import Home from './pages/Home';
import TakeQuiz from './pages/TakeQuiz';
import QuizAttempts from './pages/QuizAttempts';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import SidebarQuestions from './pages/sidebarQuestions';


import './App.css';

function AppContent() {
  const [activePage, setActivePage] = useState('dashboard');
  const location = useLocation();

  const hideSidebar = [
    /^\/quiz\/[^/]+\/take$/,
    /^\/quiz\/[^/]+\/start$/,
    /^\/quiz\/[^/]+$/,
    /^\/login$/,
    /^\/register$/,
  ].some((regex) => regex.test(location.pathname));

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {!hideSidebar && (
        <Sidebar setActivePage={setActivePage} activePage={activePage} />
      )}

      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ p: !hideSidebar ? 4 : 0 }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/quizzes" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/create" element={<ProtectedRoute><CreateQuizForm /></ProtectedRoute>} />
            <Route path="/quiz/:quizId" element={<ProtectedRoute><CreateQuizForm /></ProtectedRoute>} />
            <Route path="/quiz/:quizId/take" element={<ProtectedRoute><TakeQuiz /></ProtectedRoute>} />
            <Route path="/quiz/:quizId/attempts" element={<ProtectedRoute><QuizAttempts /></ProtectedRoute>} />
            <Route path="/questions" element={<SidebarQuestions/>}/>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
        </Box>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
