import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { Home, Construction } from 'lucide-react';

export default function Placeholder({ title }) {
    return (
        <AdminLayout>
            <Head title={title || "Settings"} />
            
            <div className="space-y-6 pb-20">
                {/* Header & Breadcrumb */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-[22px] font-bold text-[#2f3344]">{title || "Settings Page"}</h1>
                        <div className="flex items-center gap-2 text-[13px] text-[#727586] mt-1">
                            <Home size={14} />
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Settings</span>
                            <span className="text-[#c3c4ca]">-</span>
                            <span>{title || "Config"}</span>
                        </div>
                    </div>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-[10px] border border-[#e3e4e8] shadow-sm overflow-hidden min-h-[400px] flex flex-col items-center justify-center text-center p-10">
                    <div className="w-20 h-20 bg-[#f4f0ff] rounded-full flex items-center justify-center mb-6">
                        <Construction size={40} className="text-[#673ab7]" />
                    </div>
                    <h2 className="text-[20px] font-bold text-[#2f3344] mb-2">Under Construction</h2>
                    <p className="text-[14px] text-[#727586] max-w-md">
                        The <strong>{title}</strong> page is currently being designed and developed. It will follow our new premium management interface standards.
                    </p>
                    <button className="mt-8 bg-[#673ab7] text-white px-8 py-3 rounded-[6px] font-bold text-[14px] hover:bg-[#5e35b1] transition-all">
                        Go Back
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
}
