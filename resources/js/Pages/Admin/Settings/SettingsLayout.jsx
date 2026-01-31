import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { 
    Home, Settings, ChevronDown, Save, RotateCcw
} from 'lucide-react';

export default function SettingsLayout({ title, subtitle, children, breadcrumbs = [] }) {
    const [showPromo, setShowPromo] = useState(true);

    return (
        <AdminLayout>
            <Head title={title} />

            <div className="space-y-6 max-w-[1240px] mx-auto pb-20 px-4 sm:px-6">
                {/* Header */}
                <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-4">
                        <h1 className="text-[24px] font-bold text-[#2f3344] tracking-tight">
                            {title}
                        </h1>
                        <div className="flex items-center gap-2 text-[13px] text-[#727586] mt-1">
                            <Home size={16} className="text-[#727586]" />
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Settings</span>
                            {breadcrumbs.map((crumb, index) => (
                                <React.Fragment key={index}>
                                    <span className="text-[#c3c4ca]">-</span>
                                    <span className={index === breadcrumbs.length - 1 ? "text-[#673ab7] font-medium" : ""}>
                                        {crumb}
                                    </span>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Info Banner */}
                {showPromo && (
                    <div className="relative bg-[#f4f0ff] rounded-[12px] p-6 border border-[#e9e3ff] overflow-hidden flex items-center justify-between">
                        <div className="flex-1">
                            <h2 className="text-[18px] font-bold text-[#2f3344] mb-1">
                                {title}
                            </h2>
                            <p className="text-[14px] text-[#727586]">
                                {subtitle || "Configure your preferences and system settings below."}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-[100px] h-[60px] relative hidden md:block">
                                <div className="absolute right-0 top-0 text-[#673ab7] opacity-10 transform rotate-12">
                                    <Settings size={40} />
                                </div>
                            </div>
                            <button 
                                onClick={() => setShowPromo(false)}
                                className="w-8 h-8 flex items-center justify-center bg-white rounded-lg border border-[#e3e4e8] text-[#727586] hover:bg-slate-50 transition-all"
                            >
                                <ChevronDown size={18} />
                            </button>
                        </div>
                        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#673ab7]/5 to-transparent pointer-events-none"></div>
                    </div>
                )}

                {/* Main Content */}
                <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                    {children}
                </div>
            </div>
        </AdminLayout>
    );
}
