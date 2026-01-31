import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { Settings2, Home, Save, CheckCircle2, Sliders, Bell, ShieldCheck, Mail } from 'lucide-react';

export default function Preference() {
    const [formData, setFormData] = useState({
        enable_registration: true,
        enable_email_verification: false,
        enable_notifications: true,
        maintenance_mode: false,
        allow_guest_checkout: true,
        show_stock_count: true,
    });

    const toggleSwitch = (field) => {
        setFormData(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Preferences Saved:', formData);
        alert('System preferences updated successfully!');
    };

    return (
        <AdminLayout>
            <Head title="System Preferences" />
            
            <form onSubmit={handleSubmit} className="space-y-6 pb-20">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-[22px] font-bold text-[#2f3344]">System Preference</h1>
                        <div className="flex items-center gap-2 text-[13px] text-[#727586] mt-1">
                            <Home size={14} />
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Settings</span>
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Website</span>
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Preference</span>
                        </div>
                    </div>
                    <button 
                        type="submit"
                        className="bg-[#673ab7] text-white px-8 py-[10px] rounded-[6px] font-bold text-[14px] hover:bg-[#5e35b1] transition-all shadow-sm flex items-center gap-2"
                    >
                        <Save size={18} />
                        Update Preference
                    </button>
                </div>

                {/* Preference Options */}
                <div className="bg-white rounded-[10px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                    <div className="px-7 py-5 border-b border-[#e3e4e8]">
                        <div className="flex items-center gap-2">
                            <Sliders size={20} className="text-[#673ab7]" />
                            <h2 className="text-[17px] font-bold text-[#2f3344]">General Preferences</h2>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Option 1 */}
                            <div className="flex items-center justify-between p-5 bg-[#fafbfc] rounded-[10px] border border-[#e3e4e8]">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-lg border border-[#e3e4e8] flex items-center justify-center text-[#673ab7]">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-[15px] font-bold text-[#2f3344]">User Registration</h4>
                                        <p className="text-[12px] text-[#727586] mt-0.5">Allow new users to create accounts.</p>
                                    </div>
                                </div>
                                <div 
                                    onClick={() => toggleSwitch('enable_registration')}
                                    className={`w-12 h-6 rounded-full relative cursor-pointer group transition-all duration-300 ${formData.enable_registration ? 'bg-[#673ab7]' : 'bg-[#e3e4e8]'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${formData.enable_registration ? 'right-1' : 'left-1'}`}></div>
                                </div>
                            </div>

                            {/* Option 2 */}
                            <div className="flex items-center justify-between p-5 bg-[#fafbfc] rounded-[10px] border border-[#e3e4e8]">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-lg border border-[#e3e4e8] flex items-center justify-center text-[#673ab7]">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-[15px] font-bold text-[#2f3344]">Email Verification</h4>
                                        <p className="text-[12px] text-[#727586] mt-0.5">Require email verify after signup.</p>
                                    </div>
                                </div>
                                <div 
                                    onClick={() => toggleSwitch('enable_email_verification')}
                                    className={`w-12 h-6 rounded-full relative cursor-pointer group transition-all duration-300 ${formData.enable_email_verification ? 'bg-[#673ab7]' : 'bg-[#e3e4e8]'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${formData.enable_email_verification ? 'right-1' : 'left-1'}`}></div>
                                </div>
                            </div>

                            {/* Option 3 */}
                            <div className="flex items-center justify-between p-5 bg-[#fafbfc] rounded-[10px] border border-[#e3e4e8]">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-lg border border-[#e3e4e8] flex items-center justify-center text-[#673ab7]">
                                        <Bell size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-[15px] font-bold text-[#2f3344]">System Notifications</h4>
                                        <p className="text-[12px] text-[#727586] mt-0.5">Enable app & push notifications.</p>
                                    </div>
                                </div>
                                <div 
                                    onClick={() => toggleSwitch('enable_notifications')}
                                    className={`w-12 h-6 rounded-full relative cursor-pointer group transition-all duration-300 ${formData.enable_notifications ? 'bg-[#673ab7]' : 'bg-[#e3e4e8]'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${formData.enable_notifications ? 'right-1' : 'left-1'}`}></div>
                                </div>
                            </div>

                            {/* Option 4 */}
                            <div className="flex items-center justify-between p-5 bg-[#fafbfc] rounded-[10px] border border-[#e3e4e8]">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-lg border border-[#e3e4e8] flex items-center justify-center text-[#673ab7]">
                                        <Settings2 size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-[15px] font-bold text-[#2f3344]">Maintenance Mode</h4>
                                        <p className="text-[12px] text-[#727586] mt-0.5">Take website offline for maintenance.</p>
                                    </div>
                                </div>
                                <div 
                                    onClick={() => toggleSwitch('maintenance_mode')}
                                    className={`w-12 h-6 rounded-full relative cursor-pointer group transition-all duration-300 ${formData.maintenance_mode ? 'bg-[#673ab7]' : 'bg-[#e3e4e8]'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${formData.maintenance_mode ? 'right-1' : 'left-1'}`}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
