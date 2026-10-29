import type { Metadata } from 'next';

// The signup page is a client component, so its metadata lives here
export const metadata: Metadata = {
  title: 'Sign up',
  description:
    'Create a Fotosnap account to share photos and stories with your friends.',
};

export default function SignupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
