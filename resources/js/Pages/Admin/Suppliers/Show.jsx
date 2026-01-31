import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Home, ChevronLeft, Mail, Phone, Building2, Calendar, 
    Check, X, Shield, AlertCircle, Trash2, FileText, Download 
} from 'lucide-react';

export default function Show({ auth, supplier }) {
    const toggleVerification = () => {
        if (confirm(`Are you sure you want to ${supplier.is_verified ? 'unverify' : 'verify'} this supplier?`)) {
            router.patch(route('admin.suppliers.verification', supplier.id), {
                is_verified: !supplier.is_verified,
            });
        }
    };

    const toggleCompliance = () => {
        if (confirm(`Are you sure you want to ${supplier.is_compliance_verified ? 'revoke' : 'approve'} compliance for this supplier?`)) {
            router.patch(route('admin.suppliers.compliance', supplier.id), {
                is_compliance_verified: !supplier.is_compliance_verified,
            });
        }
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this supplier? This action cannot be undone.')) {
            router.delete(route('admin.suppliers.destroy', supplier.id));
        }
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title={`Supplier - ${supplier.name}`} />

            <div className="space-y-6 max-w-8xl mx-auto pb-20">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-[24px] font-bold text-[#2f3344] tracking-tight">
                            Supplier Details
                        </h1>
                        <div className="flex items-center gap-2 text-[13px] text-[#727586] mt-1">
                            <Home size={16} className="text-[#727586]" />
                            <span className="text-[#c3c4ca]">-</span>
                            <Link href={route('admin.suppliers.index')} className="hover:text-[#673ab7]">
                                Suppliers
                            </Link>
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Details</span>
                        </div>
                    </div>
                    <Link
                        href={route('admin.suppliers.index')}
                        className="flex items-center gap-2 text-[#673ab7] hover:underline font-bold text-[14px]"
                    >
                        <ChevronLeft size={18} />
                        Back to list
                    </Link>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Supplier Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Profile Card */}
                        <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                            <div className="px-7 py-5 border-b border-[#e3e4e8]">
                                <h2 className="text-[18px] font-bold text-[#2f3344]">Profile Information</h2>
                            </div>
                            <div className="p-7">
                                <div className="flex items-start gap-6">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#2c8af8] to-[#1a7ae8] flex items-center justify-center text-white font-bold text-[32px]">
                                        {supplier.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-[24px] font-bold text-[#2f3344] mb-2">{supplier.name}</h3>
                                        <div className="flex items-center gap-3 mb-4 flex-wrap">
                                            {supplier.is_verified ? (
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
                                            {supplier.is_compliance_verified ? (
                                                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[13px] font-bold flex items-center gap-1.5">
                                                    <Shield size={14} />
                                                    Compliance Approved
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 bg-yellow-50 text-yellow-600 rounded-full text-[13px] font-bold flex items-center gap-1.5">
                                                    <AlertCircle size={14} />
                                                    Pending Review
                                                </span>
                                            )}
                                            <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-[13px] font-bold">
                                                Supplier
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-[#f8f9fa] flex items-center justify-center text-[#673ab7]">
                                                    <Mail size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-[12px] text-[#727586] font-medium">Email</p>
                                                    <p className="text-[14px] text-[#2f3344] font-bold">{supplier.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-[#f8f9fa] flex items-center justify-center text-[#673ab7]">
                                                    <Phone size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-[12px] text-[#727586] font-medium">Phone</p>
                                                    <p className="text-[14px] text-[#2f3344] font-bold">{supplier.phone_number}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-[#f8f9fa] flex items-center justify-center text-[#673ab7]">
                                                    <Building2 size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-[12px] text-[#727586] font-medium">Company</p>
                                                    <p className="text-[14px] text-[#2f3344] font-bold">{supplier.company_name}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-[#f8f9fa] flex items-center justify-center text-[#673ab7]">
                                                    <Calendar size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-[12px] text-[#727586] font-medium">Joined</p>
                                                    <p className="text-[14px] text-[#2f3344] font-bold">
                                                        {new Date(supplier.created_at).toLocaleDateString('en-US', { 
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

                        {/* Insurance & Compliance */}
                        <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                            <div className="px-7 py-5 border-b border-[#e3e4e8]">
                                <h2 className="text-[18px] font-bold text-[#2f3344]">Insurance & Compliance</h2>
                            </div>
                            <div className="p-7">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-[13px] text-[#727586] font-medium mb-2">Insurance Type</p>
                                        <p className="text-[14px] text-[#2f3344] font-bold">{supplier.insurance_type}</p>
                                    </div>
                                    <div>
                                        <p className="text-[13px] text-[#727586] font-medium mb-2">Insurance Provider</p>
                                        <p className="text-[14px] text-[#2f3344] font-bold">{supplier.insurance_provider_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-[13px] text-[#727586] font-medium mb-2">Policy Number</p>
                                        <p className="text-[14px] text-[#2f3344] font-bold">{supplier.policy_number}</p>
                                    </div>
                                    <div>
                                        <p className="text-[13px] text-[#727586] font-medium mb-2">Policy Expiry</p>
                                        <p className="text-[14px] text-[#2f3344] font-bold">
                                            {new Date(supplier.policy_expiry_date).toLocaleDateString('en-US', { 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {/* Documents */}
                                <div className="mt-6 pt-6 border-t border-[#e3e4e8]">
                                    <h3 className="text-[16px] font-bold text-[#2f3344] mb-4">Documents</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {supplier.insurance_document && (
                                            <a
                                                href={`/storage/${supplier.insurance_document}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 p-4 bg-[#f8f9fa] rounded-[8px] hover:bg-[#e9ecef] transition-all"
                                            >
                                                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#673ab7]">
                                                    <FileText size={20} />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-[13px] font-bold text-[#2f3344]">Insurance Document</p>
                                                    <p className="text-[12px] text-[#727586]">Click to view</p>
                                                </div>
                                                <Download size={18} className="text-[#727586]" />
                                            </a>
                                        )}
                                        {supplier.license_document && (
                                            <a
                                                href={`/storage/${supplier.license_document}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 p-4 bg-[#f8f9fa] rounded-[8px] hover:bg-[#e9ecef] transition-all"
                                            >
                                                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#673ab7]">
                                                    <FileText size={20} />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-[13px] font-bold text-[#2f3344]">License Document</p>
                                                    <p className="text-[12px] text-[#727586]">Click to view</p>
                                                </div>
                                                <Download size={18} className="text-[#727586]" />
                                            </a>
                                        )}
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
                                            {supplier.email_verified_at ? (
                                                <>
                                                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                                        <Check size={14} strokeWidth={3} />
                                                    </div>
                                                    <span className="text-[14px] text-[#2f3344] font-bold">
                                                        {new Date(supplier.email_verified_at).toLocaleDateString()}
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
                                            {supplier.verified_at ? (
                                                <>
                                                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                                        <Check size={14} strokeWidth={3} />
                                                    </div>
                                                    <span className="text-[14px] text-[#2f3344] font-bold">
                                                        {new Date(supplier.verified_at).toLocaleDateString()}
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
                                        <p className="text-[13px] text-[#727586] font-medium mb-2">Compliance Verified</p>
                                        <div className="flex items-center gap-2">
                                            {supplier.compliance_verified_at ? (
                                                <>
                                                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                        <Shield size={14} strokeWidth={3} />
                                                    </div>
                                                    <span className="text-[14px] text-[#2f3344] font-bold">
                                                        {new Date(supplier.compliance_verified_at).toLocaleDateString()}
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                                                        <X size={14} strokeWidth={3} />
                                                    </div>
                                                    <span className="text-[14px] text-[#727586]">Pending review</span>
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
                                    onClick={toggleCompliance}
                                    className={`w-full h-[48px] rounded-[8px] font-bold text-[14px] transition-all flex items-center justify-center gap-2 ${
                                        supplier.is_compliance_verified
                                            ? 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                    }`}
                                >
                                    {supplier.is_compliance_verified ? (
                                        <>
                                            <X size={18} />
                                            Revoke Compliance
                                        </>
                                    ) : (
                                        <>
                                            <Shield size={18} />
                                            Approve Compliance
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={toggleVerification}
                                    className={`w-full h-[48px] rounded-[8px] font-bold text-[14px] transition-all flex items-center justify-center gap-2 ${
                                        supplier.is_verified
                                            ? 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                                    }`}
                                >
                                    {supplier.is_verified ? (
                                        <>
                                            <X size={18} />
                                            Unverify Supplier
                                        </>
                                    ) : (
                                        <>
                                            <Check size={18} />
                                            Verify Supplier
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="w-full h-[48px] bg-red-50 text-red-600 hover:bg-red-100 rounded-[8px] font-bold text-[14px] transition-all flex items-center justify-center gap-2"
                                >
                                    <Trash2 size={18} />
                                    Delete Supplier
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
                                    <span className="text-[14px] font-bold text-[#2f3344] capitalize">{supplier.user_type}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[13px] text-[#727586]">Verification Status</span>
                                    <span className={`text-[14px] font-bold ${supplier.is_verified ? 'text-green-600' : 'text-orange-600'}`}>
                                        {supplier.is_verified ? 'Verified' : 'Pending'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[13px] text-[#727586]">Compliance Status</span>
                                    <span className={`text-[14px] font-bold ${supplier.is_compliance_verified ? 'text-blue-600' : 'text-yellow-600'}`}>
                                        {supplier.is_compliance_verified ? 'Approved' : 'Pending'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[13px] text-[#727586]">Member Since</span>
                                    <span className="text-[14px] font-bold text-[#2f3344]">
                                        {new Date(supplier.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
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
