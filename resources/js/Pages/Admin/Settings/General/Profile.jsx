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
            <div className="p-4 sm:p-6">
                <form onSubmit={handleSubmit} className="max-w-full space-y-6">
                    {/* Avatar Section */}
                    <div className="flex items-center gap-6 p-5 bg-white rounded-lg border border-gray-200 shadow-sm">
                        <div className="relative group shrink-0">
                            <div className="w-20 h-20 rounded-xl bg-indigo-50 border border-dashed border-indigo-200 flex items-center justify-center text-indigo-500 overflow-hidden shadow-sm">
                                {data.profile_picture ? (
                                    <img src={URL.createObjectURL(data.profile_picture)} alt="Preview" className="w-full h-full object-cover" />
                                ) : user.profile_picture ? (
                                    <img src={user.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={32} />
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
                                className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-indigo-600 text-white rounded-md flex items-center justify-center shadow-md border-2 border-white hover:bg-indigo-700 transition-all"
                            >
                                <Camera size={12} />
                            </button>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900">Profile Photo</h4>
                            <p className="text-xs text-gray-500 mt-0.5">PNG, JPG or GIF. Max 2MB.</p>
                            <div className="flex gap-3 mt-2">
                                <button 
                                    type="button"
                                    onClick={triggerFileInput}
                                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                                >
                                    Upload new
                                </button>
                                {(user.profile_picture || data.profile_picture) && (
                                    <button 
                                        type="button"
                                        onClick={removePicture}
                                        className="text-xs font-semibold text-red-500 hover:text-red-600"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            {errors.profile_picture && <p className="text-red-500 text-[11px] mt-1">{errors.profile_picture}</p>}
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-5 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Full Name</label>
                                <input 
                                    type="text" 
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className={`w-full h-10 px-3 bg-gray-50/50 border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-md text-sm focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-gray-400`}
                                />
                                {errors.name && <p className="text-red-500 text-[11px] mt-1">{errors.name}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Email Address</label>
                                <div className="relative">
                                    <input 
                                        type="email" 
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className={`w-full h-10 pl-9 pr-3 bg-gray-50/50 border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-md text-sm focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all`}
                                    />
                                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                                {errors.email && <p className="text-red-500 text-[11px] mt-1">{errors.email}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Phone Number</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={data.phone_number}
                                        onChange={e => setData('phone_number', e.target.value)}
                                        placeholder="+1 (555) 000-0000"
                                        className={`w-full h-10 pl-9 pr-3 bg-gray-50/50 border ${errors.phone_number ? 'border-red-500' : 'border-gray-200'} rounded-md text-sm focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all`}
                                    />
                                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                                {errors.phone_number && <p className="text-red-500 text-[11px] mt-1">{errors.phone_number}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Designation</label>
                                <input 
                                    type="text" 
                                    value={data.designation}
                                    onChange={e => setData('designation', e.target.value)}
                                    className={`w-full h-10 px-3 bg-gray-50/50 border ${errors.designation ? 'border-red-500' : 'border-gray-200'} rounded-md text-sm focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all`}
                                />
                                {errors.designation && <p className="text-red-500 text-[11px] mt-1">{errors.designation}</p>}
                            </div>
                        </div>

                        <div className="space-y-1.5 pt-2">
                            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Biography</label>
                            <textarea 
                                rows="3" 
                                value={data.bio}
                                onChange={e => setData('bio', e.target.value)}
                                placeholder="Write a short bio about yourself..."
                                className={`w-full p-3 bg-gray-50/50 border ${errors.bio ? 'border-red-500' : 'border-gray-200'} rounded-md text-sm focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none`}
                            ></textarea>
                            {errors.bio && <p className="text-red-500 text-[11px] mt-1">{errors.bio}</p>}
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button 
                            type="button"
                            onClick={() => reset()}
                            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={processing}
                            className="flex items-center justify-center gap-2 px-6 py-2 text-sm font-semibold text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed min-w-[120px]"
                        >
                            {processing && <Loader2 size={16} className="animate-spin" />}
                            Save Profile
                        </button>
                    </div>
                </form>
            </div>
        </SettingsLayout>
    );
}
