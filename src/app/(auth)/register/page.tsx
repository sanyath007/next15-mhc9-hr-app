import Image from 'next/image';
import RegisterForm from './Form';

export default function RegisterPage() {

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50'>
            <Image
                className="dark:invert mb-8"
                src="/next.svg"
                alt="Next.js logo"
                width={180}
                height={38}
                priority
            />

            <RegisterForm />
        </div>
    );
}