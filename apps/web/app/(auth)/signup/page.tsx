'use client';

import SignupForm from '@/components/auth/signup-form';
import { authClient } from '@/lib/auth/client';
import type { SignupFormData } from '@/lib/auth/schema';
import { useRouter } from 'next/navigation';
import { Fragment } from 'react';
import { UseFormSetError } from 'react-hook-form';

export default function SignupPage() {
  const router = useRouter();
  const onSubmit = async (
    data: SignupFormData,
    setError: UseFormSetError<SignupFormData>
  ) => {
    const { error } = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
    });
    if (error) {
      setError('email', { message: error.message });
      return;
    }
    router.push('/');
  };
  return (
    <Fragment>
      <div className='text-center'>
        <h2 className='mt-6 text-3xl font-extrabold text-foreground'>
          Create your account
        </h2>
        <p className='mt-2 text-sm text-muted-foreground'>
          Already have an account?{' '}
          <a
            href='/login'
            className='font-medium text-primary hover:text-primary/90'
          >
            Sign in here
          </a>
        </p>
      </div>
      <SignupForm onSubmit={onSubmit} />
    </Fragment>
  );
}
