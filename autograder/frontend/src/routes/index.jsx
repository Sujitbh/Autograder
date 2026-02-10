import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'

// Auth
import { ProtectedRoute, RoleRoute, PublicRoute, useAuth } from '../auth'
import LoginPage from '../pages/LoginPage'

// Layouts
import { DashboardLayout } from '../layouts'

// Student Pages
import {
  StudentDashboard,
  StudentAssignments,
  StudentAssignmentDetail,
  StudentSubmissions,
} from '../pages/student'

// Faculty Pages
import {
  FacultyDashboard,
  FacultyAssignments,
  FacultyAssignmentDetail,
  FacultyGrading,
} from '../pages/faculty'

// Admin Pages
import { AdminDashboard } from '../pages/admin'

// Helper component to redirect based on role
function RoleRedirect() {
  const { user } = useAuth()

  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />
  } else if (user?.role === 'faculty') {
    return <Navigate to="/faculty/dashboard" replace />
  } else {
    return <Navigate to="/student/dashboard" replace />
  }
}

export const router = createBrowserRouter([
  // Public route - Login
  {
    path: '/login',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },

  // Protected Student Routes
  {
    path: '/student',
    element: (
      <RoleRoute allowedRoles={['student']}>
        <DashboardLayout />
      </RoleRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/student/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <StudentDashboard />,
      },
      {
        path: 'assignments',
        element: <StudentAssignments />,
      },
      {
        path: 'assignments/:id',
        element: <StudentAssignmentDetail />,
      },
      {
        path: 'submissions',
        element: <StudentSubmissions />,
      },
    ],
  },

  // Protected Faculty Routes
  {
    path: '/faculty',
    element: (
      <RoleRoute allowedRoles={['faculty', 'admin']}>
        <DashboardLayout />
      </RoleRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/faculty/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <FacultyDashboard />,
      },
      {
        path: 'assignments',
        element: <FacultyAssignments />,
      },
      {
        path: 'assignments/:id',
        element: <FacultyAssignmentDetail />,
      },
      {
        path: 'grading',
        element: <FacultyGrading />,
      },
    ],
  },

  // Protected Admin Routes
  {
    path: '/admin',
    element: (
      <RoleRoute allowedRoles={['admin']}>
        <DashboardLayout />
      </RoleRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <AdminDashboard />,
      },
    ],
  },

  // Root redirect
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <RoleRedirect />
      </ProtectedRoute>
    ),
  },

  // Catch all - redirect to login
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
])

export default router
