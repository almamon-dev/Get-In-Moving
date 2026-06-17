import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Home, ChevronLeft, Mail, Phone, Building2, Calendar,
    Check, X, Shield, AlertCircle, Trash2,
    User, CreditCard, Settings
} from 'lucide-react';
import Modal from '@/Components/Modal';

export default function Show({ auth, customer }) {
    const [activeTab, setActiveTab] = useState('general');
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', action: null });
    const [successModal, setSuccessModal] = useState({ isOpen: false, title: '', message: '' });

    const tabs = [
        { id: 'general', label: 'General', icon: <User size={18} /> },
        { id: 'verification', label: 'Verification', icon: <Check size={18} /> },
        { id: 'subscription', label: 'Subscription', icon: <CreditCard size={18} /> },
        { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
    ];
    const toggleVerification = () => {
        setConfirmModal({
            isOpen: true,
            title: customer.is_verified ? 'Unverify Customer' : 'Verify Customer',
            message: `Are you sure you want to ${customer.is_verified ? 'unverify' : 'verify'} this customer?`,
            action: () => {
                router.patch(route('admin.customers.verification', customer.id), {
                    is_verified: !customer.is_verified,
                }, {
                    onSuccess: () => {
                        setConfirmModal({ isOpen: false, title: '', message: '', action: null });
                        setSuccessModal({
                            isOpen: true,
                            title: 'Success!',
                            message: `Customer account has been successfully ${customer.is_verified ? 'unverified' : 'verified'}.`
                        });
                    }
                });
            }
        });
    };

    const handleDelete = () => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Customer',
            message: 'Are you sure you want to delete this customer? This action cannot be undone.',
            action: () => {
                router.delete(route('admin.customers.destroy', customer.id));
            }
        });
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
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#673ab7] to-[#9c27b0] flex items-center justify-center text-white font-bold text-[36px] mb-4">
                                            {customer.name.charAt(0).toUpperCase()}
                                        </div>
                                        <h3 className="text-[18px] font-bold text-[#2f3344] text-center mb-1">{customer.name}</h3>
                                        <span className="px-3 py-1 border border-blue-200 bg-blue-50 text-blue-700 rounded-full text-[11px] font-bold uppercase tracking-wide mb-4">
                                            Customer
                                        </span>
                                        <div className="flex gap-2 flex-wrap justify-center">
                                            {customer.is_verified ? (
                                                <span className="px-2.5 py-1.5 border border-green-200 bg-green-50 text-green-700 rounded-full flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide" title="Verified">
                                                    <Check size={14} /> Verified
                                                </span>
                                            ) : (
                                                <span className="px-2.5 py-1.5 border border-orange-200 bg-orange-50 text-orange-700 rounded-full flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide" title="Unverified">
                                                    <AlertCircle size={14} /> Unverified
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div>
                                            <p className="text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">Email Address</p>
                                            <div className="flex items-center gap-2 text-[#2f3344]">
                                                <Mail size={14} className="text-[#a0a3af]" />
                                                <p className="text-[13px] font-bold truncate">{customer.email}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">Phone Number</p>
                                            <div className="flex items-center gap-2 text-[#2f3344]">
                                                <Phone size={14} className="text-[#a0a3af]" />
                                                <p className="text-[13px] font-bold">{customer.phone_number || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">Company</p>
                                            <div className="flex items-center gap-2 text-[#2f3344]">
                                                <Building2 size={14} className="text-[#a0a3af]" />
                                                <p className="text-[13px] font-bold">{customer.company_name || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">Joined Date</p>
                                            <div className="flex items-center gap-2 text-[#2f3344]">
                                                <Calendar size={14} className="text-[#a0a3af]" />
                                                <p className="text-[13px] font-bold">
                                                    {new Date(customer.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
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
                                            <span className={`px-2.5 py-0.5 border rounded-full text-[11px] font-bold uppercase tracking-wide ${customer.is_verified ? 'border-green-200 bg-green-50 text-green-700' : 'border-orange-200 bg-orange-50 text-orange-700'}`}>
                                                {customer.is_verified ? 'Verified' : 'Pending'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[12px] text-[#727586]">Account Type</span>
                                            <span className="px-2.5 py-0.5 border border-[#e3e4e8] bg-[#f8f9fa] rounded-full text-[11px] font-bold text-[#2f3344] uppercase tracking-wide">{customer.user_type}</span>
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
                                                {customer.is_verified ? (
                                                    <>
                                                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                                            <Check size={14} strokeWidth={3} />
                                                        </div>
                                                        <span className="text-[14px] text-[#2f3344] font-bold">
                                                            {customer.verified_at ? new Date(customer.verified_at).toLocaleDateString() : 'Verified'}
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
                        )}

                        {/* Tab Content: Subscription */}
                        {activeTab === 'subscription' && (
                            <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-[#e3e4e8] flex justify-between items-center">
                                    <h2 className="text-[15px] font-bold text-[#2f3344]">Subscription Details</h2>
                                        </div>
                                        <div className="p-6">
                                            {customer.user_subscription ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                    <div>
                                                        <p className="text-[13px] text-[#727586] font-medium mb-2">Plan Name</p>
                                                        <p className="text-[14px] text-[#2f3344] font-bold">{customer.user_subscription.pricing_plan?.name || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[13px] text-[#727586] font-medium mb-2">Status</p>
                                                        <span className={`px-2.5 py-1 border rounded-full text-[11px] font-bold uppercase tracking-wide inline-block ${customer.user_subscription.status === 'active'
                                                            ? 'border-green-200 bg-green-50 text-green-700'
                                                            : customer.user_subscription.status === 'pending_payment'
                                                                ? 'border-orange-200 bg-orange-50 text-orange-700'
                                                                : 'border-red-200 bg-red-50 text-red-700'
                                                            }`}>
                                                            {customer.user_subscription.status.replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="text-[13px] text-[#727586] font-medium mb-2">Started At</p>
                                                        <p className="text-[14px] text-[#2f3344] font-bold">
                                                            {customer.user_subscription.started_at ? new Date(customer.user_subscription.started_at).toLocaleDateString() : 'N/A'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[13px] text-[#727586] font-medium mb-2">Expires At</p>
                                                        <p className="text-[14px] text-[#2f3344] font-bold">
                                                            {customer.user_subscription.expires_at ? new Date(customer.user_subscription.expires_at).toLocaleDateString() : 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center py-10">
                                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <CreditCard size={24} className="text-[#a0a3af]" />
                                                    </div>
                                                    <h3 className="text-[16px] font-bold text-[#2f3344] mb-2">No Active Subscription</h3>
                                                    <p className="text-[13px] text-[#727586]">This customer does not have an active subscription plan.</p>
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
                                                            <Check size={16} className={customer.is_verified ? 'text-green-600' : 'text-[#a0a3af]'} />
                                                            <p className="text-[13px] font-bold text-[#2f3344]">Account Access</p>
                                                        </div>
                                                        <button
                                                            onClick={toggleVerification}
                                                            className={`w-9 h-5 rounded-full transition-colors flex items-center px-1 ${customer.is_verified ? 'bg-[#00b090]' : 'bg-[#e3e4e8]'}`}
                                                        >
                                                            <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${customer.is_verified ? 'translate-x-3.5' : 'translate-x-0'}`} />
                                                        </button>
                                                    </div>
                                                    <p className="text-[11px] text-[#727586]">Allow user to login and use platform</p>
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
                                                        Once you delete a customer, there is no going back. Please be certain.
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
