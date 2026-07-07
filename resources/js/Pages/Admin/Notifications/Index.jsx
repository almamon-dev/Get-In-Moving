import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Bell, CreditCard } from 'lucide-react';

export default function Notifications({ auth }) {
    const notifications = auth?.user?.notifications || [];

    return (
        <AdminLayout user={auth.user}>
            <Head title="All Notifications" />

            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900">All Notifications</h1>
                    <p className="text-slate-500 text-sm mt-1">View all your system notifications here.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    {notifications.length > 0 ? (
                        <div className="divide-y divide-slate-100">
                            {notifications.map((notif) => (
                                <div key={notif.id} className="p-5 hover:bg-slate-50 transition-colors flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                        <Bell size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-[15px] text-slate-900 font-bold">
                                            {notif.data.title || notif.data.message || 'Notification'}
                                        </h3>
                                        <p className="text-[14px] text-slate-600 mt-1">
                                            {notif.data.message}
                                        </p>
                                        <p className="text-[12px] text-slate-400 mt-2 font-medium">
                                            {new Date(notif.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Bell size={24} className="text-slate-300" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">No Notifications Yet</h3>
                            <p className="text-slate-500 mt-1">When you receive notifications, they will show up here.</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
