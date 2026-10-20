'use client';

import LoginForm from '@/components/auth/login-form';
import { Fragment } from 'react';

export default function LoginPage() {
  return (
    <Fragment>
      <h2 className="mt-6 text-3xl font-extrabold text-foreground">
        Sign in to your account
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <a
          href="/signup"
          className="font-medium text-primary hover:text-primary/90"
        >
          Create one here
        </a>
      </p>
      <LoginForm onSubmit={async (data) => console.log(data)} />
    </Fragment>
  );
}
