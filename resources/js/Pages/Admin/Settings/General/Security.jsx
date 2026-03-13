import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { Shield, Key, Smartphone, Monitor, History, Home, ChevronDown, Check, AlertCircle } from 'lucide-react';

export default function Security() {
    return (
        <AdminLayout>
            <Head title="Security Settings" />
            
            <div className="space-y-6 pb-20">
                {/* Header & Breadcrumb */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-[22px] font-bold text-[#2f3344]">Security Settings</h1>
                        <div className="flex items-center gap-2 text-[13px] text-[#727586] mt-1">
                            <Home size={14} />
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Settings</span>
                            <span className="text-[#c3c4ca]">-</span>
                            <span>General</span>
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Security</span>
                        </div>
                    </div>
                </div>

                {/* Password Change Card */}
                <div className="bg-white rounded-[10px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                    <div className="px-7 py-5 border-b border-[#e3e4e8]">
                        <h2 className="text-[18px] font-bold text-[#2f3344]">Change Password</h2>
                    </div>

                    <div className="p-8">
                        <div className="max-w-9xl space-y-6">
                            <div className="space-y-2">
                                <label className="text-[14px] font-bold text-[#2f3344]">Current Password</label>
                                <div className="relative">
                                    <input 
                                        type="password" 
                                        placeholder="Enter current password"
                                        className="w-full h-[45px] pl-11 pr-4 bg-[#f8f9fa] border border-[#e3e4e8] rounded-[6px] text-[14px] text-[#2f3344] focus:outline-none focus:border-[#673ab7] transition-all"
                                    />
                                    <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a3af]" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[14px] font-bold text-[#2f3344]">New Password</label>
                                    <div className="relative">
                                        <input 
                                            type="password" 
                                            placeholder="Enter new password"
                                            className="w-full h-[45px] pl-11 pr-4 bg-white border border-[#e3e4e8] rounded-[6px] text-[14px] text-[#2f3344] focus:outline-none focus:border-[#673ab7] transition-all"
                                        />
                                        <Shield size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a3af]" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[14px] font-bold text-[#2f3344]">Confirm New Password</label>
                                    <div className="relative">
                                        <input 
                                            type="password" 
                                            placeholder="Repeat new password"
                                            className="w-full h-[45px] pl-11 pr-4 bg-white border border-[#e3e4e8] rounded-[6px] text-[14px] text-[#2f3344] focus:outline-none focus:border-[#673ab7] transition-all"
                                        />
                                        <Shield size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a3af]" />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button className="bg-[#673ab7] text-white px-8 py-[10px] rounded-[6px] font-bold text-[14px] hover:bg-[#5e35b1] transition-all shadow-sm">
                                    Update Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

             
            </div>
        </AdminLayout>
    );
}
