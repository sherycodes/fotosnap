'use client';

import LoginForm from '@/components/auth/login-form';
import { authClient } from '@/lib/auth/client';
import { LoginFormData } from '@/lib/auth/schema';
import { Fragment } from 'react';
import { UseFormSetError } from 'react-hook-form';

export default function LoginPage() {
  const onSubmit = async (
    data: LoginFormData,
    setError: UseFormSetError<LoginFormData>
  ) => {
    const { error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
      callbackURL: '/',
    });
    if (error) {
      setError('email', { message: error.message });
    }
  };
  return (
    <Fragment>
      <div className='text-center'>
        <h2 className='mt-6 text-3xl font-extrabold text-foreground'>
          Sign in to your account
        </h2>
        <p className='mt-2 text-sm text-muted-foreground'>
          Don&apos;t have an account?{' '}
          <a
            href='/signup'
            className='font-medium text-primary hover:text-primary/90'
          >
            Create one here
          </a>
        </p>
      </div>
      <LoginForm onSubmit={onSubmit} />
    </Fragment>
  );
}
