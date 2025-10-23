import Image from 'next/image';

export default function LoginPage() {
    return (
        <div className='flex flex-col items-center justify-center'>
            <Image
                className="dark:invert"
                src="/next.svg"
                alt="Next.js logo"
                width={180}
                height={38}
                priority
            />


            <div className='flex flex-col items-center justify-center border rounded-2xl p-8 mt-4'>
                <h1 className="mb-4 text-2xl font-bold">Login Page</h1>

                <form>
                    <div className='mb-4'>
                        <label htmlFor="username">Username:</label>
                        <input type="text" id="username" name="username" required />
                    </div>
                    <div className='mb-4'>
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" name="password" required />
                    </div>

                    <button type="submit" className='bg-white px-4 py-2 rounded-md text-black font-semibold hover:bg-gray-200'>
                        Login
                    </button>

                    <hr className='my-4' />

                    <div>
                        Don't have an account? <a href="/register" className='text-blue-500 hover:underline'>Register here</a>
                    </div>
                </form>
            </div>
        </div>
    );
}