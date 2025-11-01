'use client';

import { useRouter } from 'next/navigation';
// import { useAuth } from '@/contexts/AuthContext';
import { useSession } from 'next-auth/react';
import { logout } from '@/actions/logout';

export default function DashboardPage() {
    // const { user } = useAuth();
    const router = useRouter();
    const { data: session, status } = useSession();

    console.log(session);

    const handleLogout = async () => {
        await logout();

        // router.push('/login');
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                    >
                        Logout
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h2 className="text-lg font-semibold text-gray-800 mb-3">User Information</h2>
                        <div className="space-y-2">
                            <p><span className="font-medium">Name:</span> {session?.user?.name}</p>
                            <p><span className="font-medium">Username:</span> {session?.user?.username}</p>
                            <p><span className="font-medium">Email:</span> {session?.user?.email}</p>
                            <p><span className="font-medium">Role:</span> 
                                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                    session?.user?.role === 'admin' ? 'bg-red-100 text-red-800' :
                                    session?.user?.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                                    'bg-green-100 text-green-800'
                                }`}>
                                    {session?.user?.role}
                                </span>
                            </p>
                            {session?.user?.departmentId && (
                                <p><span className="font-medium">Department ID:</span> {session?.user?.departmentId}</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                        <h2 className="text-lg font-semibold text-gray-800 mb-3">Quick Actions</h2>
                        <div className="space-y-3">
                            <a 
                                href="/employee/register" 
                                className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Register Employee
                            </a>
                            <a 
                                href="/check-in" 
                                className="block w-full bg-green-600 text-white text-center py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                            >
                                Check In
                            </a>
                            <a 
                                href="/users" 
                                className="block w-full bg-purple-600 text-white text-center py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
                            >
                                View Users
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-6 bg-blue-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Welcome!</h3>
                    <p className="text-blue-700">
                        You are successfully logged in to the Next.js 15 Crash Course authentication system. 
                        This dashboard demonstrates the authentication flow and user management features.
                    </p>
                </div>
            </div>
        </div>
    );
}
