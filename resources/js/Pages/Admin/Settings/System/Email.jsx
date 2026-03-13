import React, { useState } from 'react';
import SettingsLayout from '../SettingsLayout';
import { Mail, Server, Key, Send, Save, Loader2, User, Eye, EyeOff } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import { toast } from 'react-toastify';

export default function EmailSettings({ settings }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        mail_mailer: settings.mail_mailer || 'smtp',
        mail_host: settings.mail_host || '',
        mail_port: settings.mail_port || '',
        mail_username: settings.mail_username || '',
        mail_password: settings.mail_password || '',
        mail_encryption: settings.mail_encryption || 'tls',
        mail_from_address: settings.mail_from_address || '',
        mail_from_name: settings.mail_from_name || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.settings.system.email.update'), {
            onSuccess: () => toast.success('Email settings updated in .env!'),
            onError: () => toast.error('Failed to update email settings.'),
            preserveScroll: true,
        });
    };

    return (
        <SettingsLayout 
            title="Email Settings" 
            subtitle="Configure SMTP servers and automated email communication protocols. Updates will be saved to .env"
            breadcrumbs={["System", "Email"]}
        >
            <div className="p-8">
                <form onSubmit={handleSubmit} className="max-w-7xl space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">Mail Driver</label>
                            <select 
                                value={data.mail_mailer}
                                onChange={e => setData('mail_mailer', e.target.value)}
                                className="w-full h-[52px] px-4 bg-white border border-[#e3e4e8] rounded-[8px] text-[15px] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all cursor-pointer"
                            >
                                <option value="smtp">SMTP</option>
                                <option value="mailgun">Mailgun</option>
                                <option value="postmark">Postmark</option>
                                <option value="ses">Amazon SES</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">Encryption</label>
                            <div className="flex gap-4">
                                {['tls', 'ssl', 'none'].map((enc) => (
                                    <label key={enc} className="flex-1 cursor-pointer group">
                                        <input 
                                            type="radio" 
                                            name="mail_encryption" 
                                            value={enc}
                                            checked={data.mail_encryption === enc}
                                            onChange={e => setData('mail_encryption', e.target.value)}
                                            className="hidden" 
                                        />
                                        <div className={`h-[52px] border border-[#e3e4e8] rounded-[8px] flex items-center justify-center font-bold text-[14px] transition-all group-hover:border-[#673ab7] ${data.mail_encryption === enc ? 'bg-[#673ab7] text-white border-[#673ab7]' : ''}`}>
                                            {enc.toUpperCase()}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">SMTP Host</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={data.mail_host}
                                    onChange={e => setData('mail_host', e.target.value)}
                                    placeholder="smtp.example.com"
                                    className="w-full h-[52px] pl-11 pr-4 bg-white border border-[#e3e4e8] rounded-[8px] text-[15px] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all"
                                />
                                <Server size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a3af]" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">Port</label>
                            <input 
                                type="text" 
                                value={data.mail_port}
                                onChange={e => setData('mail_port', e.target.value)}
                                placeholder="587"
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
                                    value={data.mail_username}
                                    onChange={e => setData('mail_username', e.target.value)}
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
                                    type={showPassword ? "text" : "password"} 
                                    value={data.mail_password}
                                    onChange={e => setData('mail_password', e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full h-[52px] pl-11 pr-12 bg-white border border-[#e3e4e8] rounded-[8px] text-[15px] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all"
                                />
                                <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a3af]" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a0a3af] hover:text-[#673ab7] transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">From Address</label>
                            <div className="relative">
                                <input 
                                    type="email" 
                                    value={data.mail_from_address}
                                    onChange={e => setData('mail_from_address', e.target.value)}
                                    placeholder="hello@example.com"
                                    className="w-full h-[52px] pl-11 pr-4 bg-white border border-[#e3e4e8] rounded-[8px] text-[15px] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all"
                                />
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a3af]" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">From Name</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={data.mail_from_name}
                                    onChange={e => setData('mail_from_name', e.target.value)}
                                    placeholder="Site Name"
                                    className="w-full h-[52px] pl-11 pr-4 bg-white border border-[#e3e4e8] rounded-[8px] text-[15px] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all"
                                />
                                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a3af]" />
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
                            Save to .env
                        </button>
                    </div>
                </form>

               
            </div>
        </SettingsLayout>
    );
}
