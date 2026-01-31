import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Home, ChevronLeft, Mail, Phone, Building2, Calendar, 
    Check, X, Shield, AlertCircle, Trash2 
} from 'lucide-react';

export default function Show({ auth, customer }) {
    const toggleVerification = () => {
        if (confirm(`Are you sure you want to ${customer.is_verified ? 'unverify' : 'verify'} this customer?`)) {
            router.patch(route('admin.customers.verification', customer.id), {
                is_verified: !customer.is_verified,
            });
        }
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
            router.delete(route('admin.customers.destroy', customer.id));
        }
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title={`Customer - ${customer.name}`} />

            <div className="space-y-6 max-w-8xl mx-auto pb-20">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-[24px] font-bold text-[#2f3344] tracking-tight">
                            Customer Details
                        </h1>
                        <div className="flex items-center gap-2 text-[13px] text-[#727586] mt-1">
                            <Home size={16} className="text-[#727586]" />
                            <span className="text-[#c3c4ca]">-</span>
                            <Link href={route('admin.customers.index')} className="hover:text-[#673ab7]">
                                Customers
                            </Link>
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Details</span>
                        </div>
                    </div>
                    <Link
                        href={route('admin.customers.index')}
                        className="flex items-center gap-2 text-[#673ab7] hover:underline font-bold text-[14px]"
                    >
                        <ChevronLeft size={18} />
                        Back to list
                    </Link>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Customer Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Profile Card */}
                        <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                            <div className="px-7 py-5 border-b border-[#e3e4e8]">
                                <h2 className="text-[18px] font-bold text-[#2f3344]">Profile Information</h2>
                            </div>
                            <div className="p-7">
                                <div className="flex items-start gap-6">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#673ab7] to-[#9c27b0] flex items-center justify-center text-white font-bold text-[32px]">
                                        {customer.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-[24px] font-bold text-[#2f3344] mb-2">{customer.name}</h3>
                                        <div className="flex items-center gap-3 mb-4">
                                            {customer.is_verified ? (
                                                <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[13px] font-bold flex items-center gap-1.5">
                                                    <Check size={14} />
                                                    Verified
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[13px] font-bold flex items-center gap-1.5">
                                                    <AlertCircle size={14} />
                                                    Unverified
                                                </span>
                                            )}
                                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[13px] font-bold">
                                                Customer
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-[#f8f9fa] flex items-center justify-center text-[#673ab7]">
                                                    <Mail size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-[12px] text-[#727586] font-medium">Email</p>
                                                    <p className="text-[14px] text-[#2f3344] font-bold">{customer.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-[#f8f9fa] flex items-center justify-center text-[#673ab7]">
                                                    <Phone size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-[12px] text-[#727586] font-medium">Phone</p>
                                                    <p className="text-[14px] text-[#2f3344] font-bold">{customer.phone_number || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-[#f8f9fa] flex items-center justify-center text-[#673ab7]">
                                                    <Building2 size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-[12px] text-[#727586] font-medium">Company</p>
                                                    <p className="text-[14px] text-[#2f3344] font-bold">{customer.company_name || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-[#f8f9fa] flex items-center justify-center text-[#673ab7]">
                                                    <Calendar size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-[12px] text-[#727586] font-medium">Joined</p>
                                                    <p className="text-[14px] text-[#2f3344] font-bold">
                                                        {new Date(customer.created_at).toLocaleDateString('en-US', { 
                                                            year: 'numeric', 
                                                            month: 'long', 
                                                            day: 'numeric' 
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Verification Details */}
                        <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                            <div className="px-7 py-5 border-b border-[#e3e4e8]">
                                <h2 className="text-[18px] font-bold text-[#2f3344]">Verification Details</h2>
                            </div>
                            <div className="p-7">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-[13px] text-[#727586] font-medium mb-2">Email Verified</p>
                                        <div className="flex items-center gap-2">
                                            {customer.email_verified_at ? (
                                                <>
                                                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                                        <Check size={14} strokeWidth={3} />
                                                    </div>
                                                    <span className="text-[14px] text-[#2f3344] font-bold">
                                                        {new Date(customer.email_verified_at).toLocaleDateString()}
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                                        <X size={14} strokeWidth={3} />
                                                    </div>
                                                    <span className="text-[14px] text-[#727586]">Not verified</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[13px] text-[#727586] font-medium mb-2">Account Verified</p>
                                        <div className="flex items-center gap-2">
                                            {customer.verified_at ? (
                                                <>
                                                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                                        <Check size={14} strokeWidth={3} />
                                                    </div>
                                                    <span className="text-[14px] text-[#2f3344] font-bold">
                                                        {new Date(customer.verified_at).toLocaleDateString()}
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                                        <X size={14} strokeWidth={3} />
                                                    </div>
                                                    <span className="text-[14px] text-[#727586]">Not verified</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Actions */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                            <div className="px-7 py-5 border-b border-[#e3e4e8]">
                                <h2 className="text-[18px] font-bold text-[#2f3344]">Quick Actions</h2>
                            </div>
                            <div className="p-7 space-y-3">
                                <button
                                    onClick={toggleVerification}
                                    className={`w-full h-[48px] rounded-[8px] font-bold text-[14px] transition-all flex items-center justify-center gap-2 ${
                                        customer.is_verified
                                            ? 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                                    }`}
                                >
                                    {customer.is_verified ? (
                                        <>
                                            <X size={18} />
                                            Unverify Customer
                                        </>
                                    ) : (
                                        <>
                                            <Check size={18} />
                                            Verify Customer
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="w-full h-[48px] bg-red-50 text-red-600 hover:bg-red-100 rounded-[8px] font-bold text-[14px] transition-all flex items-center justify-center gap-2"
                                >
                                    <Trash2 size={18} />
                                    Delete Customer
                                </button>
                            </div>
                        </div>

                        {/* Account Stats */}
                        <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                            <div className="px-7 py-5 border-b border-[#e3e4e8]">
                                <h2 className="text-[18px] font-bold text-[#2f3344]">Account Stats</h2>
                            </div>
                            <div className="p-7 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[13px] text-[#727586]">Account Type</span>
                                    <span className="text-[14px] font-bold text-[#2f3344] capitalize">{customer.user_type}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[13px] text-[#727586]">Status</span>
                                    <span className={`text-[14px] font-bold ${customer.is_verified ? 'text-green-600' : 'text-orange-600'}`}>
                                        {customer.is_verified ? 'Active' : 'Pending'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[13px] text-[#727586]">Member Since</span>
                                    <span className="text-[14px] font-bold text-[#2f3344]">
                                        {new Date(customer.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
