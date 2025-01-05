import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { signUp } from '../../lib/auth';
import { LoadingSpinner } from '../LoadingSpinner';

export function SignUpForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    acceptTerms: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signUp(formData);
      toast.success('Account created successfully! Please check your email to verify your account.');
      navigate('/signin');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="name" className="sr-only">Full name</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="email" className="sr-only">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Email address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          id="accept-terms"
          name="accept-terms"
          type="checkbox"
          required
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          checked={formData.acceptTerms}
          onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
        />
        <label htmlFor="accept-terms" className="ml-2 block text-sm text-gray-900">
          I accept the{' '}
          <Link to="/terms" className="font-medium text-indigo-600 hover:text-indigo-500">
            Terms of Service
          </Link>
        </label>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isLoading ? <LoadingSpinner /> : 'Sign up'}
        </button>
      </div>

      <div className="text-sm text-center">
        <span className="text-gray-600">Already have an account?</span>{' '}
        <Link to="/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
          Sign in
        </Link>
      </div>
    </form>
  );
}