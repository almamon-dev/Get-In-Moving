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
        system_charge: settings.system_charge || 10,
        pay_later_days: settings.pay_later_days || 30,
        pay_later_default_limit: settings.pay_later_default_limit || 5000,
        pay_later_default_daily_limit: settings.pay_later_default_daily_limit || 1000,
        pay_later_default_weekly_limit: settings.pay_later_default_weekly_limit || 2500,
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
            subtitle="Connect and manage your payment processors."
            breadcrumbs={["Financial", "Gateway"]}
        >
            <div className="p-4 sm:p-6">
                <form onSubmit={handleSubmit} className="max-w-full space-y-6">
                    {/* Active Gateway Toggle */}
                    <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-md border border-gray-200 shadow-sm flex items-center justify-center text-indigo-600">
                                <CreditCard size={20} />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900">Stripe Integration</h4>
                                <p className="text-xs text-gray-500 mt-0.5">Accept payments globally via Stripe.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider ${
                                data.stripe_mode === 'live' ? 'text-emerald-600 bg-emerald-50 border border-emerald-200' : 'text-amber-600 bg-amber-50 border border-amber-200'
                            }`}>
                                {data.stripe_mode === 'live' ? 'Live Mode' : 'Test Mode'}
                            </span>
                            <div 
                                onClick={toggleMode}
                                className={`w-10 h-5 rounded-full relative cursor-pointer transition-all duration-300 ${
                                    data.stripe_mode === 'live' ? 'bg-indigo-600' : 'bg-gray-300'
                                }`}
                            >
                                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${
                                    data.stripe_mode === 'live' ? 'right-0.5' : 'left-0.5'
                                }`}></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-5 shadow-sm">
                        <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                            <ShieldCheck size={16} className="text-indigo-600" />
                            <h3 className="text-sm font-semibold text-gray-900">API Credentials</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Stripe Public Key</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={data.stripe_key}
                                        onChange={e => setData('stripe_key', e.target.value)}
                                        placeholder="pk_live_..."
                                        className={`w-full h-10 pl-3 pr-10 bg-gray-50/50 border ${errors.stripe_key ? 'border-red-500' : 'border-gray-200'} rounded-md text-sm font-mono focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all`}
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => handleCopy(data.stripe_key, 'key')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
                                    >
                                        {copiedField === 'key' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                    </button>
                                </div>
                                {errors.stripe_key && <p className="text-red-500 text-[11px] mt-1">{errors.stripe_key}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Stripe Secret Key</label>
                                <div className="relative">
                                    <input 
                                        type={showSecret ? "text" : "password"} 
                                        value={data.stripe_secret}
                                        onChange={e => setData('stripe_secret', e.target.value)}
                                        placeholder="sk_live_..."
                                        className={`w-full h-10 pl-3 pr-20 bg-gray-50/50 border ${errors.stripe_secret ? 'border-red-500' : 'border-gray-200'} rounded-md text-sm font-mono focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all`}
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                        <button 
                                            type="button"
                                            onClick={() => handleCopy(data.stripe_secret, 'secret')}
                                            className="text-gray-400 hover:text-indigo-600 transition-colors"
                                        >
                                            {copiedField === 'secret' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => setShowSecret(!showSecret)}
                                            className="text-gray-400 hover:text-indigo-600 transition-colors"
                                        >
                                            {showSecret ? <EyeOff size={14} /> : <Eye size={14} />}
                                        </button>
                                    </div>
                                </div>
                                {errors.stripe_secret && <p className="text-red-500 text-[11px] mt-1">{errors.stripe_secret}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Webhook Secret</label>
                                <div className="relative">
                                    <input 
                                        type={showWebhook ? "text" : "password"} 
                                        value={data.stripe_webhook_secret}
                                        onChange={e => setData('stripe_webhook_secret', e.target.value)}
                                        placeholder="whsec_..."
                                        className={`w-full h-10 pl-3 pr-20 bg-gray-50/50 border ${errors.stripe_webhook_secret ? 'border-red-500' : 'border-gray-200'} rounded-md text-sm font-mono focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all`}
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                        <button 
                                            type="button"
                                            onClick={() => handleCopy(data.stripe_webhook_secret, 'webhook')}
                                            className="text-gray-400 hover:text-indigo-600 transition-colors"
                                        >
                                            {copiedField === 'webhook' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => setShowWebhook(!showWebhook)}
                                            className="text-gray-400 hover:text-indigo-600 transition-colors"
                                        >
                                            {showWebhook ? <EyeOff size={14} /> : <Eye size={14} />}
                                        </button>
                                    </div>
                                </div>
                                {errors.stripe_webhook_secret && <p className="text-red-500 text-[11px] mt-1">{errors.stripe_webhook_secret}</p>}
                            </div>
                        </div>

                        {/* Webhook Setup Guide */}
                        <div className="bg-indigo-50/50 p-3 rounded-md border border-indigo-100/50 mt-4">
                            <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-indigo-100/50">
                                <ShieldCheck size={14} className="text-indigo-600" />
                                <h3 className="text-xs font-semibold text-indigo-900">Webhook Setup Guide</h3>
                            </div>
                            <div className="text-[11px] text-indigo-900/70 space-y-1">
                                <p><strong>1.</strong> In Stripe Dashboard: <strong>Developers &gt; Webhooks &gt; Add an endpoint</strong>.</p>
                                <p className="flex items-center gap-1">
                                    <strong>2.</strong> URL: 
                                    <code className="bg-white px-1 py-0.5 rounded border border-indigo-100 font-mono text-[10px] text-indigo-700">
                                        https://your-domain.com/api/webhooks/stripe
                                    </code>
                                </p>
                                <div className="pt-1">
                                    <p className="mb-1"><strong>3.</strong> Select exactly these events:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {['account.updated', 'checkout.session.completed', 'customer.deleted', 'customer.subscription.created', 'customer.subscription.deleted', 'customer.subscription.updated', 'customer.updated', 'invoice.payment_action_required', 'invoice.payment_succeeded'].map(evt => (
                                            <span key={evt} className="bg-white border border-indigo-100 text-indigo-600 font-mono text-[9px] px-1.5 py-0.5 rounded shadow-sm">
                                                {evt}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <p className="pt-1"><strong>4.</strong> Save, reveal the <strong>Signing secret</strong>, and paste it into the Webhook Secret field above.</p>
                            </div>
                        </div>
                    </div>

                    {/* Fund Management */}
                    <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-5 shadow-sm">
                        <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                            <Clock size={16} className="text-indigo-600" />
                            <h3 className="text-sm font-semibold text-gray-900">Fees & Fund Management</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    System Charge (%)
                                </label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        value={data.system_charge}
                                        onChange={e => setData('system_charge', e.target.value)}
                                        placeholder="10"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        className={`w-full h-10 pl-3 pr-8 bg-gray-50/50 border ${errors.system_charge ? 'border-red-500' : 'border-gray-200'} rounded-md text-sm focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all`}
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] font-bold">
                                        %
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-500 leading-snug">
                                    Percentage of each transaction collected as platform fee (split 50/50).
                                </p>
                                {errors.system_charge && <p className="text-red-500 text-[11px] mt-1">{errors.system_charge}</p>}
                            </div>
                            
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Pay Later Duration
                                </label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        value={data.pay_later_days}
                                        onChange={e => setData('pay_later_days', e.target.value)}
                                        placeholder="30"
                                        min="1"
                                        className={`w-full h-10 pl-3 pr-10 bg-gray-50/50 border ${errors.pay_later_days ? 'border-red-500' : 'border-gray-200'} rounded-md text-sm focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all`}
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] font-bold uppercase">
                                        Days
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-500 leading-snug">
                                    Number of days before an auto-deduction is triggered for Pay Later orders.
                                </p>
                                {errors.pay_later_days && <p className="text-red-500 text-[11px] mt-1">{errors.pay_later_days}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Pay Later Default Limit
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                                        €
                                    </div>
                                    <input 
                                        type="number" 
                                        value={data.pay_later_default_limit}
                                        onChange={e => setData('pay_later_default_limit', e.target.value)}
                                        placeholder="5000"
                                        min="100"
                                        className={`w-full h-10 pl-8 pr-3 bg-gray-50/50 border ${errors.pay_later_default_limit ? 'border-red-500' : 'border-gray-200'} rounded-md text-sm focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all`}
                                    />
                                </div>
                                <p className="text-[10px] text-gray-500 leading-snug">
                                    The global default Total Limit granted to a user automatically upon first request.
                                </p>
                                {errors.pay_later_default_limit && <p className="text-red-500 text-[11px] mt-1">{errors.pay_later_default_limit}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Pay Later Default Daily Limit
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                                        €
                                    </div>
                                    <input 
                                        type="number" 
                                        value={data.pay_later_default_daily_limit}
                                        onChange={e => setData('pay_later_default_daily_limit', e.target.value)}
                                        placeholder="1000"
                                        min="0"
                                        className={`w-full h-10 pl-8 pr-3 bg-gray-50/50 border ${errors.pay_later_default_daily_limit ? 'border-red-500' : 'border-gray-200'} rounded-md text-sm focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all`}
                                    />
                                </div>
                                <p className="text-[10px] text-gray-500 leading-snug">
                                    The global default Daily Limit granted to a user automatically.
                                </p>
                                {errors.pay_later_default_daily_limit && <p className="text-red-500 text-[11px] mt-1">{errors.pay_later_default_daily_limit}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Pay Later Default Weekly Limit
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                                        €
                                    </div>
                                    <input 
                                        type="number" 
                                        value={data.pay_later_default_weekly_limit}
                                        onChange={e => setData('pay_later_default_weekly_limit', e.target.value)}
                                        placeholder="2500"
                                        min="0"
                                        className={`w-full h-10 pl-8 pr-3 bg-gray-50/50 border ${errors.pay_later_default_weekly_limit ? 'border-red-500' : 'border-gray-200'} rounded-md text-sm focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all`}
                                    />
                                </div>
                                <p className="text-[10px] text-gray-500 leading-snug">
                                    The global default Weekly Limit granted to a user automatically.
                                </p>
                                {errors.pay_later_default_weekly_limit && <p className="text-red-500 text-[11px] mt-1">{errors.pay_later_default_weekly_limit}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-md font-semibold text-sm transition-all shadow-sm disabled:opacity-70"
                        >
                            {processing ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Save size={16} />
                            )}
                            Save Configuration
                        </button>
                    </div>

                </form>
            </div>
        </SettingsLayout>
    );
}
