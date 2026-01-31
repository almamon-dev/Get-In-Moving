import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { Shield, Home, Save, Facebook, Mail, Chrome, Github, ShieldAlert, Key } from 'lucide-react';

export default function SocialAuthentication() {
    const [formData, setFormData] = useState({
        enable_google: true,
        google_client_id: '88339900-xxyyzz.google.com',
        google_client_secret: '*************************',
        enable_facebook: false,
        facebook_app_id: '',
        facebook_app_secret: '',
        enable_github: true,
        github_client_id: 'GH-8822001',
        github_client_secret: '*************************',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleSocial = (field) => setFormData(prev => ({ ...prev, [field]: !prev[field] }));

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Social Auth Saved:', formData);
        alert('Social Authentication methods updated!');
    };

    return (
        <AdminLayout>
            <Head title="Social Authentication" />
            
            <form onSubmit={handleSubmit} className="space-y-6 pb-20">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-[22px] font-bold text-[#2f3344]">Social Authentication</h1>
                        <div className="flex items-center gap-2 text-[13px] text-[#727586] mt-1">
                            <Home size={14} />
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Settings</span>
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Website</span>
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Social Auth</span>
                        </div>
                    </div>
                    <button 
                        type="submit"
                        className="bg-[#673ab7] text-white px-8 py-[10px] rounded-[6px] font-bold text-[14px] hover:bg-[#5e35b1] transition-all shadow-sm flex items-center gap-2"
                    >
                        <Shield size={18} />
                        Update Social Auth
                    </button>
                </div>

                {/* Google Auth */}
                <div className="bg-white rounded-[10px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                    <div className="px-7 py-5 border-b border-[#e3e4e8] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#fef2f2] rounded-lg flex items-center justify-center text-[#ea4335]">
                                <Chrome size={20} />
                            </div>
                            <h2 className="text-[17px] font-bold text-[#2f3344]">Google Authentication</h2>
                        </div>
                        <div 
                            onClick={() => toggleSocial('enable_google')}
                            className={`w-12 h-6 rounded-full relative cursor-pointer group transition-all duration-300 ${formData.enable_google ? 'bg-[#673ab7]' : 'bg-[#e3e4e8]'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${formData.enable_google ? 'right-1' : 'left-1'}`}></div>
                        </div>
                    </div>

                    {formData.enable_google && (
                        <div className="p-8 border-t border-[#f1f2f4] bg-[#fafbfc]/50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[13px] font-bold text-[#2f3344]">Client ID</label>
                                    <div className="relative">
                                        <input 
                                            name="google_client_id"
                                            type="text" 
                                            value={formData.google_client_id}
                                            onChange={handleInputChange}
                                            className="w-full h-[45px] pl-11 pr-4 bg-white border border-[#e3e4e8] rounded-[6px] text-[14px] text-[#2f3344] focus:outline-none focus:border-[#673ab7] transition-all"
                                        />
                                        <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a3af]" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[13px] font-bold text-[#2f3344]">Client Secret</label>
                                    <div className="relative">
                                        <input 
                                            name="google_client_secret"
                                            type="password" 
                                            value={formData.google_client_secret}
                                            onChange={handleInputChange}
                                            className="w-full h-[45px] pl-11 pr-4 bg-white border border-[#e3e4e8] rounded-[6px] text-[14px] text-[#2f3344] focus:outline-none focus:border-[#673ab7] transition-all"
                                        />
                                        <ShieldAlert size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a3af]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Facebook Auth */}
                <div className="bg-white rounded-[10px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                    <div className="px-7 py-5 border-b border-[#e3e4e8] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#f0f2ff] rounded-lg flex items-center justify-center text-[#1877f2]">
                                <Facebook size={20} />
                            </div>
                            <h2 className="text-[17px] font-bold text-[#2f3344]">Facebook Authentication</h2>
                        </div>
                        <div 
                            onClick={() => toggleSocial('enable_facebook')}
                            className={`w-12 h-6 rounded-full relative cursor-pointer group transition-all duration-300 ${formData.enable_facebook ? 'bg-[#673ab7]' : 'bg-[#e3e4e8]'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${formData.enable_facebook ? 'right-1' : 'left-1'}`}></div>
                        </div>
                    </div>
                </div>

                {/* GitHub Auth */}
                <div className="bg-white rounded-[10px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                    <div className="px-7 py-5 border-b border-[#e3e4e8] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#f1f2f4] rounded-lg flex items-center justify-center text-[#24292e]">
                                <Github size={20} />
                            </div>
                            <h2 className="text-[17px] font-bold text-[#2f3344]">GitHub Authentication</h2>
                        </div>
                        <div 
                            onClick={() => toggleSocial('enable_github')}
                            className={`w-12 h-6 rounded-full relative cursor-pointer group transition-all duration-300 ${formData.enable_github ? 'bg-[#673ab7]' : 'bg-[#e3e4e8]'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${formData.enable_github ? 'right-1' : 'left-1'}`}></div>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
