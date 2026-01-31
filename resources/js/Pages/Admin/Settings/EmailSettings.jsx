import React from 'react';
import SettingsLayout from './SettingsLayout';
import { Mail, Server, Key, Send } from 'lucide-react';

export default function EmailSettings() {
    return (
        <SettingsLayout 
            title="Email Settings" 
            subtitle="Configure SMTP servers and automated email communication protocols."
            breadcrumbs={["System", "Email"]}
        >
            <div className="p-8">
                <div className="max-w-3xl space-y-10">
                    {/* Connection Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">Mail Driver</label>
                            <div className="relative">
                                <select className="w-full h-[52px] px-4 bg-white border border-[#e3e4e8] rounded-[8px] text-[15px] appearance-none focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all cursor-pointer">
                                    <option>SMTP (Recommended)</option>
                                    <option>Mailgun</option>
                                    <option>Postmark</option>
                                    <option>Amazon SES</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">Encryption</label>
                            <div className="flex gap-4">
                                <label className="flex-1 cursor-pointer group">
                                    <input type="radio" name="encryption" className="hidden" defaultChecked />
                                    <div className="h-[52px] border border-[#e3e4e8] rounded-[8px] flex items-center justify-center font-bold text-[14px] transition-all group-hover:border-[#673ab7] peer-checked:bg-[#673ab7] peer-checked:text-white">TLS</div>
                                </label>
                                <label className="flex-1 cursor-pointer group">
                                    <input type="radio" name="encryption" className="hidden" />
                                    <div className="h-[52px] border border-[#e3e4e8] rounded-[8px] flex items-center justify-center font-bold text-[14px] transition-all group-hover:border-[#673ab7]">SSL</div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">SMTP Host</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    defaultValue="smtp.mailtrap.io"
                                    className="w-full h-[52px] pl-11 pr-4 bg-white border border-[#e3e4e8] rounded-[8px] text-[15px] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all"
                                />
                                <Server size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a3af]" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">Port</label>
                            <input 
                                type="text" 
                                defaultValue="587"
                                className="w-full h-[52px] px-4 bg-white border border-[#e3e4e8] rounded-[8px] text-[15px] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">Username</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="Enter SMTP username"
                                    className="w-full h-[52px] pl-11 pr-4 bg-white border border-[#e3e4e8] rounded-[8px] text-[15px] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all"
                                />
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a3af]" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">Password</label>
                            <div className="relative">
                                <input 
                                    type="password" 
                                    placeholder="••••••••••••"
                                    className="w-full h-[52px] pl-11 pr-4 bg-white border border-[#e3e4e8] rounded-[8px] text-[15px] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all"
                                />
                                <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a3af]" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-[#f1f2f4]">
                        <div className="flex items-center justify-between p-6 bg-[#f4f0ff]/50 rounded-[12px] border border-[#e9e3ff]">
                            <div>
                                <h4 className="text-[15px] font-bold text-[#2f3344]">Test Configuration</h4>
                                <p className="text-[13px] text-[#727586] mt-1">Send a test email to verify your SMTP settings.</p>
                            </div>
                            <button className="flex items-center bg-white border border-[#673ab7] text-[#673ab7] px-6 py-2.5 rounded-lg font-bold text-[13px] hover:bg-[#673ab7] hover:text-white transition-all shadow-sm">
                                <Send size={16} className="mr-2" />
                                Send Test Mail
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </SettingsLayout>
    );
}
