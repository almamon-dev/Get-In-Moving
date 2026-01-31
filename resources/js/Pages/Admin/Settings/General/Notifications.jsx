import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { Bell, Mail, Smartphone, Monitor, Shield, Info, Home, ChevronDown } from 'lucide-react';

export default function Notifications() {
    // State for all notification toggles
    const [settings, setSettings] = useState({
        security_alerts: true,
        product_updates: false,
        weekly_reports: true,
        new_customer: true,
        new_transaction: false,
    });

    const toggleSetting = (key) => {
        setSettings(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    // Reusable Toggle Switch Component
    const ToggleSwitch = ({ enabled, onToggle }) => (
        <div 
            onClick={onToggle}
            className={`w-12 h-6 rounded-full relative cursor-pointer transition-all duration-300 shrink-0 ${
                enabled ? 'bg-[#673ab7]' : 'bg-[#e3e4e8]'
            }`}
        >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${
                enabled ? 'right-1' : 'left-1'
            }`}></div>
        </div>
    );

    return (
        <AdminLayout>
            <Head title="Notification Settings" />
            
            <div className="space-y-6 pb-20">
                {/* Header & Breadcrumb */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-[22px] font-bold text-[#2f3344]">Notification Settings</h1>
                        <div className="flex items-center gap-2 text-[13px] text-[#727586] mt-1">
                            <Home size={14} />
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Settings</span>
                            <span className="text-[#c3c4ca]">-</span>
                            <span>General</span>
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Notifications</span>
                        </div>
                    </div>
                </div>

                {/* Email Notifications Card */}
                <div className="bg-white rounded-[10px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                    <div className="px-7 py-5 border-b border-[#e3e4e8]">
                        <h2 className="text-[18px] font-bold text-[#2f3344]">Email Notifications</h2>
                    </div>

                    <div className="p-0 divide-y divide-[#f1f2f4]">
                        {/* Security Alerts */}
                        <div className="p-7 flex items-center justify-between hover:bg-[#fafbfc] transition-colors">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-[#f4f0ff] rounded-lg flex items-center justify-center text-[#673ab7] shrink-0">
                                    <Shield size={20} />
                                </div>
                                <div>
                                    <h4 className="text-[15px] font-bold text-[#2f3344]">Security Alerts</h4>
                                    <p className="text-[13px] text-[#727586] mt-1">Receive alerts for new logins, password changes, and sensitive account activity.</p>
                                </div>
                            </div>
                            <ToggleSwitch 
                                enabled={settings.security_alerts} 
                                onToggle={() => toggleSetting('security_alerts')} 
                            />
                        </div>

                        {/* News & Product Updates */}
                        <div className="p-7 flex items-center justify-between hover:bg-[#fafbfc] transition-colors">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 shrink-0">
                                    <Info size={20} />
                                </div>
                                <div>
                                    <h4 className="text-[15px] font-bold text-[#2f3344]">News & Product Updates</h4>
                                    <p className="text-[13px] text-[#727586] mt-1">Stay updated with new features, improvements, and specialized tips.</p>
                                </div>
                            </div>
                            <ToggleSwitch 
                                enabled={settings.product_updates} 
                                onToggle={() => toggleSetting('product_updates')} 
                            />
                        </div>

                        {/* Weekly Reports */}
                        <div className="p-7 flex items-center justify-between hover:bg-[#fafbfc] transition-colors">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 shrink-0">
                                    <Monitor size={20} />
                                </div>
                                <div>
                                    <h4 className="text-[15px] font-bold text-[#2f3344]">Weekly Performance Report</h4>
                                    <p className="text-[13px] text-[#727586] mt-1">A summarized report of your platform's activities and sales performance.</p>
                                </div>
                            </div>
                            <ToggleSwitch 
                                enabled={settings.weekly_reports} 
                                onToggle={() => toggleSetting('weekly_reports')} 
                            />
                        </div>
                    </div>
                </div>

                {/* Push Notifications Card */}
                <div className="bg-white rounded-[10px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                    <div className="px-7 py-5 border-b border-[#e3e4e8]">
                        <h2 className="text-[18px] font-bold text-[#2f3344]">Desktop & Mobile Push</h2>
                    </div>

                    <div className="p-0 divide-y divide-[#f1f2f4]">
                        {/* New Registration */}
                        <div className="p-7 flex items-center justify-between hover:bg-[#fafbfc] transition-colors">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-[#f4f0ff] rounded-lg flex items-center justify-center text-[#673ab7] shrink-0">
                                    <Bell size={20} />
                                </div>
                                <div>
                                    <h4 className="text-[15px] font-bold text-[#2f3344]">New Customer Registration</h4>
                                    <p className="text-[13px] text-[#727586] mt-1">Get an instant push notification when a new user registers on the platform.</p>
                                </div>
                            </div>
                            <ToggleSwitch 
                                enabled={settings.new_customer} 
                                onToggle={() => toggleSetting('new_customer')} 
                            />
                        </div>

                        {/* Order Alerts */}
                        <div className="p-7 flex items-center justify-between hover:bg-[#fafbfc] transition-colors">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-[#00b090]/20 text-[#00b090] shrink-0">
                                    <Smartphone size={18} />
                                </div>
                                <div>
                                    <h4 className="text-[15px] font-bold text-[#2f3344]">New Transaction Alerts</h4>
                                    <p className="text-[13px] text-[#727586] mt-1">Receive a notification every time a payment or order is successfully completed.</p>
                                </div>
                            </div>
                            <ToggleSwitch 
                                enabled={settings.new_transaction} 
                                onToggle={() => toggleSetting('new_transaction')} 
                            />
                        </div>
                    </div>
                </div>

                {/* Notification Delivery Preferences */}
                <div className="bg-white rounded-[10px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                    <div className="px-7 py-5 border-b border-[#e3e4e8]">
                        <h2 className="text-[18px] font-bold text-[#2f3344]">Delivery Preferences</h2>
                    </div>

                    <div className="p-8">
                        <div className="max-w-9xl space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[14px] font-bold text-[#2f3344]">Email Digest Frequency</label>
                                    <div className="relative">
                                        <select className="w-full h-[45px] px-4 bg-white border border-[#e3e4e8] rounded-[6px] text-[14px] text-[#2f3344] focus:outline-none focus:border-[#673ab7] appearance-none cursor-pointer">
                                            <option>Instant Alerts</option>
                                            <option>Daily Summary</option>
                                            <option>Weekly Digest</option>
                                            <option>Monthly Overview</option>
                                        </select>
                                       
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[14px) font-bold text-[#2f3344]">Primary Notification Device</label>
                                    <div className="relative">
                                        <select className="w-full h-[45px] px-4 bg-white border border-[#e3e4e8] rounded-[6px] text-[14px] text-[#2f3344] focus:outline-none focus:border-[#673ab7] appearance-none cursor-pointer">
                                            <option>All Devices</option>
                                            <option>Desktop Browser Only</option>
                                            <option>Mobile App Only</option>
                                        </select>
                                       
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 flex justify-end">
                                <button className="bg-[#673ab7] text-white px-10 py-3 rounded-[6px] font-bold text-[14px] hover:bg-[#5e35b1] transition-all shadow-sm active:scale-[0.98]">
                                    Save Preferences
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
