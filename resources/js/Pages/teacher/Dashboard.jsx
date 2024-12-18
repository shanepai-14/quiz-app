import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { AppView } from '@/sections/overview/view';
import TeacherDashboard from './TeacherDashboard';
export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboardsds</h2>}
        >
            <Head title="Dashboard"/>

            <TeacherDashboard />
        </AuthenticatedLayout>
    );
}
