import AuthProvider from '@/context/AuthProvider';

export const metadata = {
  title: 'Whisplery',
  description: 'Anonymous messaging app',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
