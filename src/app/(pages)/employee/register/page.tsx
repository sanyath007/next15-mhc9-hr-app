import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import EmployeeRegistrationForm from './Form';

export default async function EmployeeRegistration() {
    const sesstion = await auth();

    // if (!sesstion) redirect("/signin");

    return <EmployeeRegistrationForm />;
}