import React from 'react';
import { AuthLayout, SignUpForm } from '../../components/Landing/Auth';

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