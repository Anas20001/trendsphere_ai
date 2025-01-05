import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { LandingPage } from './pages/Landing';
import { SignInPage, SignUpPage, ResetPasswordPage } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { UploadPage } from './pages/UploadPage';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="upload" element={<UploadPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;