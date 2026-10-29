import type { Metadata } from 'next';

// The login page is a client component, so its metadata lives here
export const metadata: Metadata = {
  title: 'Login',
  description: 'Log in to Fotosnap to see photos and stories from your friends.',
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
