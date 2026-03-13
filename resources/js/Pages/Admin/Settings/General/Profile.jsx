import React, { useRef } from 'react';
import SettingsLayout from '../SettingsLayout';
import { User, Mail, Phone, Camera, Loader2 } from 'lucide-react';
import { useForm, router } from '@inertiajs/react';
import { toast } from 'react-toastify';

export default function Profile({ user }) {
    const fileInputRef = useRef();

    const { data, setData, post, processing, errors, reset } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        phone_number: user?.phone_number || '',
        designation: user?.designation || '',
        bio: user?.bio || '',
        profile_picture: null,
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('profile_picture', file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Use post because we are sending a file
        post(route('admin.settings.general.profile.update'), {
            onSuccess: () => {
                toast.success('Profile updated successfully!');
                setData('profile_picture', null);
            },
            onError: () => toast.error('Failed to update profile.'),
        });
    };

    const removePicture = () => {
        if (confirm('Are you sure you want to remove your profile picture?')) {
            router.post(route('admin.settings.general.profile.remove-picture'), {}, {
                onSuccess: () => toast.success('Profile picture removed.'),
            });
        }
    };

    return (
        <SettingsLayout 
            title="Profile Settings" 
            subtitle="Update your personal information and public profile details."
            breadcrumbs={["General", "Profile"]}
        >
            <div className="p-8">
                <form onSubmit={handleSubmit} className="max-w-7xl space-y-10">
                    {/* Avatar Section */}
                    <div className="flex items-center gap-8">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-2xl bg-[#f4f0ff] border-2 border-dashed border-[#673ab7]/30 flex items-center justify-center text-[#673ab7] overflow-hidden">
                                {data.profile_picture ? (
                                    <img src={URL.createObjectURL(data.profile_picture)} alt="Preview" className="w-full h-full object-cover" />
                                ) : user.profile_picture ? (
                                    <img src={user.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={40} />
                                )}
                            </div>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileChange} 
                                className="hidden" 
                                accept="image/*"
                            />
                            <button 
                                type="button"
                                onClick={triggerFileInput}
                                className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#673ab7] text-white rounded-lg flex items-center justify-center shadow-lg border-2 border-white hover:bg-[#5e35b1] transition-all"
                            >
                                <Camera size={14} />
                            </button>
                        </div>
                        <div>
                            <h4 className="text-[16px] font-bold text-[#2f3344]">Profile Photo</h4>
                            <p className="text-[13px] text-[#727586] mt-1">PNG, JPG or GIF. Max 2MB.</p>
                            <div className="flex gap-3 mt-3">
                                <button 
                                    type="button"
                                    onClick={triggerFileInput}
                                    className="text-[13px] font-bold text-[#673ab7] hover:underline"
                                >
                                    Upload new
                                </button>
                                {(user.profile_picture || data.profile_picture) && (
                                    <button 
                                        type="button"
                                        onClick={removePicture}
                                        className="text-[13px] font-bold text-red-500 hover:underline"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            {errors.profile_picture && <p className="text-red-500 text-xs mt-1">{errors.profile_picture}</p>}
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">Full Name</label>
                            <input 
                                type="text" 
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className={`w-full h-[52px] px-4 bg-white border ${errors.name ? 'border-red-500' : 'border-[#e3e4e8]'} rounded-[8px] text-[15px] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all placeholder:text-[#c3c4ca]`}
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">Email Address</label>
                            <div className="relative">
                                <input 
                                    type="email" 
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    className={`w-full h-[52px] pl-11 pr-4 bg-white border ${errors.email ? 'border-red-500' : 'border-[#e3e4e8]'} rounded-[8px] text-[15px] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all`}
                                />
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a3af]" />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">Phone Number</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={data.phone_number}
                                    onChange={e => setData('phone_number', e.target.value)}
                                    placeholder="+1 (555) 000-0000"
                                    className={`w-full h-[52px] pl-11 pr-4 bg-white border ${errors.phone_number ? 'border-red-500' : 'border-[#e3e4e8]'} rounded-[8px] text-[15px] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all`}
                                />
                                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a3af]" />
                            </div>
                            {errors.phone_number && <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">Designation</label>
                            <input 
                                type="text" 
                                value={data.designation}
                                onChange={e => setData('designation', e.target.value)}
                                className={`w-full h-[52px] px-4 bg-white border ${errors.designation ? 'border-red-500' : 'border-[#e3e4e8]'} rounded-[8px] text-[15px] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all`}
                            />
                            {errors.designation && <p className="text-red-500 text-xs mt-1">{errors.designation}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">Biography</label>
                        <textarea 
                            rows="4" 
                            value={data.bio}
                            onChange={e => setData('bio', e.target.value)}
                            placeholder="Write a short bio about yourself..."
                            className={`w-full p-4 bg-white border ${errors.bio ? 'border-red-500' : 'border-[#e3e4e8]'} rounded-[8px] text-[15px] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all resize-none`}
                        ></textarea>
                        {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio}</p>}
                    </div>

                    <div className="pt-6 border-t border-[#f1f2f4] flex gap-4">
                        <button 
                            type="submit"
                            disabled={processing}
                            className="bg-[#673ab7] text-white px-8 py-3 rounded-lg font-bold text-[14px] hover:bg-[#5e35b1] transition-all shadow-md flex items-center gap-2 disabled:opacity-70"
                        >
                            {processing ? <Loader2 size={18} className="animate-spin" /> : null}
                            Save Profile
                        </button>
                        <button 
                            type="button"
                            onClick={() => reset()}
                            className="bg-white border border-[#e3e4e8] text-[#2f3344] px-8 py-3 rounded-lg font-bold text-[14px] hover:bg-slate-50 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </SettingsLayout>
    );
}
