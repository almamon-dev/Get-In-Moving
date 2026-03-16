import React, { useState } from 'react';
import SettingsLayout from '../SettingsLayout';
import { CreditCard, ShieldCheck, Save, Loader2, Eye, EyeOff, Copy, Check, Clock } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import { toast } from 'react-toastify';

export default function FinancialGateway({ settings }) {
    const [showSecret, setShowSecret] = useState(false);
    const [showWebhook, setShowWebhook] = useState(false);
    const [copiedField, setCopiedField] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        stripe_mode: settings.stripe_mode || 'test',
        stripe_key: settings.stripe_key || '',
        stripe_secret: settings.stripe_secret || '',
        stripe_webhook_secret: settings.stripe_webhook_secret || '',
        fund_hold_minutes: settings.fund_hold_minutes || 5,
    });

    const handleCopy = (text, field) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        toast.success(`${field.replace('_', ' ')} copied to clipboard!`);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.settings.update'), {
            onSuccess: () => toast.success('Settings updated successfully!'),
            onError: () => toast.error('Failed to update settings. Please check errors.'),
            preserveScroll: true,
        });
    };

    const toggleMode = () => {
        setData('stripe_mode', data.stripe_mode === 'live' ? 'test' : 'live');
    };

    return (
        <SettingsLayout 
            title="Payment Gateways" 
            subtitle="Connect and manage your payment processors for automated transactions."
            breadcrumbs={["Financial", "Gateway"]}
        >
            <div className="p-8">
                <form onSubmit={handleSubmit} className="max-w-7xl space-y-12">
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
                            <span className={`text-[12px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                                data.stripe_mode === 'live' ? 'text-green-500 bg-green-50' : 'text-orange-500 bg-orange-50'
                            }`}>
                                {data.stripe_mode === 'live' ? 'Live' : 'Sandbox (Test)'}
                            </span>
                            <div 
                                onClick={toggleMode}
                                className={`w-12 h-6 rounded-full relative cursor-pointer transition-all duration-300 ${
                                    data.stripe_mode === 'live' ? 'bg-[#673ab7]' : 'bg-[#a0a3af]'
                                }`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${
                                    data.stripe_mode === 'live' ? 'right-1' : 'left-1'
                                }`}></div>
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
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={data.stripe_key}
                                        onChange={e => setData('stripe_key', e.target.value)}
                                        placeholder="pk_live_..."
                                        className={`w-full h-[52px] pl-4 pr-12 bg-white border ${errors.stripe_key ? 'border-red-500' : 'border-[#e3e4e8]'} rounded-[8px] text-[14px] font-mono focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all`}
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => handleCopy(data.stripe_key, 'key')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a0a3af] hover:text-[#673ab7] transition-colors"
                                    >
                                        {copiedField === 'key' ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                                    </button>
                                </div>
                                {errors.stripe_key && <p className="text-red-500 text-xs mt-1">{errors.stripe_key}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">Stripe Secret Key</label>
                                <div className="relative">
                                    <input 
                                        type={showSecret ? "text" : "password"} 
                                        value={data.stripe_secret}
                                        onChange={e => setData('stripe_secret', e.target.value)}
                                        placeholder="sk_live_..."
                                        className={`w-full h-[52px] pl-4 pr-24 bg-white border ${errors.stripe_secret ? 'border-red-500' : 'border-[#e3e4e8]'} rounded-[8px] text-[14px] font-mono focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all`}
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                                        <button 
                                            type="button"
                                            onClick={() => handleCopy(data.stripe_secret, 'secret')}
                                            className="text-[#a0a3af] hover:text-[#673ab7] transition-colors"
                                        >
                                            {copiedField === 'secret' ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => setShowSecret(!showSecret)}
                                            className="text-[#a0a3af] hover:text-[#673ab7] transition-colors"
                                        >
                                            {showSecret ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>
                                {errors.stripe_secret && <p className="text-red-500 text-xs mt-1">{errors.stripe_secret}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">Webhook Secret</label>
                                <div className="relative">
                                    <input 
                                        type={showWebhook ? "text" : "password"} 
                                        value={data.stripe_webhook_secret}
                                        onChange={e => setData('stripe_webhook_secret', e.target.value)}
                                        placeholder="whsec_..."
                                        className={`w-full h-[52px] pl-4 pr-24 bg-white border ${errors.stripe_webhook_secret ? 'border-red-500' : 'border-[#e3e4e8]'} rounded-[8px] text-[14px] font-mono focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all`}
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                                        <button 
                                            type="button"
                                            onClick={() => handleCopy(data.stripe_webhook_secret, 'webhook')}
                                            className="text-[#a0a3af] hover:text-[#673ab7] transition-colors"
                                        >
                                            {copiedField === 'webhook' ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => setShowWebhook(!showWebhook)}
                                            className="text-[#a0a3af] hover:text-[#673ab7] transition-colors"
                                        >
                                            {showWebhook ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>
                                {errors.stripe_webhook_secret && <p className="text-red-500 text-xs mt-1">{errors.stripe_webhook_secret}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Fund Hold Management */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-2 pb-2 border-b border-[#f1f2f4]">
                            <Clock size={20} className="text-[#673ab7]" />
                            <h3 className="text-[16px] font-bold text-[#2f3344]">Escrow & Fund Management</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">
                                    Supplier Fund Hold Period (Minutes)
                                </label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        value={data.fund_hold_minutes}
                                        onChange={e => setData('fund_hold_minutes', e.target.value)}
                                        placeholder="5"
                                        min="0"
                                        className={`w-full h-[52px] pl-4 pr-12 bg-white border ${errors.fund_hold_minutes ? 'border-red-500' : 'border-[#e3e4e8]'} rounded-[8px] text-[14px] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all`}
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#727586] text-[12px] font-bold uppercase">
                                        Min
                                    </div>
                                </div>
                                <p className="text-[12px] text-[#727586]">
                                    Number of minutes funds will be held in escrow before being released to the supplier balance. 
                                    (e.g., 20160 for 14 days, 5 for testing).
                                </p>
                                {errors.fund_hold_minutes && <p className="text-red-500 text-xs mt-1">{errors.fund_hold_minutes}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-[#f1f2f4]">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 bg-[#673ab7] hover:bg-[#5e35b1] text-white px-8 py-3 rounded-[10px] font-bold text-[14px] transition-all shadow-lg shadow-[#673ab7]/20 disabled:opacity-70"
                        >
                            {processing ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <Save size={18} />
                            )}
                            Save Changes
                        </button>
                    </div>

                </form>
            </div>
        </SettingsLayout>
    );
}
