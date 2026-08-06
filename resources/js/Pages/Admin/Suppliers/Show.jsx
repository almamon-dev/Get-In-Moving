import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Home, ChevronLeft, Mail, Phone, Building2, Calendar,
    Check, X, Shield, AlertCircle, Trash2, FileText, Download,
    User, CreditCard, Award, FileCheck, CheckCircle2, XCircle
} from 'lucide-react';
import Modal from '@/Components/Modal';

export default function Show({ auth, supplier }) {
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', action: null });
    const [successModal, setSuccessModal] = useState({ isOpen: false, title: '', message: '' });

    const toggleVerification = () => {
        const nextState = !supplier.is_verified;
        setConfirmModal({
            isOpen: true,
            title: nextState ? 'Verify Supplier' : 'Unverify Supplier',
            message: `Are you sure you want to ${nextState ? 'verify' : 'unverify'} ${supplier.name}?`,
            action: () => {
                router.patch(route('admin.suppliers.verification', supplier.id), {
                    is_verified: nextState,
                }, {
                    preserveScroll: true,
                    onSuccess: () => {
                        setConfirmModal({ isOpen: false, title: '', message: '', action: null });
                        setSuccessModal({ isOpen: true, title: 'Success!', message: `Supplier verification has been updated.` });
                    }
                });
            }
        });
    };

    const toggleCompliance = () => {
        const nextState = !supplier.is_compliance_verified;
        setConfirmModal({
            isOpen: true,
            title: nextState ? 'Approve Compliance' : 'Revoke Compliance',
            message: `Are you sure you want to ${nextState ? 'approve' : 'revoke'} compliance for ${supplier.name}?`,
            action: () => {
                router.patch(route('admin.suppliers.compliance', supplier.id), {
                    is_compliance_verified: nextState,
                }, {
                    preserveScroll: true,
                    onSuccess: () => {
                        setConfirmModal({ isOpen: false, title: '', message: '', action: null });
                        setSuccessModal({ isOpen: true, title: 'Success!', message: `Supplier compliance has been updated.` });
                    }
                });
            }
        });
    };

    const toggleAutoRenew = () => {
        if (!supplier.user_subscription) return;
        const nextState = !supplier.user_subscription.auto_renew;
        setConfirmModal({
            isOpen: true,
            title: nextState ? 'Enable Auto Renewal' : 'Disable Auto Renewal',
            message: `Are you sure you want to ${nextState ? 'enable' : 'disable'} auto-renewal for this supplier?`,
            action: () => {
                router.patch(route('admin.suppliers.auto-renew', supplier.id), {
                    auto_renew: nextState,
                }, {
                    preserveScroll: true,
                    onSuccess: () => {
                        setConfirmModal({ isOpen: false, title: '', message: '', action: null });
                        setSuccessModal({ isOpen: true, title: 'Success!', message: `Auto renewal status updated.` });
                    }
                });
            }
        });
    };

    const handleDelete = () => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Supplier',
            message: `Are you sure you want to delete ${supplier.name}? This action cannot be undone.`,
            action: () => router.delete(route('admin.suppliers.destroy', supplier.id))
        });
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title={`Supplier - ${supplier.name}`} />

            <div className="space-y-6 w-full mx-auto px-6 py-8 pb-20">
                
                {/* Header Row matching Index.jsx */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-[13px] text-[#727586] mb-1">
                            <Home size={16} className="text-[#727586]" />
                            <span className="text-[#c3c4ca]">-</span>
                            <Link href={route('admin.suppliers.index')} className="hover:text-[#673ab7]">
                                Suppliers
                            </Link>
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Details</span>
                        </div>
                        <h1 className="text-[24px] font-bold text-[#111827] tracking-tight">Supplier Profile</h1>
                    </div>
                    <Link
                        href={route('admin.suppliers.index')}
                        className="flex items-center gap-2 text-[#673ab7] hover:underline font-bold text-[14px]"
                    >
                        <ChevronLeft size={18} />
                        Back to list
                    </Link>
                </div>

                {/* Main Profile Summary Card */}
                <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm overflow-hidden p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2c8af8] to-[#1a7ae8] flex items-center justify-center text-white font-bold text-[24px] shrink-0">
                            {supplier.name?.charAt(0)?.toUpperCase() || 'S'}
                        </div>
                        <div>
                            <div className="flex items-center gap-3 flex-wrap">
                                <h2 className="text-[20px] font-bold text-[#2f3344]">{supplier.name}</h2>
                                <span className="px-3 py-1 border border-purple-200 bg-purple-50 text-purple-700 rounded-full text-[11px] font-bold uppercase tracking-wide">
                                    Supplier
                                </span>
                                {supplier.is_verified ? (
                                    <span className="px-2.5 py-1 border border-green-200 bg-green-50 text-green-700 rounded-full flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide">
                                        <Check size={14} /> Verified
                                    </span>
                                ) : (
                                    <span className="px-2.5 py-1 border border-orange-200 bg-orange-50 text-orange-700 rounded-full flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide">
                                        <AlertCircle size={14} /> Unverified
                                    </span>
                                )}
                                {supplier.is_compliance_verified ? (
                                    <span className="px-2.5 py-1 border border-blue-200 bg-blue-50 text-blue-700 rounded-full flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide">
                                        <Shield size={14} /> Compliance Approved
                                    </span>
                                ) : (
                                    <span className="px-2.5 py-1 border border-yellow-200 bg-yellow-50 text-yellow-700 rounded-full flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide">
                                        <AlertCircle size={14} /> Pending Review
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-4 text-[13px] text-[#727586] mt-1 flex-wrap">
                                <span>ID: <strong className="text-[#2f3344]">#{supplier.id}</strong></span>
                                <span>•</span>
                                <span className="flex items-center gap-1.5">
                                    <Mail size={14} className="text-[#a0a3af]" />
                                    {supplier.email}
                                </span>
                                {supplier.phone_number && (
                                    <>
                                        <span>•</span>
                                        <span className="flex items-center gap-1.5">
                                            <Phone size={14} className="text-[#a0a3af]" />
                                            {supplier.phone_number}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap shrink-0">
                        <button
                            onClick={toggleCompliance}
                            className={`px-4 h-[36px] rounded-[8px] font-bold text-[13px] transition-colors flex items-center gap-2 ${
                                supplier.is_compliance_verified
                                    ? 'bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100'
                                    : 'bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100'
                            }`}
                        >
                            <Shield size={15} />
                            {supplier.is_compliance_verified ? 'Revoke Compliance' : 'Approve Compliance'}
                        </button>
                        <button
                            onClick={toggleVerification}
                            className={`px-4 h-[36px] rounded-[8px] font-bold text-[13px] transition-colors flex items-center gap-2 ${
                                supplier.is_verified
                                    ? 'bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200'
                                    : 'bg-green-50 border border-green-200 text-green-700 hover:bg-green-100'
                            }`}
                        >
                            {supplier.is_verified ? <XCircle size={15} /> : <CheckCircle2 size={15} />}
                            {supplier.is_verified ? 'Unverify' : 'Verify'}
                        </button>
                        <button
                            onClick={handleDelete}
                            className="px-4 h-[36px] bg-red-50 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white rounded-[8px] font-bold text-[13px] transition-colors flex items-center gap-2"
                        >
                            <Trash2 size={15} />
                            Delete
                        </button>
                    </div>
                </div>

                {/* 4 Stats Cards matching Index.jsx style */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm p-5 flex items-center justify-between">
                        <div>
                            <p className="text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">Account Status</p>
                            <p className={`text-[15px] font-bold ${supplier.is_verified ? 'text-green-700' : 'text-orange-700'}`}>
                                {supplier.is_verified ? 'Verified' : 'Unverified'}
                            </p>
                        </div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${supplier.is_verified ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                            <Shield size={20} />
                        </div>
                    </div>

                    <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm p-5 flex items-center justify-between">
                        <div>
                            <p className="text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">Compliance Status</p>
                            <p className={`text-[15px] font-bold ${supplier.is_compliance_verified ? 'text-blue-700' : 'text-yellow-700'}`}>
                                {supplier.is_compliance_verified ? 'Approved' : 'Pending Review'}
                            </p>
                        </div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${supplier.is_compliance_verified ? 'bg-blue-50 text-blue-600' : 'bg-yellow-50 text-yellow-600'}`}>
                            <FileCheck size={20} />
                        </div>
                    </div>

                    <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm p-5 flex items-center justify-between">
                        <div>
                            <p className="text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">Policy Number</p>
                            <p className="text-[15px] font-bold text-[#2f3344] truncate">
                                {supplier.policy_number || 'N/A'}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <FileText size={20} />
                        </div>
                    </div>

                    <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm p-5 flex items-center justify-between">
                        <div>
                            <p className="text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">Subscription Plan</p>
                            <p className="text-[15px] font-bold text-[#2f3344] truncate">
                                {supplier.user_subscription?.pricing_plan?.name || 'No Active Plan'}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                            <Award size={20} />
                        </div>
                    </div>
                </div>

                {/* Main 2-Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left Section (2 Columns) */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Supplier Business Details Card */}
                        <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-[#e3e4e8]">
                                <h2 className="text-[15px] font-bold text-[#2f3344]">Supplier Information</h2>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <p className="text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">Supplier Name</p>
                                    <div className="flex items-center gap-2 text-[#2f3344]">
                                        <User size={14} className="text-[#a0a3af]" />
                                        <p className="text-[13px] font-bold">{supplier.name}</p>
                                    </div>
                                </div>

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
                                        <p className="text-[13px] font-bold">{supplier.phone_number || 'N/A'}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">Company</p>
                                    <div className="flex items-center gap-2 text-[#2f3344]">
                                        <Building2 size={14} className="text-[#a0a3af]" />
                                        <p className="text-[13px] font-bold">{supplier.company_name || 'N/A'}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">Insurance Provider</p>
                                    <p className="text-[13px] font-bold text-[#2f3344]">{supplier.insurance_provider_name || 'N/A'}</p>
                                </div>

                                <div>
                                    <p className="text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">Policy Expiry Date</p>
                                    <div className="flex items-center gap-2 text-[#2f3344]">
                                        <Calendar size={14} className="text-[#a0a3af]" />
                                        <p className="text-[13px] font-bold">
                                            {supplier.policy_expiry_date 
                                                ? new Date(supplier.policy_expiry_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) 
                                                : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Compliance & Documents */}
                        <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-[#e3e4e8] flex justify-between items-center">
                                <h2 className="text-[15px] font-bold text-[#2f3344]">Insurance & Documents</h2>
                            </div>
                            <div className="p-6 space-y-4">
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

                        {/* Subscription Card */}
                        <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-[#e3e4e8]">
                                <h2 className="text-[15px] font-bold text-[#2f3344]">Subscription Details</h2>
                            </div>
                            <div className="p-6">
                                {supplier.user_subscription ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <p className="text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">Plan Name</p>
                                            <p className="text-[13px] font-bold text-[#2f3344]">{supplier.user_subscription.pricing_plan?.name || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">Status</p>
                                            <span className={`px-2.5 py-0.5 border rounded-full text-[11px] font-bold uppercase tracking-wide inline-block ${
                                                supplier.user_subscription.status === 'active' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'
                                            }`}>
                                                {supplier.user_subscription.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">Started At</p>
                                            <p className="text-[13px] font-bold text-[#2f3344]">
                                                {supplier.user_subscription.started_at ? new Date(supplier.user_subscription.started_at).toLocaleDateString() : 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">Expires At</p>
                                            <p className="text-[13px] font-bold text-[#2f3344]">
                                                {supplier.user_subscription.expires_at ? new Date(supplier.user_subscription.expires_at).toLocaleDateString() : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <p className="text-[13px] text-[#727586]">This supplier does not have an active subscription plan.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Section (1 Column) */}
                    <div className="space-y-6">
                        
                        {/* Quick Controls Card */}
                        <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-[#e3e4e8]">
                                <h2 className="text-[15px] font-bold text-[#2f3344]">Quick Actions</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[13px] font-bold text-[#2f3344]">Compliance Approval</p>
                                        <p className="text-[11px] text-[#727586]">{supplier.is_compliance_verified ? 'Approved' : 'Pending'}</p>
                                    </div>
                                    <button
                                        onClick={toggleCompliance}
                                        className={`px-3 py-1.5 rounded-[6px] font-bold text-[12px] transition-colors ${
                                            supplier.is_compliance_verified ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-blue-600 text-white'
                                        }`}
                                    >
                                        {supplier.is_compliance_verified ? 'Revoke' : 'Approve'}
                                    </button>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-[#f1f2f4]">
                                    <div>
                                        <p className="text-[13px] font-bold text-[#2f3344]">Verification Status</p>
                                        <p className="text-[11px] text-[#727586]">{supplier.is_verified ? 'Verified' : 'Unverified'}</p>
                                    </div>
                                    <button
                                        onClick={toggleVerification}
                                        className={`px-3 py-1.5 rounded-[6px] font-bold text-[12px] transition-colors ${
                                            supplier.is_verified ? 'bg-gray-100 text-gray-700 border border-gray-300' : 'bg-green-600 text-white'
                                        }`}
                                    >
                                        {supplier.is_verified ? 'Unverify' : 'Verify'}
                                    </button>
                                </div>

                                {supplier.user_subscription && (
                                    <div className="flex items-center justify-between pt-3 border-t border-[#f1f2f4]">
                                        <div>
                                            <p className="text-[13px] font-bold text-[#2f3344]">Auto Renewal</p>
                                            <p className="text-[11px] text-[#727586]">{supplier.user_subscription.auto_renew ? 'Active' : 'Disabled'}</p>
                                        </div>
                                        <button
                                            onClick={toggleAutoRenew}
                                            className={`px-3 py-1.5 rounded-[6px] font-bold text-[12px] transition-colors ${
                                                supplier.user_subscription.auto_renew ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-600 text-white'
                                            }`}
                                        >
                                            {supplier.user_subscription.auto_renew ? 'Disable' : 'Enable'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="bg-white rounded-[12px] border border-red-200 shadow-sm overflow-hidden">
                            <div className="p-5 space-y-3">
                                <h2 className="text-[14px] font-bold text-red-600 flex items-center gap-2">
                                    <AlertCircle size={16} />
                                    Danger Zone
                                </h2>
                                <p className="text-[12px] text-[#727586]">
                                    Once you delete a supplier, there is no going back. Please be certain.
                                </p>
                                <button
                                    onClick={handleDelete}
                                    className="w-full px-4 h-[36px] bg-red-50 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white rounded-[8px] font-bold text-[12px] transition-all flex items-center justify-center gap-2"
                                >
                                    <Trash2 size={14} />
                                    Delete Supplier Account
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Confirmation Modal matching Index.jsx */}
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

            {/* Success Modal matching Index.jsx */}
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
