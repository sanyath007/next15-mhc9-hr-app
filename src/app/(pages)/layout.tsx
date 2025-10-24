
// import { ProtectedRoute } from '../contexts/AuthContext';

export default function DefaultLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // <ProtectedRoute>
    <>
      <header className="p-4 border-b border-b-zinc-200">
        <h1 className="text-3xl font-bold">Next 15 Crash Course</h1>
      </header>
      <main className="p-4 min-h-[calc(100vh-8rem)]">
        {children}
      </main>
      <footer className="p-4 border-t border-t-zinc-200 text-center">
        <p className="text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} Next 15 Crash Course
        </p>
      </footer>
    </>
    // </ProtectedRoute>
  );
}
