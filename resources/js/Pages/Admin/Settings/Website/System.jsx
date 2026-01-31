import React, { useState, useRef } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { Layout, Globe, Image as ImageIcon, Search, Shield, Cpu, Home, ChevronDown, Upload, X, CheckCircle2 } from 'lucide-react';

export default function WebsiteSystem() {
    // Form and Toggle State
    const [formData, setFormData] = useState({
        site_name: 'Almamon Admin Dashboard',
        site_url: 'https://dashboard.almamon.dev',
        title_prefix: '| Best SaaS Platform',
        meta_description: 'Manage your business logic, customers, and financial gateways through our professional admin interface.',
        keywords: 'admin, dashboard, react, laravel, management',
    });

    const [settings, setSettings] = useState({
        force_ssl: true,
        debug_mode: false,
    });

    // Image Upload State
    const [images, setImages] = useState({
        logo: null,
        favicon: null,
        og_image: null
    });

    const fileInputRefs = {
        logo: useRef(null),
        favicon: useRef(null),
        og_image: useRef(null)
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleSetting = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleImageUpload = (type, e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages(prev => ({ ...prev, [type]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (type) => {
        setImages(prev => ({ ...prev, [type]: null }));
        if (fileInputRefs[type].current) fileInputRefs[type].current.value = "";
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Saving Data:', { ...formData, ...settings, images });
        alert('System settings have been updated successfully!');
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
                        className="bg-[#673ab7] text-white px-8 py-[10px] rounded-[6px] font-bold text-[14px] hover:bg-[#5e35b1] transition-all shadow-sm flex items-center gap-2"
                    >
                        <CheckCircle2 size={18} />
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
                                    name="site_name"
                                    type="text" 
                                    value={formData.site_name}
                                    onChange={handleInputChange}
                                    className="w-full h-[45px] px-4 bg-white border border-[#e3e4e8] rounded-[6px] text-[14px] text-[#2f3344] focus:outline-none focus:border-[#673ab7] transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[14px] font-bold text-[#2f3344]">Site URL</label>
                                <div className="relative">
                                    <input 
                                        name="site_url"
                                        type="text" 
                                        value={formData.site_url}
                                        onChange={handleInputChange}
                                        className="w-full h-[45px] pl-11 pr-4 bg-[#f8f9fa] border border-[#e3e4e8] rounded-[6px] text-[14px] text-[#2f3344] focus:outline-none focus:border-[#673ab7] transition-all"
                                    />
                                    <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a3af]" />
                                </div>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-[14px] font-bold text-[#2f3344]">SEO Title Prefix</label>
                                <input 
                                    name="title_prefix"
                                    type="text" 
                                    value={formData.title_prefix}
                                    onChange={handleInputChange}
                                    placeholder="e.g. | Best SaaS Platform"
                                    className="w-full h-[45px] px-4 bg-white border border-[#e3e4e8] rounded-[6px] text-[14px] text-[#2f3344] focus:outline-none focus:border-[#673ab7] transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Asset Management */}
                <div className="bg-white rounded-[10px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                    <div className="px-7 py-5 border-b border-[#e3e4e8]">
                        <h2 className="text-[18px] font-bold text-[#2f3344]">Site Assets</h2>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            {/* Logo Upload */}
                            {['logo', 'favicon', 'og_image'].map((type) => (
                                <div key={type} className="space-y-4">
                                    <div>
                                        <h4 className="text-[15px] font-bold text-[#2f3344] capitalize">{type.replace('_', ' ')}</h4>
                                        <p className="text-[12px] text-[#727586] mt-1">
                                            {type === 'logo' ? (
                                                <>Visible on login/sidebar. <span className="text-[#673ab7] font-bold">Rec: 200x50px</span></>
                                            ) : type === 'favicon' ? (
                                                <>Browser tab icon. <span className="text-[#673ab7] font-bold">Rec: 32x32px</span></>
                                            ) : (
                                                <>Social share preview. <span className="text-[#673ab7] font-bold">Rec: 1200x630px</span></>
                                            )}
                                        </p>
                                    </div>
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        ref={fileInputRefs[type]} 
                                        onChange={(e) => handleImageUpload(type, e)}
                                        accept="image/*"
                                    />
                                    <div 
                                        onClick={() => !images[type] && fileInputRefs[type].current.click()}
                                        className={`h-[120px] rounded-[10px] border-2 border-dashed transition-all relative overflow-hidden flex flex-col items-center justify-center gap-2 group ${
                                            images[type] ? 'border-[#673ab7] bg-white' : 'border-[#e3e4e8] bg-[#fafbfc] cursor-pointer hover:border-[#673ab7]/30'
                                        }`}
                                    >
                                        {images[type] ? (
                                            <>
                                                <img src={images[type]} className="absolute inset-0 w-full h-full object-contain p-2" alt="Preview" />
                                                <button 
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); removeImage(type); }}
                                                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all z-10"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <Upload size={24} className="text-[#a0a3af] group-hover:text-[#673ab7]" />
                                                <span className="text-[12px] font-bold text-[#727586]">Click to upload</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SEO Content */}
                <div className="bg-white rounded-[10px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                    <div className="px-7 py-5 border-b border-[#e3e4e8]">
                        <h2 className="text-[18px] font-bold text-[#2f3344]">SEO & Meta Content</h2>
                    </div>

                    <div className="p-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[14px] font-bold text-[#2f3344]">Meta Description</label>
                                <textarea 
                                    name="meta_description"
                                    value={formData.meta_description}
                                    onChange={handleInputChange}
                                    className="w-full p-4 bg-white border border-[#e3e4e8] rounded-[6px] text-[14px] text-[#2f3344] focus:outline-none focus:border-[#673ab7] transition-all resize-none min-h-[100px]"
                                ></textarea>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[14px] font-bold text-[#2f3344]">Keywords</label>
                                <div className="relative">
                                    <input 
                                        name="keywords"
                                        type="text" 
                                        value={formData.keywords}
                                        onChange={handleInputChange}
                                        placeholder="Add keywords separated by comma..."
                                        className="w-full h-[45px] pl-11 pr-4 bg-white border border-[#e3e4e8] rounded-[6px] text-[14px] text-[#2f3344] focus:outline-none focus:border-[#673ab7] transition-all"
                                    />
                                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a3af]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Technical System Configs */}
                <div className="bg-white rounded-[10px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                    <div className="px-7 py-5 border-b border-[#e3e4e8]">
                        <h2 className="text-[18px] font-bold text-[#2f3344]">Technical Configuration</h2>
                    </div>

                    <div className="p-0 divide-y divide-[#f1f2f4]">
                        <div className="p-7 flex items-center justify-between hover:bg-[#fafbfc] transition-colors">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-[#f4f0ff] rounded-lg flex items-center justify-center text-[#673ab7] shrink-0">
                                    <Shield size={20} />
                                </div>
                                <div>
                                    <h4 className="text-[15px] font-bold text-[#2f3344]">Force SSL (HTTPS)</h4>
                                    <p className="text-[13px] text-[#727586] mt-1">Automatically redirect all HTTP requests to Secure HTTPS.</p>
                                </div>
                            </div>
                            <ToggleSwitch enabled={settings.force_ssl} onToggle={() => toggleSetting('force_ssl')} />
                        </div>

                        <div className="p-7 flex items-center justify-between hover:bg-[#fafbfc] transition-colors">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 shrink-0">
                                    <Cpu size={20} />
                                </div>
                                <div>
                                    <h4 className="text-[15px] font-bold text-[#2f3344]">System Debug Mode</h4>
                                    <p className="text-[13px] text-[#727586] mt-1">Enable detailed error reporting for development and troubleshooting.</p>
                                </div>
                            </div>
                            <ToggleSwitch enabled={settings.debug_mode} onToggle={() => toggleSetting('debug_mode')} />
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
