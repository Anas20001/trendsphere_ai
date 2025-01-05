import React from 'react';
import { AuthLayout } from '../components/Auth/AuthLayout';
import { SignUpForm } from '../components/Auth/SignUpForm';

export function SignUpPage() {
  return (
    <AuthLayout
      title="Create an account"
      subtitle="Start your free trial"
    >
      <SignUpForm />
    </AuthLayout>
  );
}