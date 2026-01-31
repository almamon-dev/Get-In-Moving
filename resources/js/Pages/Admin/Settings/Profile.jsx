import React from 'react';
import SettingsLayout from './SettingsLayout';
import { User, Mail, Phone, Camera } from 'lucide-react';

export default function Profile() {
    return (
        <SettingsLayout 
            title="Profile Settings" 
            subtitle="Update your personal information and public profile details."
            breadcrumbs={["General", "Profile"]}
        >
            <div className="p-8">
                <div className="max-w-3xl space-y-10">
                    {/* Avatar Section */}
                    <div className="flex items-center gap-8">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-2xl bg-[#f4f0ff] border-2 border-dashed border-[#673ab7]/30 flex items-center justify-center text-[#673ab7] overflow-hidden">
                                <User size={40} />
                            </div>
                            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#673ab7] text-white rounded-lg flex items-center justify-center shadow-lg border-2 border-white hover:bg-[#5e35b1] transition-all">
                                <Camera size={14} />
                            </button>
                        </div>
                        <div>
                            <h4 className="text-[16px] font-bold text-[#2f3344]">Profile Photo</h4>
                            <p className="text-[13px] text-[#727586] mt-1">PNG, JPG or GIF. Max 2MB.</p>
                            <div className="flex gap-3 mt-3">
                                <button className="text-[13px] font-bold text-[#673ab7] hover:underline">Upload new</button>
                                <button className="text-[13px] font-bold text-red-500 hover:underline">Remove</button>
                            </div>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">Full Name</label>
                            <input 
                                type="text" 
                                defaultValue="Admin User"
                                className="w-full h-[52px] px-4 bg-white border border-[#e3e4e8] rounded-[8px] text-[15px] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all placeholder:text-[#c3c4ca]"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">Email Address</label>
                            <div className="relative">
                                <input 
                                    type="email" 
                                    defaultValue="admin@example.com"
                                    className="w-full h-[52px] pl-11 pr-4 bg-white border border-[#e3e4e8] rounded-[8px] text-[15px] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all"
                                />
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a3af]" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">Phone Number</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="+1 (555) 000-0000"
                                    className="w-full h-[52px] pl-11 pr-4 bg-white border border-[#e3e4e8] rounded-[8px] text-[15px] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all"
                                />
                                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a3af]" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">Designation</label>
                            <input 
                                type="text" 
                                defaultValue="Super Administrator"
                                className="w-full h-[52px] px-4 bg-white border border-[#e3e4e8] rounded-[8px] text-[15px] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">Biography</label>
                        <textarea 
                            rows="4" 
                            placeholder="Write a short bio about yourself..."
                            className="w-full p-4 bg-white border border-[#e3e4e8] rounded-[8px] text-[15px] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all resize-none"
                        ></textarea>
                    </div>

                    <div className="pt-6 border-t border-[#f1f2f4] flex gap-4">
                        <button className="bg-[#673ab7] text-white px-8 py-3 rounded-lg font-bold text-[14px] hover:bg-[#5e35b1] transition-all shadow-md">
                            Save Profile
                        </button>
                        <button className="bg-white border border-[#e3e4e8] text-[#2f3344] px-8 py-3 rounded-lg font-bold text-[14px] hover:bg-slate-50 transition-all">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </SettingsLayout>
    );
}
