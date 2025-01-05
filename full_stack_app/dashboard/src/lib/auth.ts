import { supabase } from './supabase';
import { toast } from 'sonner';
import { logger } from './logger';

export interface AuthError {
  message: string;
  status?: number;
}

export interface SignInCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  name: string;
  acceptTerms: boolean;
}

export async function signIn({ email, password, rememberMe = false }: SignInCredentials) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        shouldCreateUser: false
      }
    });

    if (error) throw error;
    return { user: data.user, session: data.session };
  } catch (error) {
    logger.error('Sign in failed', { error });
    throw error;
  }
}

export async function signUp({ email, password, name, acceptTerms }: SignUpCredentials) {
  if (!acceptTerms) {
    throw new Error('You must accept the terms of service');
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          terms_accepted: true,
          terms_accepted_at: new Date().toISOString()
        }
      }
    });

    if (error) throw error;
    return { user: data.user, session: data.session };
  } catch (error) {
    logger.error('Sign up failed', { error });
    throw error;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    logger.error('Sign out failed', { error });
    throw error;
  }
}

export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    if (error) throw error;
    toast.success('Password reset instructions sent to your email');
  } catch (error) {
    logger.error('Password reset failed', { error });
    throw error;
  }
}

export async function updatePassword(newPassword: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    if (error) throw error;
    toast.success('Password updated successfully');
  } catch (error) {
    logger.error('Password update failed', { error });
    throw error;
  }
}