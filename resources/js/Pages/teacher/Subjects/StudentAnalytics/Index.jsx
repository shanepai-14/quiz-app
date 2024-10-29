import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StudentQuizPerformance from './StudentQuizPerformance';

const StudentAnalytics = ({ auth }) => {
    // Get params from the current page
    const { params } = usePage().props;
    const { user_id, classroom_id } = params;

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Student Analytics`} />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <StudentQuizPerformance 
                                userId={user_id} 
                                classroomId={classroom_id} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default StudentAnalytics;