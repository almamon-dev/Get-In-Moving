import React from 'react';
import SettingsLayout from './SettingsLayout';
import { Globe, Shield, Zap } from 'lucide-react';

export default function WebsiteSystem() {
    return (
        <SettingsLayout 
            title="System Settings" 
            subtitle="Manage fundamental website configurations and core system parameters."
            breadcrumbs={["Website", "System"]}
        >
            <div className="p-8">
                <div className="max-w-3xl space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">Site Name</label>
                            <input 
                                type="text" 
                                defaultValue="My Premium Dashboard"
                                className="w-full h-[52px] px-4 bg-white border border-[#e3e4e8] rounded-[8px] text-[15px] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">Site URL</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    defaultValue="https://example.com"
                                    className="w-full h-[52px] pl-11 pr-4 bg-white border border-[#e3e4e8] rounded-[8px] text-[15px] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all"
                                />
                                <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a3af]" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">Meta Description</label>
                        <textarea 
                            rows="3" 
                            className="w-full p-4 bg-white border border-[#e3e4e8] rounded-[8px] text-[15px] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all resize-none"
                            defaultValue="Professional administration panel built with Laravel and React."
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                        <div className="flex items-center justify-between p-5 bg-[#fafbfc] rounded-[10px] border border-[#e3e4e8]">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white border border-[#e3e4e8] flex items-center justify-center text-[#673ab7]">
                                    <Shield size={20} />
                                </div>
                                <div>
                                    <p className="text-[14px] font-bold text-[#2f3344]">SSL Force</p>
                                    <p className="text-[12px] text-[#727586]">Redirect all HTTP to HTTPS</p>
                                </div>
                            </div>
                            <div className="w-12 h-6 bg-[#673ab7] rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-5 bg-[#fafbfc] rounded-[10px] border border-[#e3e4e8]">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white border border-[#e3e4e8] flex items-center justify-center text-orange-500">
                                    <Zap size={20} />
                                </div>
                                <div>
                                    <p className="text-[14px] font-bold text-[#2f3344]">Debug Mode</p>
                                    <p className="text-[12px] text-[#727586]">Enable verbose error logging</p>
                                </div>
                            </div>
                            <div className="w-12 h-6 bg-[#e3e4e8] rounded-full relative cursor-pointer">
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-[#f1f2f4]">
                        <h4 className="text-[15px] font-bold text-[#2f3344] mb-4">Site Assets</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 border border-[#e3e4e8] rounded-[10px] flex items-center gap-4">
                                <div className="w-16 h-16 bg-[#f8f9fa] rounded-lg border border-dashed border-[#c3c4ca] flex items-center justify-center text-[#c3c4ca]">
                                    Logo
                                </div>
                                <div>
                                    <p className="text-[14px] font-bold text-[#2f3344]">Website Logo</p>
                                    <button className="text-[12px] text-[#673ab7] font-bold hover:underline">Change Pattern</button>
                                </div>
                            </div>
                            <div className="p-4 border border-[#e3e4e8] rounded-[10px] flex items-center gap-4">
                                <div className="w-16 h-16 bg-[#f8f9fa] rounded-lg border border-dashed border-[#c3c4ca] flex items-center justify-center text-[#c3c4ca]">
                                    Icon
                                </div>
                                <div>
                                    <p className="text-[14px] font-bold text-[#2f3344]">Favicon</p>
                                    <button className="text-[12px] text-[#673ab7] font-bold hover:underline">Change Pattern</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SettingsLayout>
    );
}
