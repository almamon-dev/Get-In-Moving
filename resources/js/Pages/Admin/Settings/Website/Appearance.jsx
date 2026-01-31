import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { Palette, Home, Save, Moon, Sun, Type, Layout, Image as ImageIcon, Check } from 'lucide-react';

export default function Appearance() {
    const [formData, setFormData] = useState({
        primary_color: '#673ab7',
        accent_color: '#00b090',
        theme_mode: 'light',
        font_family: 'Inter',
        sidebar_style: 'collapsed',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const setTheme = (mode) => setFormData(prev => ({ ...prev, theme_mode: mode }));

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Appearance Saved:', formData);
        alert('Branding and Appearance settings updated!');
    };

    return (
        <AdminLayout>
            <Head title="Appearance Settings" />
            
            <form onSubmit={handleSubmit} className="space-y-6 pb-20">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-[22px] font-bold text-[#2f3344]">Branding & Appearance</h1>
                        <div className="flex items-center gap-2 text-[13px] text-[#727586] mt-1">
                            <Home size={14} />
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Settings</span>
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Website</span>
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Appearance</span>
                        </div>
                    </div>
                    <button 
                        type="submit"
                        className="bg-[#673ab7] text-white px-8 py-[10px] rounded-[6px] font-bold text-[14px] hover:bg-[#5e35b1] transition-all shadow-sm flex items-center gap-2"
                    >
                        <Save size={18} />
                        Save Appearance
                    </button>
                </div>

                {/* Color & Theme */}
                <div className="bg-white rounded-[10px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                    <div className="px-7 py-5 border-b border-[#e3e4e8]">
                        <div className="flex items-center gap-2">
                            <Palette size={20} className="text-[#673ab7]" />
                            <h2 className="text-[17px] font-bold text-[#2f3344]">Theme & Colors</h2>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Theme Mode Selection */}
                            <div className="space-y-4">
                                <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">System Theme</label>
                                <div className="flex gap-4">
                                    <div 
                                        onClick={() => setTheme('light')}
                                        className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center gap-3 ${formData.theme_mode === 'light' ? 'border-[#673ab7] bg-[#f4f0ff]/50' : 'border-[#e3e4e8] hover:border-[#673ab7]/30'}`}
                                    >
                                        <div className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center text-orange-500">
                                            <Sun size={20} />
                                        </div>
                                        <span className={`text-[13px] font-bold ${formData.theme_mode === 'light' ? 'text-[#673ab7]' : 'text-[#727586]'}`}>Light Mode</span>
                                        {formData.theme_mode === 'light' && <div className="w-5 h-5 bg-[#673ab7] rounded-full flex items-center justify-center text-white"><Check size={12} /></div>}
                                    </div>
                                    <div 
                                        onClick={() => setTheme('dark')}
                                        className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center gap-3 ${formData.theme_mode === 'dark' ? 'border-[#673ab7] bg-[#f4f0ff]/50' : 'border-[#e3e4e8] hover:border-[#673ab7]/30'}`}
                                    >
                                        <div className="w-10 h-10 bg-[#1e2235] shadow-sm rounded-full flex items-center justify-center text-blue-400">
                                            <Moon size={20} />
                                        </div>
                                        <span className={`text-[13px] font-bold ${formData.theme_mode === 'dark' ? 'text-[#673ab7]' : 'text-[#727586]'}`}>Dark Mode</span>
                                        {formData.theme_mode === 'dark' && <div className="w-5 h-5 bg-[#673ab7] rounded-full flex items-center justify-center text-white"><Check size={12} /></div>}
                                    </div>
                                </div>
                            </div>

                            {/* Accent Colors */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">Primary Color</label>
                                    <div className="flex items-center gap-3">
                                        <input 
                                            name="primary_color"
                                            type="color" 
                                            value={formData.primary_color}
                                            onChange={handleInputChange}
                                            className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0"
                                        />
                                        <span className="text-[14px] font-mono font-bold text-[#727586]">{formData.primary_color}</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">Accent Color</label>
                                    <div className="flex items-center gap-3">
                                        <input 
                                            name="accent_color"
                                            type="color" 
                                            value={formData.accent_color}
                                            onChange={handleInputChange}
                                            className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0"
                                        />
                                        <span className="text-[14px] font-mono font-bold text-[#727586]">{formData.accent_color}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Typography & Layout */}
                <div className="bg-white rounded-[10px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                    <div className="px-7 py-5 border-b border-[#e3e4e8]">
                        <div className="flex items-center gap-2">
                            <Layout size={20} className="text-[#673ab7]" />
                            <h2 className="text-[17px] font-bold text-[#2f3344]">Typography & Layout</h2>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#2f3344]">Default Font Family</label>
                                <div className="relative">
                                    <select 
                                        name="font_family"
                                        value={formData.font_family}
                                        onChange={handleInputChange}
                                        className="w-full h-[45px] pl-11 pr-4 bg-[#fafbfc] border border-[#e3e4e8] rounded-[6px] text-[14px] text-[#2f3344] focus:outline-none focus:border-[#673ab7] transition-all appearance-none cursor-pointer"
                                    >
                                        <option>Inter (Modern Sans)</option>
                                        <option>Roboto (Clean)</option>
                                        <option>Outfit (Premium)</option>
                                        <option>System Sans</option>
                                    </select>
                                    <Type size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a3af] pointer-events-none" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#2f3344]">Sidebar Navigation</label>
                                <div className="relative">
                                    <select 
                                        name="sidebar_style"
                                        value={formData.sidebar_style}
                                        onChange={handleInputChange}
                                        className="w-full h-[45px] pl-11 pr-4 bg-[#fafbfc] border border-[#e3e4e8] rounded-[6px] text-[14px] text-[#2f3344] focus:outline-none focus:border-[#673ab7] transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="collapsed">Collapsed (Icon Only)</option>
                                        <option value="expanded">Expanded (Full Width)</option>
                                        <option value="minimal">Minimal (Floating)</option>
                                    </select>
                                    <Layout size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a3af] pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
