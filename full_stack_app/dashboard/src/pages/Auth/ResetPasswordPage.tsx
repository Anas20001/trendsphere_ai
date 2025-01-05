import React from 'react';
import { AuthLayout, ResetPasswordForm } from '../../components/Landing/Auth';

export function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Reset password"
      subtitle="Enter your email to receive reset instructions"
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
}