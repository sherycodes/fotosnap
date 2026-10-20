'use client';

import SignupForm from '@/components/auth/signup-form';
import { Fragment } from 'react';

export default function SignupPage() {
  return (
    <Fragment>
      <h2 className="mt-6 text-3xl font-extrabold text-foreground">
        Create your account
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Already have an account?{' '}
        <a
          href="/login"
          className="font-medium text-primary hover:text-primary/90"
        >
          Sign in here
        </a>
      </p>
      <SignupForm onSubmit={async (data) => console.log(data)} />
    </Fragment>
  );
}
