import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Home, ChevronLeft, Mail, Phone, Building2, Calendar,
    Check, X, Shield, AlertCircle, Trash2, User, CreditCard,
    Award, Edit3, ShieldCheck, CheckCircle2, XCircle
} from 'lucide-react';
import Modal from '@/Components/Modal';

export default function Show({ auth, customer }) {
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', action: null });
    const [successModal, setSuccessModal] = useState({ isOpen: false, title: '', message: '' });

    // Pay Later Inline Editing State
    const [isEditingPayLater, setIsEditingPayLater] = useState(false);
    const [payLaterForm, setPayLaterForm] = useState({
        status: customer.pay_later_status || 'inactive',
        credit_limit: customer.pay_later_credit_limit || 0,
        daily_limit: customer.pay_later_daily_limit || 0,
        weekly_limit: customer.pay_later_weekly_limit || 0,
        rejection_reason: customer.pay_later_rejection_reason || ''
    });

    const toggleVerification = () => {
        const nextState = !customer.is_verified;
        setConfirmModal({
            isOpen: true,
            title: nextState ? 'Verify Customer' : 'Unverify Customer',
            message: `Are you sure you want to ${nextState ? 'verify' : 'unverify'} ${customer.name}?`,
            action: () => {
                router.patch(route('admin.customers.verification', customer.id), {
                    is_verified: nextState
                }, {
                    preserveScroll: true,
                    onSuccess: () => {
                        setConfirmModal({ isOpen: false, title: '', message: '', action: null });
                        setSuccessModal({ isOpen: true, title: 'Success!', message: `Customer verification has been updated.` });
                    }
                });
            }
        });
    };

    const handleUpdatePayLater = (e) => {
        e.preventDefault();
        router.patch(route('admin.customers.pay-later-status', customer.id), {
            pay_later_status: payLaterForm.status,
            pay_later_credit_limit: parseFloat(payLaterForm.credit_limit || 0),
            pay_later_daily_limit: parseFloat(payLaterForm.daily_limit || 0),
            pay_later_weekly_limit: parseFloat(payLaterForm.weekly_limit || 0),
            rejection_reason: payLaterForm.status === 'rejected' ? payLaterForm.rejection_reason : null,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditingPayLater(false);
                setSuccessModal({ isOpen: true, title: 'Success!', message: 'Pay Later facility settings updated.' });
            }
        });
    };

    const handleDelete = () => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Customer',
            message: `Are you sure you want to delete ${customer.name}? This action cannot be undone.`,
            action: () => router.delete(route('admin.customers.destroy', customer.id))
        });
    };

    const creditLimit = Number(customer.pay_later_credit_limit || 0);
    const usedCredit = Number(customer.pay_later_used_credit || 0);
    const availableCredit = Number(customer.pay_later_available_credit || (creditLimit - usedCredit));

    return (
        <AdminLayout user={auth.user}>
            <Head title={`Customer - ${customer.name}`} />

            <div className="space-y-6 w-full mx-auto px-6 py-8 pb-20">
                
                {/* Header Row matching Index.jsx */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-[13px] text-[#727586] mb-1">
                            <Home size={16} className="text-[#727586]" />
                            <span className="text-[#c3c4ca]">-</span>
                            <Link href={route('admin.customers.index')} className="hover:text-[#673ab7]">
                                Customers
                            </Link>
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Details</span>
                        </div>
                        <h1 className="text-[24px] font-bold text-[#111827] tracking-tight">Customer Profile</h1>
                    </div>
                    <Link
                        href={route('admin.customers.index')}
                        className="flex items-center gap-2 text-[#673ab7] hover:underline font-bold text-[14px]"
                    >
                        <ChevronLeft size={18} />
                        Back to list
                    </Link>
                </div>

                {/* Main Profile Summary Card */}
                <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm overflow-hidden p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#673ab7] to-[#9c27b0] flex items-center justify-center text-white font-bold text-[24px] shrink-0">
                            {customer.name?.charAt(0)?.toUpperCase() || 'C'}
                        </div>
                        <div>
                            <div className="flex items-center gap-3 flex-wrap">
                                <h2 className="text-[20px] font-bold text-[#2f3344]">{customer.name}</h2>
                                <span className="px-3 py-1 border border-purple-200 bg-purple-50 text-[#673ab7] rounded-full text-[11px] font-bold uppercase tracking-wide">
                                    Customer
                                </span>
                                {customer.is_verified ? (
                                    <span className="px-2.5 py-1 border border-green-200 bg-green-50 text-green-700 rounded-full flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide">
                                        <Check size={14} /> Verified
                                    </span>
                                ) : (
                                    <span className="px-2.5 py-1 border border-orange-200 bg-orange-50 text-orange-700 rounded-full flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide">
                                        <AlertCircle size={14} /> Unverified
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-4 text-[13px] text-[#727586] mt-1 flex-wrap">
                                <span>ID: <strong className="text-[#2f3344]">#{customer.id}</strong></span>
                                <span>•</span>
                                <span className="flex items-center gap-1.5">
                                    <Mail size={14} className="text-[#a0a3af]" />
                                    {customer.email}
                                </span>
                                {customer.phone_number && (
                                    <>
                                        <span>•</span>
                                        <span className="flex items-center gap-1.5">
                                            <Phone size={14} className="text-[#a0a3af]" />
                                            {customer.phone_number}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <button
                            onClick={toggleVerification}
                            className={`px-4 h-[36px] rounded-[8px] font-bold text-[13px] transition-colors flex items-center gap-2 ${
                                customer.is_verified
                                    ? 'bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100'
                                    : 'bg-green-50 border border-green-200 text-green-700 hover:bg-green-100'
                            }`}
                        >
                            {customer.is_verified ? <XCircle size={15} /> : <CheckCircle2 size={15} />}
                            {customer.is_verified ? 'Unverify Account' : 'Verify Account'}
                        </button>
                        <button
                            onClick={handleDelete}
                            className="px-4 h-[36px] bg-red-50 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white rounded-[8px] font-bold text-[13px] transition-colors flex items-center gap-2"
                        >
                            <Trash2 size={15} />
                            Delete Account
                        </button>
                    </div>
                </div>

                {/* 4 Stats Cards matching Index.jsx style */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm p-5 flex items-center justify-between">
                        <div>
                            <p className="text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">Account Status</p>
                            <p className={`text-[15px] font-bold ${customer.is_verified ? 'text-green-700' : 'text-orange-700'}`}>
                                {customer.is_verified ? 'Verified' : 'Unverified'}
                            </p>
                        </div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${customer.is_verified ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                            <Shield size={20} />
                        </div>
                    </div>

                    <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm p-5 flex items-center justify-between">
                        <div>
                            <p className="text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">Pay Later Status</p>
                            <p className="text-[15px] font-bold text-[#2f3344] capitalize">
                                {customer.pay_later_status || 'Inactive'} {creditLimit > 0 ? `(€${creditLimit.toLocaleString()})` : ''}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-purple-50 text-[#673ab7] flex items-center justify-center">
                            <CreditCard size={20} />
                        </div>
                    </div>

                    <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm p-5 flex items-center justify-between">
                        <div>
                            <p className="text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">Subscription Plan</p>
                            <p className="text-[15px] font-bold text-[#2f3344] truncate">
                                {customer.user_subscription?.pricing_plan?.name || 'No Active Plan'}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Award size={20} />
                        </div>
                    </div>

                    <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm p-5 flex items-center justify-between">
                        <div>
                            <p className="text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">Joined Date</p>
                            <p className="text-[15px] font-bold text-[#2f3344]">
                                {new Date(customer.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gray-50 text-gray-500 flex items-center justify-center">
                            <Calendar size={20} />
                        </div>
                    </div>
                </div>

                {/* Main 2-Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left Section (2 Columns) */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Customer Information Card */}
                        <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-[#e3e4e8]">
                                <h2 className="text-[15px] font-bold text-[#2f3344]">Customer Information</h2>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <p className="text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">Full Name</p>
                                    <div className="flex items-center gap-2 text-[#2f3344]">
                                        <User size={14} className="text-[#a0a3af]" />
                                        <p className="text-[13px] font-bold">{customer.name}</p>
                                    </div>
                                </div>

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
                                    <p className="text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">Account Type</p>
                                    <span className="px-2.5 py-0.5 border border-[#e3e4e8] bg-[#f8f9fa] rounded-full text-[11px] font-bold text-[#2f3344] uppercase tracking-wide">
                                        {customer.user_type}
                                    </span>
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

                        {/* Pay Later Facility & Credit Management */}
                        <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-[#e3e4e8] flex justify-between items-center">
                                <h2 className="text-[15px] font-bold text-[#2f3344]">Pay Later Facility & Limits</h2>
                                <button
                                    onClick={() => setIsEditingPayLater(!isEditingPayLater)}
                                    className="text-[#673ab7] hover:underline text-[13px] font-bold flex items-center gap-1"
                                >
                                    <Edit3 size={14} />
                                    {isEditingPayLater ? 'Close Editor' : 'Edit Facility'}
                                </button>
                            </div>

                            <div className="p-6 space-y-5">
                                {/* Gauges */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="p-4 bg-[#f8f6ff] rounded-[8px] border border-[#e9e3fb]">
                                        <p className="text-[11px] text-[#673ab7] font-medium uppercase tracking-wider">Credit Limit</p>
                                        <p className="text-[20px] font-bold text-[#2f3344] mt-1">€{creditLimit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                                    </div>
                                    <div className="p-4 bg-amber-50 rounded-[8px] border border-amber-200">
                                        <p className="text-[11px] text-amber-700 font-medium uppercase tracking-wider">Used Credit</p>
                                        <p className="text-[20px] font-bold text-[#2f3344] mt-1">€{usedCredit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                                    </div>
                                    <div className="p-4 bg-green-50 rounded-[8px] border border-green-200">
                                        <p className="text-[11px] text-green-700 font-medium uppercase tracking-wider">Available Credit</p>
                                        <p className="text-[20px] font-bold text-[#2f3344] mt-1">€{availableCredit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                                    </div>
                                </div>

                                {/* Form */}
                                {isEditingPayLater && (
                                    <form onSubmit={handleUpdatePayLater} className="p-5 bg-[#f8f9fa] rounded-[8px] border border-[#e3e4e8] space-y-4">
                                        <h3 className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">Update Pay Later Settings</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <div>
                                                <label className="block text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">Status</label>
                                                <select
                                                    value={payLaterForm.status}
                                                    onChange={(e) => setPayLaterForm({ ...payLaterForm, status: e.target.value })}
                                                    className="w-full h-10 px-3 bg-white border border-[#d1d5db] rounded-[4px] text-[13px] font-bold text-[#2f3344] focus:outline-none focus:border-[#673ab7]"
                                                >
                                                    <option value="inactive">Inactive</option>
                                                    <option value="pending">Pending</option>
                                                    <option value="approved">Approved</option>
                                                    <option value="rejected">Rejected</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">Total Limit (€)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={payLaterForm.credit_limit}
                                                    onChange={(e) => setPayLaterForm({ ...payLaterForm, credit_limit: e.target.value })}
                                                    className="w-full h-10 px-3 bg-white border border-[#d1d5db] rounded-[4px] text-[13px] font-bold text-[#2f3344] focus:outline-none focus:border-[#673ab7]"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">Daily Limit (€)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={payLaterForm.daily_limit}
                                                    onChange={(e) => setPayLaterForm({ ...payLaterForm, daily_limit: e.target.value })}
                                                    className="w-full h-10 px-3 bg-white border border-[#d1d5db] rounded-[4px] text-[13px] font-bold text-[#2f3344] focus:outline-none focus:border-[#673ab7]"
                                                    placeholder="0 = Unlimited"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">Weekly Limit (€)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={payLaterForm.weekly_limit}
                                                    onChange={(e) => setPayLaterForm({ ...payLaterForm, weekly_limit: e.target.value })}
                                                    className="w-full h-10 px-3 bg-white border border-[#d1d5db] rounded-[4px] text-[13px] font-bold text-[#2f3344] focus:outline-none focus:border-[#673ab7]"
                                                    placeholder="0 = Unlimited"
                                                />
                                            </div>
                                        </div>

                                        {payLaterForm.status === 'rejected' && (
                                            <div>
                                                <label className="block text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">Rejection Reason</label>
                                                <textarea
                                                    rows={2}
                                                    value={payLaterForm.rejection_reason}
                                                    onChange={(e) => setPayLaterForm({ ...payLaterForm, rejection_reason: e.target.value })}
                                                    className="w-full p-3 bg-white border border-[#d1d5db] rounded-[4px] text-[13px] text-[#2f3344] focus:outline-none focus:border-[#673ab7]"
                                                />
                                            </div>
                                        )}

                                        <div className="flex justify-end gap-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={() => setIsEditingPayLater(false)}
                                                className="px-4 h-[36px] bg-white border border-[#e3e4e8] text-[#727586] rounded-[8px] font-bold text-[13px]"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 h-[36px] bg-[#673ab7] hover:bg-[#5e35b1] text-white rounded-[8px] font-bold text-[13px]"
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>

                        {/* Subscription Card */}
                        <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-[#e3e4e8]">
                                <h2 className="text-[15px] font-bold text-[#2f3344]">Subscription Details</h2>
                            </div>
                            <div className="p-6">
                                {customer.user_subscription ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <p className="text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">Plan Name</p>
                                            <p className="text-[13px] font-bold text-[#2f3344]">{customer.user_subscription.pricing_plan?.name || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">Status</p>
                                            <span className={`px-2.5 py-0.5 border rounded-full text-[11px] font-bold uppercase tracking-wide inline-block ${
                                                customer.user_subscription.status === 'active' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'
                                            }`}>
                                                {customer.user_subscription.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">Started At</p>
                                            <p className="text-[13px] font-bold text-[#2f3344]">
                                                {customer.user_subscription.started_at ? new Date(customer.user_subscription.started_at).toLocaleDateString() : 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">Expires At</p>
                                            <p className="text-[13px] font-bold text-[#2f3344]">
                                                {customer.user_subscription.expires_at ? new Date(customer.user_subscription.expires_at).toLocaleDateString() : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <p className="text-[13px] text-[#727586]">This customer does not have an active subscription plan.</p>
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
                                        <p className="text-[13px] font-bold text-[#2f3344]">Verification Status</p>
                                        <p className="text-[11px] text-[#727586]">{customer.is_verified ? 'Verified' : 'Unverified'}</p>
                                    </div>
                                    <button
                                        onClick={toggleVerification}
                                        className={`px-3 py-1.5 rounded-[6px] font-bold text-[12px] transition-colors ${
                                            customer.is_verified ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-green-600 text-white'
                                        }`}
                                    >
                                        {customer.is_verified ? 'Unverify' : 'Verify'}
                                    </button>
                                </div>
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
                                    Once you delete a customer, there is no going back. Please be certain.
                                </p>
                                <button
                                    onClick={handleDelete}
                                    className="w-full px-4 h-[36px] bg-red-50 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white rounded-[8px] font-bold text-[12px] transition-all flex items-center justify-center gap-2"
                                >
                                    <Trash2 size={14} />
                                    Delete Customer Account
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
