import React from 'react';
import { AuthLayout, SignInForm } from '../../components/Landing/Auth';

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