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
            <div className="p-4 sm:p-6">
                <form onSubmit={handleSubmit} className="max-w-full space-y-6">
                    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-5">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Mail Driver</label>
                                <select 
                                    value={data.mail_mailer}
                                    onChange={e => setData('mail_mailer', e.target.value)}
                                    className="w-full h-10 px-3 bg-gray-50/50 border border-gray-200 rounded-md text-sm focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
                                >
                                    <option value="smtp">SMTP</option>
                                    <option value="mailgun">Mailgun</option>
                                    <option value="postmark">Postmark</option>
                                    <option value="ses">Amazon SES</option>
                                </select>
                            </div>
                            
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Encryption</label>
                                <div className="flex gap-3">
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
                                            <div className={`h-10 border border-gray-200 rounded-md flex items-center justify-center font-semibold text-xs transition-all group-hover:border-indigo-400 ${data.mail_encryption === enc ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-gray-50/50 text-gray-600'}`}>
                                                {enc.toUpperCase()}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="md:col-span-2 space-y-1.5">
                                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">SMTP Host</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={data.mail_host}
                                        onChange={e => setData('mail_host', e.target.value)}
                                        placeholder="smtp.example.com"
                                        className="w-full h-10 pl-9 pr-3 bg-gray-50/50 border border-gray-200 rounded-md text-sm focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                    />
                                    <Server size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Port</label>
                                <input 
                                    type="text" 
                                    value={data.mail_port}
                                    onChange={e => setData('mail_port', e.target.value)}
                                    placeholder="587"
                                    className="w-full h-10 px-3 bg-gray-50/50 border border-gray-200 rounded-md text-sm focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Username</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={data.mail_username}
                                        onChange={e => setData('mail_username', e.target.value)}
                                        placeholder="Enter SMTP username"
                                        className="w-full h-10 pl-9 pr-3 bg-gray-50/50 border border-gray-200 rounded-md text-sm focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                    />
                                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Password</label>
                                <div className="relative">
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        value={data.mail_password}
                                        onChange={e => setData('mail_password', e.target.value)}
                                        placeholder="••••••••••••"
                                        className="w-full h-10 pl-9 pr-10 bg-gray-50/50 border border-gray-200 rounded-md text-sm focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                    />
                                    <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">From Address</label>
                                <div className="relative">
                                    <input 
                                        type="email" 
                                        value={data.mail_from_address}
                                        onChange={e => setData('mail_from_address', e.target.value)}
                                        placeholder="hello@example.com"
                                        className="w-full h-10 pl-9 pr-3 bg-gray-50/50 border border-gray-200 rounded-md text-sm focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                    />
                                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">From Name</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={data.mail_from_name}
                                        onChange={e => setData('mail_from_name', e.target.value)}
                                        placeholder="Site Name"
                                        className="w-full h-10 pl-9 pr-3 bg-gray-50/50 border border-gray-200 rounded-md text-sm focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                    />
                                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-semibold text-sm transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {processing ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Save size={16} />
                            )}
                            Save to .env
                        </button>
                    </div>
                </form>
            </div>
        </SettingsLayout>
    );
}
