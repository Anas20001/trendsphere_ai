import React from 'react';
import { AuthLayout } from '../components/Auth/AuthLayout';
import { SignInForm } from '../components/Auth/SignInForm';

export function SignInPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account"
    >
      <SignInForm />
    </AuthLayout>
  );
}