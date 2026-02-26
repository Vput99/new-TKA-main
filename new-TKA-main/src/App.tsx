import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import StudentLogin from './pages/StudentLogin';
import StudentDashboard from './pages/StudentDashboard';
import ExamWorkspace from './pages/ExamWorkspace';
import ResultSummary from './pages/ResultSummary';
import TeacherLogin from './pages/TeacherLogin';
import TeacherDashboard from './pages/TeacherDashboard';
import ExamReview from './pages/ExamReview';
import BankSoal from './pages/BankSoal';
import ManajemenSiswa from './pages/ManajemenSiswa';
import AddStudent from './pages/AddStudent';
import AddQuestion from './pages/AddQuestion';

export default function App() {
  const [user, setUser] = useState<{ type: 'student' | 'teacher'; name: string; id: string } | null>(null);

  const logout = () => setUser(null);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/student/login" element={<StudentLogin onLogin={(name, id) => setUser({ type: 'student', name, id })} />} />
        <Route path="/teacher/login" element={<TeacherLogin onLogin={(name, id) => setUser({ type: 'teacher', name, id })} />} />
        
        <Route 
          path="/dashboard" 
          element={user?.type === 'student' ? <StudentDashboard user={user} onLogout={logout} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/exam/:subject" 
          element={user?.type === 'student' ? <ExamWorkspace user={user} onLogout={logout} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/results" 
          element={user?.type === 'student' ? <ResultSummary user={user} onLogout={logout} /> : <Navigate to="/" />} 
        />
        
        <Route 
          path="/teacher/dashboard" 
          element={user?.type === 'teacher' ? <TeacherDashboard user={user} onLogout={logout} /> : <Navigate to="/teacher/login" />} 
        />
        <Route 
          path="/exam/review" 
          element={user?.type === 'student' ? <ExamReview user={user} onLogout={logout} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/teacher/bank-soal" 
          element={user?.type === 'teacher' ? <BankSoal user={user} onLogout={logout} /> : <Navigate to="/teacher/login" />} 
        />
        <Route 
          path="/teacher/manajemen-siswa" 
          element={user?.type === 'teacher' ? <ManajemenSiswa user={user} onLogout={logout} /> : <Navigate to="/teacher/login" />} 
        />
        <Route 
          path="/teacher/add-student" 
          element={user?.type === 'teacher' ? <AddStudent user={user} onLogout={logout} /> : <Navigate to="/teacher/login" />} 
        />
        <Route 
          path="/teacher/add-question" 
          element={user?.type === 'teacher' ? <AddQuestion user={user} onLogout={logout} /> : <Navigate to="/teacher/login" />} 
        />
      </Routes>
    </div>
  );
}
