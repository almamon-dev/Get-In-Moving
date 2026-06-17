import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Home, ChevronLeft, Mail, Phone, Building2, Calendar,
    Check, X, Shield, AlertCircle, Trash2, FileText, Download,
    User, CreditCard, Settings, FileCheck
} from 'lucide-react';
import Modal from '@/Components/Modal';

export default function Show({ auth, supplier }) {
    const [activeTab, setActiveTab] = useState('general');
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', action: null });
    const [successModal, setSuccessModal] = useState({ isOpen: false, title: '', message: '' });

    const tabs = [
        { id: 'general', label: 'General', icon: <User size={18} /> },
        { id: 'verification', label: 'Verification', icon: <Check size={18} /> },
        { id: 'compliance', label: 'Compliance & Docs', icon: <FileCheck size={18} /> },
        { id: 'subscription', label: 'Subscription', icon: <CreditCard size={18} /> },
        { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
    ];
    const toggleVerification = () => {
        setConfirmModal({
            isOpen: true,
            title: supplier.is_verified ? 'Unverify Supplier' : 'Verify Supplier',
            message: `Are you sure you want to ${supplier.is_verified ? 'unverify' : 'verify'} this supplier?`,
            action: () => {
                router.patch(route('admin.suppliers.verification', supplier.id), {
                    is_verified: !supplier.is_verified,
                }, {
                    onSuccess: () => {
                        setConfirmModal({ isOpen: false, title: '', message: '', action: null });
                        setSuccessModal({
                            isOpen: true,
                            title: 'Success!',
                            message: `Supplier account has been successfully ${supplier.is_verified ? 'unverified' : 'verified'}.`
                        });
                    }
                });
            }
        });
    };

    const toggleCompliance = () => {
        setConfirmModal({
            isOpen: true,
            title: supplier.is_compliance_verified ? 'Revoke Compliance' : 'Approve Compliance',
            message: `Are you sure you want to ${supplier.is_compliance_verified ? 'revoke' : 'approve'} compliance for this supplier?`,
            action: () => {
                router.patch(route('admin.suppliers.compliance', supplier.id), {
                    is_compliance_verified: !supplier.is_compliance_verified,
                }, {
                    onSuccess: () => {
                        setConfirmModal({ isOpen: false, title: '', message: '', action: null });
                        setSuccessModal({
                            isOpen: true,
                            title: 'Success!',
                            message: `Supplier compliance has been successfully ${supplier.is_compliance_verified ? 'revoked' : 'approved'}.`
                        });
                    }
                });
            }
        });
    };

    const toggleAutoRenew = () => {
        if (!supplier.user_subscription) return;
        setConfirmModal({
            isOpen: true,
            title: supplier.user_subscription.auto_renew ? 'Disable Auto Renew' : 'Enable Auto Renew',
            message: `Are you sure you want to ${supplier.user_subscription.auto_renew ? 'disable' : 'enable'} auto-renewal for this supplier?`,
            action: () => {
                router.patch(route('admin.suppliers.auto-renew', supplier.id), {
                    auto_renew: !supplier.user_subscription.auto_renew,
                }, {
                    onSuccess: () => {
                        setConfirmModal({ isOpen: false, title: '', message: '', action: null });
                        setSuccessModal({
                            isOpen: true,
                            title: 'Success!',
                            message: `Auto-renewal has been successfully ${supplier.user_subscription.auto_renew ? 'disabled' : 'enabled'}.`
                        });
                    }
                });
            }
        });
    };

    const handleDelete = () => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Supplier',
            message: 'Are you sure you want to delete this supplier? This action cannot be undone.',
            action: () => {
                router.delete(route('admin.suppliers.destroy', supplier.id));
            }
        });
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
                <div className="flex flex-col lg:flex-row gap-6">

                    {/* Left Sidebar - Tabs */}
                    <div className="w-full lg:w-[280px] shrink-0">
                        <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm overflow-hidden flex flex-col py-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-3 px-5 py-4 text-[14px] font-bold transition-colors border-l-4 ${activeTab === tab.id
                                        ? 'border-[#673ab7] bg-[#f8f6ff] text-[#673ab7]'
                                        : 'border-transparent text-[#727586] hover:bg-[#f8f9fa] hover:text-[#2f3344]'
                                        }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Content Area */}
                    <div className="flex-1 space-y-6">

                        {/* Tab Content: General */}
                        {activeTab === 'general' && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                                    <div className="p-6 flex flex-col items-center border-b border-[#e3e4e8]">
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#2c8af8] to-[#1a7ae8] flex items-center justify-center text-white font-bold text-[36px] mb-4">
                                            {supplier.name.charAt(0).toUpperCase()}
                                        </div>
                                        <h3 className="text-[18px] font-bold text-[#2f3344] text-center mb-1">{supplier.name}</h3>
                                        <span className="px-3 py-1 border border-purple-200 bg-purple-50 text-purple-700 rounded-full text-[11px] font-bold uppercase tracking-wide mb-4">
                                            Supplier
                                        </span>
                                        <div className="flex gap-2 flex-wrap justify-center">
                                            {supplier.is_verified ? (
                                                <span className="px-2.5 py-1.5 border border-green-200 bg-green-50 text-green-700 rounded-full flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide" title="Verified">
                                                    <Check size={14} /> Verified
                                                </span>
                                            ) : (
                                                <span className="px-2.5 py-1.5 border border-orange-200 bg-orange-50 text-orange-700 rounded-full flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide" title="Unverified">
                                                    <AlertCircle size={14} /> Unverified
                                                </span>
                                            )}
                                            {supplier.is_compliance_verified ? (
                                                <span className="px-2.5 py-1.5 border border-blue-200 bg-blue-50 text-blue-700 rounded-full flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide" title="Compliance Approved">
                                                    <Shield size={14} /> Approved
                                                </span>
                                            ) : (
                                                <span className="px-2.5 py-1.5 border border-yellow-200 bg-yellow-50 text-yellow-700 rounded-full flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide" title="Pending Review">
                                                    <AlertCircle size={14} /> Pending
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div>
                                            <p className="text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">Email Address</p>
                                            <div className="flex items-center gap-2 text-[#2f3344]">
                                                <Mail size={14} className="text-[#a0a3af]" />
                                                <p className="text-[13px] font-bold truncate">{supplier.email}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">Phone Number</p>
                                            <div className="flex items-center gap-2 text-[#2f3344]">
                                                <Phone size={14} className="text-[#a0a3af]" />
                                                <p className="text-[13px] font-bold">{supplier.phone_number}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">Company</p>
                                            <div className="flex items-center gap-2 text-[#2f3344]">
                                                <Building2 size={14} className="text-[#a0a3af]" />
                                                <p className="text-[13px] font-bold">{supplier.company_name}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">Joined Date</p>
                                            <div className="flex items-center gap-2 text-[#2f3344]">
                                                <Calendar size={14} className="text-[#a0a3af]" />
                                                <p className="text-[13px] font-bold">
                                                    {new Date(supplier.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Account Stats */}
                                <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                                    <div className="px-6 py-4 border-b border-[#e3e4e8]">
                                        <h2 className="text-[15px] font-bold text-[#2f3344]">Account Stats</h2>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[12px] text-[#727586]">Verification Status</span>
                                            <span className={`px-2.5 py-0.5 border rounded-full text-[11px] font-bold uppercase tracking-wide ${supplier.is_verified ? 'border-green-200 bg-green-50 text-green-700' : 'border-orange-200 bg-orange-50 text-orange-700'}`}>
                                                {supplier.is_verified ? 'Verified' : 'Pending'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[12px] text-[#727586]">Compliance Status</span>
                                            <span className={`px-2.5 py-0.5 border rounded-full text-[11px] font-bold uppercase tracking-wide ${supplier.is_compliance_verified ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-yellow-200 bg-yellow-50 text-yellow-700'}`}>
                                                {supplier.is_compliance_verified ? 'Approved' : 'Pending'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab Content: Compliance */}
                        {activeTab === 'compliance' && (
                            <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-[#e3e4e8]">
                                    <h2 className="text-[15px] font-bold text-[#2f3344]">Insurance & Compliance</h2>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                                    <div className="mt-5 pt-5 border-t border-[#e3e4e8]">
                                        <h3 className="text-[14px] font-bold text-[#2f3344] mb-3">Documents</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                            {/* Insurance Document */}
                                            {supplier?.insurance_document ? (
                                                <a
                                                    href={supplier.insurance_document}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-3 p-4 bg-[#f8f9fa] rounded-[8px] hover:bg-[#e9ecef] transition-all duration-200"
                                                >
                                                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#673ab7]">
                                                        <FileText size={20} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-[13px] font-bold text-[#2f3344]">
                                                            Insurance Document
                                                        </p>
                                                        <p className="text-[12px] text-[#727586]">
                                                            Click to view
                                                        </p>
                                                    </div>
                                                    <Download size={18} className="text-[#727586]" />
                                                </a>
                                            ) : (
                                                <div className="p-4 bg-[#f8f9fa] rounded-[8px] text-[13px] text-[#727586]">
                                                    No Insurance Document
                                                </div>
                                            )}

                                            {/* License Document */}
                                            {supplier?.license_document ? (
                                                <a
                                                    href={supplier.license_document}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-3 p-4 bg-[#f8f9fa] rounded-[8px] hover:bg-[#e9ecef] transition-all duration-200"
                                                >
                                                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#673ab7]">
                                                        <FileText size={20} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-[13px] font-bold text-[#2f3344]">
                                                            License Document
                                                        </p>
                                                        <p className="text-[12px] text-[#727586]">
                                                            Click to view
                                                        </p>
                                                    </div>
                                                    <Download size={18} className="text-[#727586]" />
                                                </a>
                                            ) : (
                                                <div className="p-4 bg-[#f8f9fa] rounded-[8px] text-[13px] text-[#727586]">
                                                    No License Document
                                                </div>
                                            )}

                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab Content: Verification */}
                        {activeTab === 'verification' && (
                            <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-[#e3e4e8]">
                                    <h2 className="text-[15px] font-bold text-[#2f3344]">Verification Details</h2>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                                                {supplier.is_verified ? (
                                                    <>
                                                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                                            <Check size={14} strokeWidth={3} />
                                                        </div>
                                                        <span className="text-[14px] text-[#2f3344] font-bold">
                                                            {supplier.verified_at ? new Date(supplier.verified_at).toLocaleDateString() : 'Verified'}
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
                                                {supplier.is_compliance_verified ? (
                                                    <>
                                                        <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                            <Shield size={14} strokeWidth={3} />
                                                        </div>
                                                        <span className="text-[14px] text-[#2f3344] font-bold">
                                                            {supplier.compliance_verified_at ? new Date(supplier.compliance_verified_at).toLocaleDateString() : 'Approved'}
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
                        )}

                        {/* Tab Content: Subscription */}
                        {activeTab === 'subscription' && (
                            <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-[#e3e4e8] flex justify-between items-center">
                                    <h2 className="text-[15px] font-bold text-[#2f3344]">Subscription Details</h2>
                                </div>
                                <div className="p-6">
                                    {supplier.user_subscription ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div>
                                                <p className="text-[13px] text-[#727586] font-medium mb-2">Plan Name</p>
                                                <p className="text-[14px] text-[#2f3344] font-bold">{supplier.user_subscription.pricing_plan?.name || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[13px] text-[#727586] font-medium mb-2">Status</p>
                                                <span className={`px-2.5 py-1 border rounded-full text-[11px] font-bold uppercase tracking-wide inline-block ${supplier.user_subscription.status === 'active'
                                                    ? 'border-green-200 bg-green-50 text-green-700'
                                                    : supplier.user_subscription.status === 'pending_payment'
                                                        ? 'border-orange-200 bg-orange-50 text-orange-700'
                                                        : 'border-red-200 bg-red-50 text-red-700'
                                                    }`}>
                                                    {supplier.user_subscription.status.replace('_', ' ')}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-[13px] text-[#727586] font-medium mb-2">Started At</p>
                                                <p className="text-[14px] text-[#2f3344] font-bold">
                                                    {supplier.user_subscription.started_at ? new Date(supplier.user_subscription.started_at).toLocaleDateString() : 'N/A'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[13px] text-[#727586] font-medium mb-2">Expires At</p>
                                                <p className="text-[14px] text-[#2f3344] font-bold">
                                                    {supplier.user_subscription.expires_at ? new Date(supplier.user_subscription.expires_at).toLocaleDateString() : 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-10">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <CreditCard size={24} className="text-[#a0a3af]" />
                                            </div>
                                            <h3 className="text-[16px] font-bold text-[#2f3344] mb-2">No Active Subscription</h3>
                                            <p className="text-[13px] text-[#727586]">This supplier does not have an active subscription plan.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Tab Content: Settings */}
                        {activeTab === 'settings' && (
                            <div className="space-y-6">
                                {/* Quick Actions (Configuration) */}
                                <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                                    <div className="px-6 py-4 border-b border-[#e3e4e8]">
                                        <h2 className="text-[15px] font-bold text-[#2f3344]">Configuration</h2>
                                    </div>
                                    <div className="p-0">
                                        {/* Account Verification */}
                                        <div className="flex flex-col p-5 hover:bg-[#f8f9fa] transition-colors border-b border-[#f1f2f4]">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Check size={16} className={supplier.is_verified ? 'text-green-600' : 'text-[#a0a3af]'} />
                                                    <p className="text-[13px] font-bold text-[#2f3344]">Account Access</p>
                                                </div>
                                                <button
                                                    onClick={toggleVerification}
                                                    className={`w-9 h-5 rounded-full transition-colors flex items-center px-1 ${supplier.is_verified ? 'bg-[#00b090]' : 'bg-[#e3e4e8]'}`}
                                                >
                                                    <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${supplier.is_verified ? 'translate-x-3.5' : 'translate-x-0'}`} />
                                                </button>
                                            </div>
                                            <p className="text-[11px] text-[#727586]">Allow user to login and use platform</p>
                                        </div>

                                        {/* Compliance Status */}
                                        <div className="flex flex-col p-5 hover:bg-[#f8f9fa] transition-colors border-b border-[#f1f2f4]">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Shield size={16} className={supplier.is_compliance_verified ? 'text-blue-600' : 'text-[#a0a3af]'} />
                                                    <p className="text-[13px] font-bold text-[#2f3344]">Compliance</p>
                                                </div>
                                                <button
                                                    onClick={toggleCompliance}
                                                    className={`w-9 h-5 rounded-full transition-colors flex items-center px-1 ${supplier.is_compliance_verified ? 'bg-[#00b090]' : 'bg-[#e3e4e8]'}`}
                                                >
                                                    <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${supplier.is_compliance_verified ? 'translate-x-3.5' : 'translate-x-0'}`} />
                                                </button>
                                            </div>
                                            <p className="text-[11px] text-[#727586]">Approve provided legal documents</p>
                                        </div>

                                        {/* Auto Renew System */}
                                        <div className={`flex flex-col p-5 transition-colors ${supplier.user_subscription ? 'hover:bg-[#f8f9fa]' : 'opacity-50'}`}>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className={supplier.user_subscription?.auto_renew ? 'text-purple-600' : 'text-[#a0a3af]'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 21v-5h5" /></svg>
                                                    <p className="text-[13px] font-bold text-[#2f3344]">Auto Renewal</p>
                                                </div>
                                                <button
                                                    onClick={toggleAutoRenew}
                                                    disabled={!supplier.user_subscription}
                                                    className={`w-9 h-5 rounded-full transition-colors flex items-center px-1 ${supplier.user_subscription?.auto_renew ? 'bg-[#673ab7]' : 'bg-[#e3e4e8]'}`}
                                                >
                                                    <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${supplier.user_subscription?.auto_renew ? 'translate-x-3.5' : 'translate-x-0'}`} />
                                                </button>
                                            </div>
                                            <p className="text-[11px] text-[#727586]">Automatically charge card upon expiry</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Danger Zone */}
                                <div className="bg-white rounded-[12px] border border-red-200 shadow-sm overflow-hidden mt-5">
                                    <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <h2 className="text-[14px] font-bold text-red-600 flex items-center gap-2 mb-1">
                                                <AlertCircle size={16} />
                                                Danger Zone
                                            </h2>
                                            <p className="text-[12px] text-[#727586]">
                                                Once you delete a supplier, there is no going back. Please be certain.
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleDelete}
                                            className="shrink-0 px-4 h-[36px] bg-red-50 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white rounded-[8px] font-bold text-[12px] transition-all flex items-center justify-center gap-2"
                                        >
                                            <Trash2 size={14} />
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            <Modal show={confirmModal.isOpen} onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })} maxWidth="md">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                            <AlertCircle size={20} />
                        </div>
                        <h2 className="text-[18px] font-bold text-[#2f3344]">{confirmModal.title}</h2>
                    </div>
                    <p className="text-[14px] text-[#727586] mb-6">{confirmModal.message}</p>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                            className="px-4 py-2 text-[13px] font-bold text-[#727586] hover:bg-[#f8f9fa] rounded-[8px] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmModal.action}
                            className="px-4 py-2 text-[13px] font-bold text-white bg-[#673ab7] hover:bg-[#5e35b1] rounded-[8px] transition-colors"
                        >
                            Confirm Action
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Success Modal */}
            <Modal show={successModal.isOpen} onClose={() => setSuccessModal({ ...successModal, isOpen: false })} maxWidth="sm">
                <div className="p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 mx-auto mb-4">
                        <Check size={32} strokeWidth={3} />
                    </div>
                    <h2 className="text-[20px] font-bold text-[#2f3344] mb-2">{successModal.title}</h2>
                    <p className="text-[14px] text-[#727586] mb-6">{successModal.message}</p>
                    <button
                        onClick={() => setSuccessModal({ ...successModal, isOpen: false })}
                        className="w-full py-2.5 text-[14px] font-bold text-white bg-[#00b090] hover:bg-[#009b7f] rounded-[8px] transition-colors"
                    >
                        Awesome!
                    </button>
                </div>
            </Modal>
        </AdminLayout>
    );
}
