import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Home, ChevronLeft, Check, Shield, User as UserIcon, Lock } from 'lucide-react';

export default function Edit({ user, roles, permissions }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        roles: user.roles.map(r => r.name) || [],
        permissions: user.permissions.map(p => p.name) || [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.users.update', user.id));
    };

    const toggleRole = (roleName) => {
        let newRoles = [...data.roles];
        if (newRoles.includes(roleName)) {
            newRoles = newRoles.filter(r => r !== roleName);
        } else {
            newRoles.push(roleName);
        }
        setData('roles', newRoles);
    };

    const togglePermission = (permissionName) => {
        let newPermissions = [...data.permissions];
        if (newPermissions.includes(permissionName)) {
            newPermissions = newPermissions.filter(p => p !== permissionName);
        } else {
            newPermissions.push(permissionName);
        }
        setData('permissions', newPermissions);
    };

    return (
        <AdminLayout>
            <Head title="Edit User" />

            <div className="space-y-6 max-w-[1240px] mx-auto pb-20">
                {/* Header & Breadcrumb */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-[24px] font-bold text-[#2f3344] tracking-tight">Users</h1>
                        <div className="flex items-center gap-2 text-[13px] text-[#727586] mt-1">
                            <Home size={16} />
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Account</span>
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Edit User</span>
                        </div>
                    </div>
                    <Link
                        href={route('admin.users.index')}
                        className="flex items-center gap-2 text-[#673ab7] hover:underline font-bold text-[14px]"
                    >
                        <ChevronLeft size={18} />
                        Back to list
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info Card */}
                    <div className="bg-white rounded-[10px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                        <div className="px-7 py-5 border-b border-[#e3e4e8]">
                            <h2 className="text-[18px] font-bold text-[#2f3344]">User Settings</h2>
                        </div>

                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                {/* Name */}
                                <div className="space-y-2">
                                    <label className="text-[14px] font-bold text-[#2f3344]">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className={`w-full h-[45px] px-4 bg-[#f1f3f5] border ${errors.name ? 'border-red-500' : 'border-[#e3e4e8]'} rounded-[6px] text-[14px] text-[#2f3344] focus:outline-none focus:border-[#673ab7] transition-all`}
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>}
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="text-[14px] font-bold text-[#2f3344]">
                                        Email Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className={`w-full h-[45px] px-4 bg-[#f1f3f5] border ${errors.email ? 'border-red-500' : 'border-[#e3e4e8]'} rounded-[6px] text-[14px] text-[#2f3344] focus:outline-none focus:border-[#673ab7] transition-all`}
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Roles Assignment */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white rounded-[10px] border border-[#e3e4e8] shadow-sm overflow-hidden h-full">
                                <div className="px-7 py-5 border-b border-[#e3e4e8] flex items-center gap-2">
                                    <Shield size={18} className="text-[#673ab7]" />
                                    <h2 className="text-[16px] font-bold text-[#2f3344]">Assign Roles</h2>
                                </div>
                                <div className="p-6 space-y-4">
                                    {roles.map((role) => (
                                        <div 
                                            key={role.id}
                                            className="flex items-center gap-3 group cursor-pointer"
                                            onClick={() => toggleRole(role.name)}
                                        >
                                            <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center
                                                ${data.roles.includes(role.name) 
                                                    ? 'bg-[#673ab7] border-[#673ab7]' 
                                                    : 'bg-white border-[#e3e4e8] group-hover:border-[#673ab7]'}`}
                                            >
                                                {data.roles.includes(role.name) && <Check size={14} className="text-white" />}
                                            </div>
                                            <span className="text-[14px] text-[#2f3344] font-medium">{role.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Direct Permissions Assignment */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-[10px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                                <div className="px-7 py-5 border-b border-[#e3e4e8] flex items-center gap-2">
                                    <Lock size={18} className="text-[#673ab7]" />
                                    <h2 className="text-[16px] font-bold text-[#2f3344]">Direct Permissions</h2>
                                    <span className="text-[12px] text-[#727586] font-normal ml-2">(Override role permissions)</span>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {Object.entries(permissions).map(([category, categoryPerms]) => (
                                            <div key={category} className="space-y-3">
                                                <h3 className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider border-b pb-1 border-[#f1f2f4]">
                                                    {category || 'General'}
                                                </h3>
                                                <div className="space-y-2">
                                                    {categoryPerms.map((perm) => (
                                                        <div 
                                                            key={perm.id}
                                                            className="flex items-start gap-3 group cursor-pointer"
                                                            onClick={() => togglePermission(perm.name)}
                                                        >
                                                            <div className={`mt-0.5 w-4 h-4 rounded border transition-all flex items-center justify-center
                                                                ${data.permissions.includes(perm.name) 
                                                                    ? 'bg-[#673ab7] border-[#673ab7]' 
                                                                    : 'bg-white border-[#e3e4e8] group-hover:border-[#673ab7]'}`}
                                                            >
                                                                {data.permissions.includes(perm.name) && <Check size={12} className="text-white" />}
                                                            </div>
                                                            <span className="text-[13px] text-[#2f3344] font-medium">{perm.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button - Bottom Right Blue */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-[#2c8af8] text-white px-[50px] py-[13px] rounded-[6px] font-bold text-[15px] hover:bg-[#1a7ae8] transition-all shadow-md active:scale-[0.98] disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Update User Account'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
