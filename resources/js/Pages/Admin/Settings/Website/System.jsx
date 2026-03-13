import React, { useRef } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { Layout, Globe, Image as ImageIcon, Search, Shield, Cpu, Home, ChevronDown, Upload, X, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

export default function WebsiteSystem({ settings }) {
    const { data, setData, post, processing, errors } = useForm({
        site_name: settings.site_name || '',
        site_url: settings.site_url || '',
        title_prefix: settings.title_prefix || '',
        meta_description: settings.meta_description || '',
        keywords: settings.keywords || '',
        force_ssl: settings.force_ssl ?? true,
        debug_mode: settings.debug_mode ?? false,
    });

    const fileInputRefs = {
        logo: useRef(null),
        favicon: useRef(null),
        og_image: useRef(null)
    };

    const toggleSetting = (key) => {
        setData(key, !data[key]);
    };

    const handleImageUpload = (type, e) => {
        const file = e.target.files[0];
        if (file) {
            console.log('File upload would happen here for:', type);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.settings.update'), {
            onSuccess: () => toast.success('Settings updated successfully!'),
            onError: () => toast.error('Failed to update settings.'),
            preserveScroll: true,
        });
    };

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
            <Head title="Website System Settings" />
            
            <form onSubmit={handleSubmit} className="space-y-6 pb-20">
                {/* Header & Breadcrumb */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-[22px] font-bold text-[#2f3344]">System Settings</h1>
                        <div className="flex items-center gap-2 text-[13px] text-[#727586] mt-1">
                            <Home size={14} />
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Settings</span>
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Website</span>
                            <span className="text-[#c3c4ca]">-</span>
                            <span>System</span>
                        </div>
                    </div>
                    <button 
                        type="submit"
                        disabled={processing}
                        className="bg-[#673ab7] text-white px-8 py-[10px] rounded-[6px] font-bold text-[14px] hover:bg-[#5e35b1] transition-all shadow-sm flex items-center gap-2 disabled:opacity-70"
                    >
                        {processing ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                        Save All Changes
                    </button>
                </div>

                {/* Primary Site Configuration */}
                <div className="bg-white rounded-[10px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                    <div className="px-7 py-5 border-b border-[#e3e4e8]">
                        <h2 className="text-[18px] font-bold text-[#2f3344]">Site Configuration</h2>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="space-y-2">
                                <label className="text-[14px] font-bold text-[#2f3344]">Site Name</label>
                                <input 
                                    type="text" 
                                    value={data.site_name}
                                    onChange={e => setData('site_name', e.target.value)}
                                    className="w-full h-[45px] px-4 bg-white border border-[#e3e4e8] rounded-[6px] text-[14px] text-[#2f3344] focus:outline-none focus:border-[#673ab7] transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[14px] font-bold text-[#2f3344]">Site URL</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={data.site_url}
                                        onChange={e => setData('site_url', e.target.value)}
                                        className="w-full h-[45px] pl-11 pr-4 bg-[#f8f9fa] border border-[#e3e4e8] rounded-[6px] text-[14px] text-[#2f3344] focus:outline-none focus:border-[#673ab7] transition-all"
                                    />
                                    <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a3af]" />
                                </div>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-[14px] font-bold text-[#2f3344]">SEO Title Prefix</label>
                                <input 
                                    type="text" 
                                    value={data.title_prefix}
                                    onChange={e => setData('title_prefix', e.target.value)}
                                    placeholder="e.g. | Best SaaS Platform"
                                    className="w-full h-[45px] px-4 bg-white border border-[#e3e4e8] rounded-[6px] text-[14px] text-[#2f3344] focus:outline-none focus:border-[#673ab7] transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
