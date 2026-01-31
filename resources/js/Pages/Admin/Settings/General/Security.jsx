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

                {/* Two-Factor Authentication Card */}
                <div className="bg-white rounded-[10px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                    <div className="px-7 py-5 border-b border-[#e3e4e8]">
                        <h2 className="text-[18px] font-bold text-[#2f3344]">Two-Factor Authentication (2FA)</h2>
                    </div>

                    <div className="p-8">
                        <div className="flex items-start justify-between p-6 bg-[#f4f0ff]/30 rounded-[10px] border border-[#e9e3ff]">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-[#e9e3ff] flex items-center justify-center text-[#673ab7] shrink-0">
                                    <Smartphone size={24} />
                                </div>
                                <div>
                                    <h4 className="text-[16px] font-bold text-[#2f3344]">Authenticator App</h4>
                                    <p className="text-[14px] text-[#727586] mt-1 max-w-lg">
                                        Use an authenticator app (like Google Authenticator or Microsoft Authenticator) to get a verification code each time you sign in.
                                    </p>
                                    <div className="flex items-center gap-2 mt-3 text-[13px] font-bold text-[#00b090]">
                                        <div className="w-2 h-2 rounded-full bg-[#00b090]"></div>
                                        Highly Recommended
                                    </div>
                                </div>
                            </div>
                            <div className="w-12 h-6 bg-[#e3e4e8] rounded-full relative cursor-pointer group shrink-0">
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all group-hover:scale-110"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Browser Sessions Card */}
                <div className="bg-white rounded-[10px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                    <div className="px-7 py-5 border-b border-[#e3e4e8] flex items-center justify-between">
                        <h2 className="text-[18px] font-bold text-[#2f3344]">Active Browser Sessions</h2>
                        <button className="text-[13px] font-bold text-red-500 hover:underline">
                            Logout of all other sessions
                        </button>
                    </div>

                    <div className="divide-y divide-[#f1f2f4]">
                        {/* Session 1 */}
                        <div className="p-7 flex items-center justify-between hover:bg-[#fafbfc] transition-colors">
                            <div className="flex items-center gap-5">
                                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                                    <Monitor size={20} />
                                </div>
                                <div>
                                    <h4 className="text-[14px] font-bold text-[#2f3344]">Chrome on Windows</h4>
                                    <p className="text-[12px] text-[#727586] mt-0.5">Dhaka, Bangladesh • 103.114.172.58 • <span className="text-[#00b090] font-bold">This device</span></p>
                                </div>
                            </div>
                            <div className="text-[12px] font-medium text-[#727586]">Active now</div>
                        </div>

                        {/* Session 2 */}
                        <div className="p-7 flex items-center justify-between hover:bg-[#fafbfc] transition-colors">
                            <div className="flex items-center gap-5">
                                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                                    <Smartphone size={18} />
                                </div>
                                <div>
                                    <h4 className="text-[14px] font-bold text-[#2f3344]">iPhone 15 Pro</h4>
                                    <p className="text-[12px] text-[#727586] mt-0.5">Dhaka, Bangladesh • 103.114.172.58</p>
                                </div>
                            </div>
                            <div className="text-[12px] font-medium text-[#727586]">2 hours ago</div>
                        </div>
                    </div>
                </div>

                {/* Security Log Card */}
                <div className="bg-white rounded-[10px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                    <div className="px-7 py-5 border-b border-[#e3e4e8] flex items-center justify-between">
                        <h2 className="text-[18px] font-bold text-[#2f3344]">Security Activity Log</h2>
                    </div>

                    <div className="p-0 overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-7 py-4 text-left text-[13px] font-bold text-[#727586] uppercase tracking-wider">Event</th>
                                    <th className="px-7 py-4 text-left text-[13px] font-bold text-[#727586] uppercase tracking-wider">Browser/OS</th>
                                    <th className="px-7 py-4 text-left text-[13px] font-bold text-[#727586] uppercase tracking-wider">Date</th>
                                    <th className="px-7 py-4 text-left text-[13px] font-bold text-[#727586] uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f1f2f4]">
                                <tr>
                                    <td className="px-7 py-5 text-[14px] font-bold text-[#2f3344]">Login Attempt</td>
                                    <td className="px-7 py-5 text-[13px] text-[#727586]">Chrome (Windows)</td>
                                    <td className="px-7 py-5 text-[13px] text-[#727586]">Jan 29, 2026 10:45 PM</td>
                                    <td className="px-7 py-5">
                                        <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#00b090]">
                                            <Check size={14} /> Successful
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-7 py-5 text-[14px] font-bold text-[#2f3344]">Password Change</td>
                                    <td className="px-7 py-5 text-[13px] text-[#727586]">Firefox (MacOS)</td>
                                    <td className="px-7 py-5 text-[13px] text-[#727586]">Jan 25, 2026 03:12 PM</td>
                                    <td className="px-7 py-5">
                                        <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#00b090]">
                                            <Check size={14} /> Successful
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-7 py-5 text-[14px] font-bold text-[#2f3344]">Failed Login</td>
                                    <td className="px-7 py-5 text-[13px] text-[#727586]">Chrome (Windows)</td>
                                    <td className="px-7 py-5 text-[13px] text-[#727586]">Jan 24, 2026 11:20 AM</td>
                                    <td className="px-7 py-5">
                                        <div className="flex items-center gap-1.5 text-[12px] font-bold text-red-500">
                                            <AlertCircle size={14} /> Blocked
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
