export default function LoginLayout({ children}: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-2 border border-red-500">
            {children}
        </div>
    );
}