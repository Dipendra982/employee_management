
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
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
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Routes - Only accessible without authentication */}
            <Route path="/" element={
              <PublicRoute>
                <Landing />
              </PublicRoute>
            } />
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/signup" element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            } />
            
            {/* Protected Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/staff" element={
              <ProtectedRoute adminOnly={true}>
                <StaffManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/attendance" element={
              <ProtectedRoute adminOnly={true}>
                <AdminAttendance />
              </ProtectedRoute>
            } />
            <Route path="/admin/leaves" element={
              <ProtectedRoute adminOnly={true}>
                <AdminLeaves />
              </ProtectedRoute>
            } />
            <Route path="/admin/tasks" element={
              <ProtectedRoute adminOnly={true}>
                <AdminTasks />
              </ProtectedRoute>
            } />
            <Route path="/admin/notices" element={
              <ProtectedRoute adminOnly={true}>
                <AdminNotices />
              </ProtectedRoute>
            } />
            <Route path="/admin/reports" element={
              <ProtectedRoute adminOnly={true}>
                <AdminReports />
              </ProtectedRoute>
            } />
            
            {/* Protected Staff Routes */}
            <Route path="/staff/dashboard" element={
              <ProtectedRoute>
                <StaffDashboard />
              </ProtectedRoute>
            } />
            <Route path="/staff/attendance" element={
              <ProtectedRoute>
                <MyAttendance />
              </ProtectedRoute>
            } />
            <Route path="/staff/leaves" element={
              <ProtectedRoute>
                <ApplyLeave />
              </ProtectedRoute>
            } />
            <Route path="/staff/tasks" element={
              <ProtectedRoute>
                <MyTasks />
              </ProtectedRoute>
            } />
            <Route path="/staff/notices" element={
              <ProtectedRoute>
                <StaffNotices />
              </ProtectedRoute>
            } />
            <Route path="/staff/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            {/* Redirect unknown routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
