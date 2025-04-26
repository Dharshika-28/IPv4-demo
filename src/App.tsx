import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import AdminDashboard from './admin/AdminDashboard.tsx';
import AdminRegister from './admin/AdminRegister.tsx';
import UserDetails from './admin/UserDetails.tsx';
import ModulePage from './pages/Modulepage.tsx';
import CourseProgressDetails from './admin/CourseProgressDetails.tsx';
import ChangePassword from './pages/ChangePassword.tsx';
import ResetPassword from './pages/ResetPassword.tsx';



const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
      {/* <Navbar /> */}

      <main className="flex-grow p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/adminregister" element={<AdminRegister/>} />
          <Route path="/userDetails" element={<UserDetails/>} />
          <Route path="/courseprogress" element={<CourseProgressDetails/>} />
          <Route path="/courseprogressdetails/:email" element={<CourseProgressDetails />} />
          <Route path="/modules" element={<ModulePage />} /> 
          <Route path="/forgot-password" element={<ResetPassword />} />
          <Route path="/change-password" element={<ChangePassword />} /> 
        </Routes>
      </main>
    </div>
  );
};

export default App;
