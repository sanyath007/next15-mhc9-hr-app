
// import { ProtectedRoute } from '../contexts/AuthContext';

import Navbar from "@/components/ui/navabar";

export default function DefaultLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        // <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                <header className="p-0">
                    <Navbar />
                </header>
                <main className="p-4 min-h-[calc(100vh-8rem)]">
                    {children}
                </main>
                <footer className="p-4 border-t border-t-zinc-200 text-center">
                    <p className="text-sm text-zinc-500">
                        &copy; {new Date().getFullYear()} Next 15 Crash Course
                    </p>
                </footer>
            </div>
        // </ProtectedRoute>
    );
}
