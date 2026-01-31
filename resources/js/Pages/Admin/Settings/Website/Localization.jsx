import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { Globe2, Clock, Calendar, Coins, Home, Save, ChevronDown, Languages, Hash, Percent } from 'lucide-react';

export default function Localization() {
    const [formData, setFormData] = useState({
        timezone: '(UTC+06:00) Astana, Dhaka',
        default_language: 'English (US)',
        date_format: 'DD/MM/YYYY',
        time_format: '12-hour (AM/PM)',
        currency: 'USD ($)',
        currency_position: 'Left',
        thousand_separator: ',',
        decimal_separator: '.',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Localization Data Saved:', formData);
        alert('Localization settings updated successfully!');
    };

    return (
        <AdminLayout>
            <Head title="Localization Settings" />
            
            <form onSubmit={handleSubmit} className="space-y-6 pb-20">
                {/* Header & Breadcrumb */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-[22px] font-bold text-[#2f3344]">Localization Settings</h1>
                        <div className="flex items-center gap-2 text-[13px] text-[#727586] mt-1">
                            <Home size={14} />
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Settings</span>
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Website</span>
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Localization</span>
                        </div>
                    </div>
                    <button 
                        type="submit"
                        className="bg-[#673ab7] text-white px-8 py-[10px] rounded-[6px] font-bold text-[14px] hover:bg-[#5e35b1] transition-all shadow-sm flex items-center gap-2"
                    >
                        <Save size={18} />
                        Save Regional Settings
                    </button>
                </div>

                {/* Regional Settings */}
                <div className="bg-white rounded-[10px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                    <div className="px-7 py-5 border-b border-[#e3e4e8]">
                        <div className="flex items-center gap-2">
                            <Globe2 size={20} className="text-[#673ab7]" />
                            <h2 className="text-[17px] font-bold text-[#2f3344]">Regional & Language</h2>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#2f3344]">Default Language</label>
                                <div className="relative">
                                    <select 
                                        name="default_language"
                                        value={formData.default_language}
                                        onChange={handleInputChange}
                                        className="w-full h-[45px] pl-11 pr-10 bg-[#fafbfc] border border-[#e3e4e8] rounded-[6px] text-[14px] text-[#2f3344] focus:outline-none focus:border-[#673ab7] transition-all appearance-none cursor-pointer"
                                    >
                                        <option>English (US)</option>
                                        <option>Bengali (বাংলা)</option>
                                        <option>Spanish (Español)</option>
                                        <option>French (Français)</option>
                                    </select>
                                    <Languages size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a3af] pointer-events-none" />
                                    
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#2f3344]">System Timezone</label>
                                <div className="relative">
                                    <select 
                                        name="timezone"
                                        value={formData.timezone}
                                        onChange={handleInputChange}
                                        className="w-full h-[45px] pl-11 pr-10 bg-[#fafbfc] border border-[#e3e4e8] rounded-[6px] text-[14px] text-[#2f3344] focus:outline-none focus:border-[#673ab7] transition-all appearance-none cursor-pointer"
                                    >
                                        <option>(UTC+06:00) Astana, Dhaka</option>
                                        <option>(UTC+00:00) London, UTC</option>
                                        <option>(UTC-05:00) Eastern Time (US & Canada)</option>
                                        <option>(UTC+09:00) Tokyo, Seoul</option>
                                    </select>
                                    <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a3af] pointer-events-none" />
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Date & Time Formatting */}
                <div className="bg-white rounded-[10px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                    <div className="px-7 py-5 border-b border-[#e3e4e8]">
                        <div className="flex items-center gap-2">
                            <Calendar size={20} className="text-[#673ab7]" />
                            <h2 className="text-[17px] font-bold text-[#2f3344]">Date & Time Formatting</h2>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#2f3344]">System Date Format</label>
                                <div className="relative">
                                    <select 
                                        name="date_format"
                                        value={formData.date_format}
                                        onChange={handleInputChange}
                                        className="w-full h-[45px] px-4 bg-[#fafbfc] border border-[#e3e4e8] rounded-[6px] text-[14px] text-[#2f3344] focus:outline-none focus:border-[#673ab7] transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="DD/MM/YYYY">DD/MM/YYYY (31/01/2026)</option>
                                        <option value="MM/DD/YYYY">MM/DD/YYYY (01/31/2026)</option>
                                        <option value="YYYY-MM-DD">YYYY-MM-DD (2026-01-31)</option>
                                        <option value="MMMM D, YYYY">MMMM D, YYYY (Jan 31, 2026)</option>
                                    </select>
                                    
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#2f3344]">System Time Format</label>
                                <div className="relative">
                                    <select 
                                        name="time_format"
                                        value={formData.time_format}
                                        onChange={handleInputChange}
                                        className="w-full h-[45px] px-4 bg-[#fafbfc] border border-[#e3e4e8] rounded-[6px] text-[14px] text-[#2f3344] focus:outline-none focus:border-[#673ab7] transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="12-hour">12-hour (09:00 PM)</option>
                                        <option value="24-hour">24-hour (21:00)</option>
                                    </select>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Currency & Financials */}
                <div className="bg-white rounded-[10px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                    <div className="px-7 py-5 border-b border-[#e3e4e8]">
                        <div className="flex items-center gap-2">
                            <Coins size={20} className="text-[#673ab7]" />
                            <h2 className="text-[17px] font-bold text-[#2f3344]">Currency & Financials</h2>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
                            <div className="space-y-2 lg:col-span-2">
                                <label className="text-[13px] font-bold text-[#2f3344]">Default Currency</label>
                                <div className="relative">
                                    <select 
                                        name="currency"
                                        value={formData.currency}
                                        onChange={handleInputChange}
                                        className="w-full h-[45px] px-4 bg-[#fafbfc] border border-[#e3e4e8] rounded-[6px] text-[14px] text-[#2f3344] focus:outline-none focus:border-[#673ab7] transition-all appearance-none cursor-pointer"
                                    >
                                        <option>USD ($)</option>
                                        <option>BDT (৳)</option>
                                        <option>EUR (€)</option>
                                        <option>GBP (£)</option>
                                        <option>INR (₹)</option>
                                    </select>
                                    
                                </div>
                            </div>
                            <div className="space-y-2 lg:col-span-2">
                                <label className="text-[13px] font-bold text-[#2f3344]">Currency Symbol Position</label>
                                <div className="relative">
                                    <select 
                                        name="currency_position"
                                        value={formData.currency_position}
                                        onChange={handleInputChange}
                                        className="w-full h-[45px] px-4 bg-[#fafbfc] border border-[#e3e4e8] rounded-[6px] text-[14px] text-[#2f3344] focus:outline-none focus:border-[#673ab7] transition-all appearance-none cursor-pointer"
                                    >
                                        <option>Left ($100)</option>
                                        <option>Right (100$)</option>
                                        <option>Left with Space ($ 100)</option>
                                        <option>Right with Space (100 $)</option>
                                    </select>
                                    
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#2f3344]">Thousand Separator</label>
                                <div className="relative">
                                    <input 
                                        name="thousand_separator"
                                        type="text" 
                                        value={formData.thousand_separator}
                                        onChange={handleInputChange}
                                        className="w-full h-[45px] pl-11 pr-4 bg-[#fafbfc] border border-[#e3e4e8] rounded-[6px] text-[14px] text-[#2f3344] focus:outline-none focus:border-[#673ab7] transition-all"
                                    />
                                    <Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a3af]" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#2f3344]">Decimal Separator</label>
                                <div className="relative">
                                    <input 
                                        name="decimal_separator"
                                        type="text" 
                                        value={formData.decimal_separator}
                                        onChange={handleInputChange}
                                        className="w-full h-[45px] pl-11 pr-4 bg-[#fafbfc] border border-[#e3e4e8] rounded-[6px] text-[14px] text-[#2f3344] focus:outline-none focus:border-[#673ab7] transition-all"
                                    />
                                    <Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a3af]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
