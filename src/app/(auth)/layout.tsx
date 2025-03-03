export const metadata = {
  title: 'Whisperly - Anonymous Messaging',
  description: 'The future of anonymous messaging',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
}
