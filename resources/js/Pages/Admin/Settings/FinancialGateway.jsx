import React from 'react';
import SettingsLayout from './SettingsLayout';
import { CreditCard, ShieldCheck, DollarSign, ExternalLink } from 'lucide-react';

export default function FinancialGateway() {
    return (
        <SettingsLayout 
            title="Payment Gateways" 
            subtitle="Connect and manage your payment processors for automated transactions."
            breadcrumbs={["Financial", "Gateway"]}
        >
            <div className="p-8">
                <div className="max-w-3xl space-y-12">
                    {/* Active Gateway Toggle */}
                    <div className="flex items-center justify-between p-6 bg-[#f8f9fa] rounded-[15px] border border-[#e3e4e8]">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-white rounded-xl border border-[#e3e4e8] shadow-sm flex items-center justify-center text-[#673ab7]">
                                <CreditCard size={28} />
                            </div>
                            <div>
                                <h4 className="text-[18px] font-bold text-[#2f3344]">Stripe Integration</h4>
                                <p className="text-[13px] text-[#727586] mt-1">Accept credit cards and local payment methods globally.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-[12px] font-bold text-green-500 bg-green-50 px-3 py-1 rounded-full uppercase tracking-wider">Live</span>
                            <div className="w-12 h-6 bg-[#673ab7] rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="flex items-center gap-2 pb-2 border-b border-[#f1f2f4]">
                            <ShieldCheck size={20} className="text-[#673ab7]" />
                            <h3 className="text-[16px] font-bold text-[#2f3344]">API Credentials</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">Stripe Public Key</label>
                                <input 
                                    type="text" 
                                    placeholder="pk_live_..."
                                    className="w-full h-[52px] px-4 bg-white border border-[#e3e4e8] rounded-[8px] text-[14px] font-mono focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">Stripe Secret Key</label>
                                <input 
                                    type="password" 
                                    defaultValue="sk_live_••••••••••••••••••••"
                                    className="w-full h-[52px] px-4 bg-white border border-[#e3e4e8] rounded-[8px] text-[14px] font-mono focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">Webhook Secret</label>
                                <input 
                                    type="text" 
                                    placeholder="whsec_..."
                                    className="w-full h-[52px] px-4 bg-white border border-[#e3e4e8] rounded-[8px] text-[14px] font-mono focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                        <div className="space-y-2">
                            <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">Currency Mode</label>
                            <div className="relative">
                                <select className="w-full h-[52px] pl-11 pr-4 bg-white border border-[#e3e4e8] rounded-[8px] text-[15px] appearance-none focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all cursor-pointer">
                                    <option>USD - United States Dollar</option>
                                    <option>EUR - Euro</option>
                                    <option>GBP - British Pound</option>
                                    <option>BDT - Bangladeshi Taka</option>
                                </select>
                                <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a3af]" />
                            </div>
                        </div>
                        <div className="space-y-2 flex flex-col justify-end">
                            <button className="h-[52px] w-full border border-[#673ab7] text-[#673ab7] font-bold text-[14px] rounded-[8px] flex items-center justify-center gap-2 hover:bg-[#673ab7] hover:text-white transition-all">
                                <ExternalLink size={18} />
                                Visit Stripe Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </SettingsLayout>
    );
}
