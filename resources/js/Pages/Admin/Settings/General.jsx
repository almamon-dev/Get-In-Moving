import React from 'react';
import SettingsLayout from './SettingsLayout';
import { Globe, Mail, Phone, MapPin, Hash, Palette, Info } from 'lucide-react';

export default function General() {
    return (
        <SettingsLayout 
            title="General Settings" 
            subtitle="Configure the primary identity and global metadata for your platform."
            breadcrumbs={["General", "Overview"]}
        >
            <div className="p-8">
                <div className="max-w-4xl space-y-12">
                    {/* Platform Identity Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-[#f1f2f4]">
                            <Globe size={18} className="text-[#673ab7]" />
                            <h3 className="text-[16px] font-bold text-[#2f3344]">Platform Identity</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">Application Name</label>
                                <input 
                                    type="text" 
                                    defaultValue="Premium Dashboard Pro"
                                    className="w-full h-[52px] px-4 bg-[#f8f9fa] border border-[#e3e4e8] rounded-[8px] text-[15px] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">Tagline / Slogan</label>
                                <input 
                                    type="text" 
                                    placeholder="The ultimate management solution"
                                    className="w-full h-[52px] px-4 bg-white border border-[#e3e4e8] rounded-[8px] text-[15px] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">Platform Brand Category</label>
                                <select className="w-full h-[52px] px-4 bg-white border border-[#e3e4e8] rounded-[8px] text-[15px] focus:outline-none focus:border-[#673ab7] transition-all appearance-none cursor-pointer">
                                    <option>Software / SaaS</option>
                                    <option>E-commerce</option>
                                    <option>Corporate</option>
                                    <option>LMS / Education</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">Copyright Year</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        defaultValue="2026"
                                        className="w-full h-[52px] pl-11 pr-4 bg-white border border-[#e3e4e8] rounded-[8px] text-[15px] focus:outline-none focus:border-[#673ab7] transition-all"
                                    />
                                    <Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a3af]" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact & Support Information */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-[#f1f2f4]">
                            <Info size={18} className="text-[#673ab7]" />
                            <h3 className="text-[16px] font-bold text-[#2f3344]">Support & Contact Info</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">Official Email</label>
                                <div className="relative">
                                    <input 
                                        type="email" 
                                        defaultValue="support@platform.com"
                                        className="w-full h-[52px] pl-11 pr-4 bg-white border border-[#e3e4e8] rounded-[8px] text-[15px] focus:outline-none focus:border-[#673ab7] transition-all"
                                    />
                                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a3af]" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">Phone Support</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        defaultValue="+880 1700 000 000"
                                        className="w-full h-[52px] pl-11 pr-4 bg-white border border-[#e3e4e8] rounded-[8px] text-[15px] focus:outline-none focus:border-[#673ab7] transition-all"
                                    />
                                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a3af]" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">Office Address</label>
                            <div className="relative">
                                <textarea 
                                    rows="2"
                                    className="w-full pl-11 pr-4 py-4 bg-white border border-[#e3e4e8] rounded-[8px] text-[15px] focus:outline-none focus:border-[#673ab7] transition-all resize-none"
                                    defaultValue="123 Digital Square, Tech District, Dhaka, Bangladesh"
                                ></textarea>
                                <MapPin size={18} className="absolute left-4 top-4 text-[#a0a3af]" />
                            </div>
                        </div>
                    </div>

                    {/* Regional & Theme Preferences */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-[#f1f2f4]">
                            <Palette size={18} className="text-[#673ab7]" />
                            <h3 className="text-[16px] font-bold text-[#2f3344]">Regional & Appearance</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">Default Language</label>
                                <select className="w-full h-[52px] px-4 bg-white border border-[#e3e4e8] rounded-[8px] text-[15px] focus:outline-none focus:border-[#673ab7] transition-all">
                                    <option>English (United States)</option>
                                    <option>Bengali (Bangladesh)</option>
                                    <option>Spanish (ES)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">Global Timezone</label>
                                <select className="w-full h-[52px] px-4 bg-white border border-[#e3e4e8] rounded-[8px] text-[15px] focus:outline-none focus:border-[#673ab7] transition-all">
                                    <option>(GMT +06:00) Dhaka</option>
                                    <option>(GMT +00:00) London</option>
                                    <option>(GMT -05:00) New York</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Copyright & Footer */}
                    <div className="pt-4 space-y-4">
                        <div className="flex items-center justify-between p-6 bg-[#fafbfc] rounded-[15px] border border-[#e3e4e8]">
                            <div>
                                <h4 className="text-[15px] font-bold text-[#2f3344]">Maintenance Mode</h4>
                                <p className="text-[13px] text-[#727586] mt-1">Take the site offline for public visitors during updates.</p>
                            </div>
                            <div className="w-12 h-6 bg-[#e3e4e8] rounded-full relative cursor-pointer group">
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all group-hover:scale-110"></div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-[#f1f2f4] flex justify-end gap-4">
                        <button className="bg-[#673ab7] text-white px-10 py-[14px] rounded-[8px] font-bold text-[14px] hover:bg-[#5e35b1] transition-all shadow-lg active:scale-[0.98]">
                            Save All Settings
                        </button>
                    </div>
                </div>
            </div>
        </SettingsLayout>
    );
}
