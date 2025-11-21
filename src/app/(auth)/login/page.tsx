import LoginForm from './Form';
import { Suspense } from 'react';

export default function LoginPage() {
    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50 w-full'>
            <div className='w-full max-w-md bg-white rounded-lg shadow-md p-8'>
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-900">Sign In</h1>

                <Suspense fallback={<div>Loading login form...</div>}>
                    <LoginForm />
                </Suspense>

                <div className="mt-6 text-center">
                    <div className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <a 
                            href="/register" 
                            className="text-blue-600 hover:text-blue-500 font-medium"
                        >
                            Sign up here
                        </a>
                    </div>

                    <div className="mt-2">
                        <a 
                            href="/auth/forgot-password" 
                            className="text-sm text-blue-600 hover:text-blue-500"
                        >
                            Forgot your password?
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}