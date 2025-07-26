
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Landing from './pages/landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/admin/AdminDashboard';
import StaffManagement from './pages/admin/StaffManagement';
import AdminAttendance from './pages/admin/Attendance';
import AdminLeaves from './pages/admin/Leaves';
import AdminTasks from './pages/admin/Tasks';
import AdminNotices from './pages/admin/Notices';
import AdminReports from './pages/admin/Reports';
import StaffDashboard from './pages/staff/StaffDashboard';
import MyAttendance from './pages/staff/MyAttendance';
import ApplyLeave from './pages/staff/ApplyLeave';
import MyTasks from './pages/staff/MyTasks';
import StaffNotices from './pages/staff/Notices';
import Profile from './pages/staff/Profile';
import NotFound from './pages/NotFound';
import './styles/global.css';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/staff" element={<StaffManagement />} />
        <Route path="/admin/attendance" element={<AdminAttendance />} />
        <Route path="/admin/leaves" element={<AdminLeaves />} />
        <Route path="/admin/tasks" element={<AdminTasks />} />
        <Route path="/admin/notices" element={<AdminNotices />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        
        {/* Staff Routes */}
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/staff/attendance" element={<MyAttendance />} />
        <Route path="/staff/leaves" element={<ApplyLeave />} />
        <Route path="/staff/tasks" element={<MyTasks />} />
        <Route path="/staff/notices" element={<StaffNotices />} />
        <Route path="/staff/profile" element={<Profile />} />
        
        {/* Redirect unknown routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
