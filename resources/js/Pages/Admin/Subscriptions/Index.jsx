import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Eye, CheckCircle, XCircle, CreditCard, RefreshCw, ChevronDown, ChevronLeft, ChevronRight, Trash2, AlertCircle, Check, Clock } from 'lucide-react';
import Modal from '@/Components/Modal';

const CountdownTimer = ({ expiresAt, className = "text-[14px]" }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        if (!expiresAt) return;

        const calculateTimeLeft = () => {
            const difference = new Date(expiresAt) - new Date();
            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);

                let timeString = '';
                if (days > 0) timeString += `${days}d `;
                if (hours > 0 || days > 0) timeString += `${hours}h `;
                if (minutes > 0 || hours > 0 || days > 0) timeString += `${minutes}m `;
                timeString += `${seconds}s`;

                setTimeLeft(timeString);
            } else {
                setTimeLeft('Expired');
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [expiresAt]);

    if (!timeLeft) return null;

    return (
        <span className={`font-mono font-bold tracking-tight ${className} ${timeLeft === 'Expired' ? 'text-red-600' : 'text-[#0a66c2]'}`}>
            {timeLeft}
        </span>
    );
};

export default function Index({ auth, subscriptions, filters }) {
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [activeTab, setActiveTab] = useState(filters?.status || 'All');
    const [selectedIds, setSelectedIds] = useState([]);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', action: null });
    const [successModal, setSuccessModal] = useState({ isOpen: false, title: '', message: '' });
    const [viewModal, setViewModal] = useState({ isOpen: false, data: null });

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        router.get(route('admin.subscriptions.index'), { search: e.target.value, status: activeTab, per_page: filters.per_page }, { preserveState: true });
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        router.get(route('admin.subscriptions.index'), { search: searchQuery, status: tab, per_page: filters.per_page }, { preserveState: true });
    };

    const handlePerPageChange = (e) => {
        router.get(route('admin.subscriptions.index'), { search: searchQuery, status: activeTab, per_page: e.target.value }, { preserveState: true });
    };

    const handlePageChange = (url) => {
        if (url) router.get(url, {}, { preserveState: true });
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === subscriptions.data.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(subscriptions.data.map(s => s.id));
        }
    };

    const toggleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(prev => prev.filter(i => i !== id));
        } else {
            setSelectedIds(prev => [...prev, id]);
        }
    };

    const handleBulkDelete = () => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Selected Subscriptions',
            message: `Are you sure you want to delete ${selectedIds.length} selected subscriptions? This action cannot be undone.`,
            action: () => {
                router.post(route('admin.subscriptions.bulk-destroy'), { ids: selectedIds }, {
                    onSuccess: () => {
                        setConfirmModal({ isOpen: false, title: '', message: '', action: null });
                        setSelectedIds([]);
                        setSuccessModal({
                            isOpen: true,
                            title: 'Success!',
                            message: 'Selected subscriptions have been successfully deleted.'
                        });
                    }
                });
            }
        });
    };

    const handleDelete = (id) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Subscription',
            message: 'Are you sure you want to delete this subscription? This action cannot be undone.',
            action: () => {
                router.delete(route('admin.subscriptions.destroy', id), {
                    onSuccess: () => {
                        setConfirmModal({ isOpen: false, title: '', message: '', action: null });
                        setSuccessModal({
                            isOpen: true,
                            title: 'Success!',
                            message: 'Subscription has been successfully deleted.'
                        });
                    }
                });
            }
        });
    };

    const tabs = ['All', 'Active', 'Pending', 'Expired', 'Cancelled'];

    return (
        <AdminLayout user={auth.user}>
            <Head title="Subscription Management" />

            <div className="min-h-screen bg-[#f5f6f8]">
                <div className="w-full mx-auto px-6 py-8">
                    
                    {/* Header Row */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                        <div>
                            <h1 className="text-[24px] font-bold text-[#111827] tracking-tight">Subscription Management</h1>
                            <p className="text-[14px] text-[#6b7280] mt-0.5">Track and manage user subscriptions and auto-renewals</p>
                        </div>
                        <div className="flex items-center gap-3 mt-4 md:mt-0">
                            {selectedIds.length > 0 && (
                                <button 
                                    onClick={handleBulkDelete}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded text-[13px] font-medium hover:bg-red-100 transition-colors shadow-sm"
                                >
                                    <Trash2 size={16} />
                                    Delete Selected ({selectedIds.length})
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Main Container */}
                    <div className="bg-white rounded-md border border-[#e5e7eb] shadow-sm">
                        
                        {/* Tabs Row */}
                        <div className="flex items-center gap-6 px-6 border-b border-[#e5e7eb] overflow-x-auto">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => handleTabChange(tab)}
                                    className={`flex items-center gap-2 py-3.5 text-[14px] font-medium border-b-2 whitespace-nowrap transition-colors ${
                                        activeTab === tab 
                                            ? 'border-[#0a66c2] text-[#0a66c2]' 
                                            : 'border-transparent text-[#6b7280] hover:text-[#374151] hover:border-gray-300'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Search Toolbar */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 border-b border-[#e5e7eb]">
                            <div className="relative w-full md:w-[400px]">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                                <input 
                                    type="text" 
                                    placeholder="Search by user name or email..." 
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    className="w-full h-10 pl-10 pr-4 bg-white border border-[#d1d5db] rounded-[4px] text-[13px] focus:outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] placeholder:text-[#9ca3af]"
                                />
                            </div>
                        </div>

                        {/* Data Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse whitespace-nowrap">
                                <thead>
                                    <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]/50">
                                        <th className="pl-6 pr-3 py-3 w-10">
                                            <div
                                                onClick={toggleSelectAll}
                                                className={`w-[18px] h-[18px] border-[2px] rounded cursor-pointer transition-all flex items-center justify-center ${selectedIds.length === subscriptions.data.length && subscriptions.data.length > 0
                                                        ? 'bg-[#0a66c2] border-[#0a66c2]'
                                                        : 'border-[#c3c4ca] hover:border-[#0a66c2]'
                                                    }`}
                                            >
                                                {selectedIds.length === subscriptions.data.length && subscriptions.data.length > 0 && <Check size={12} className="text-white" />}
                                            </div>
                                        </th>
                                        <th className="py-2 px-3 text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">User</th>
                                        <th className="py-2 px-3 text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">Plan</th>
                                        <th className="py-2 px-3 text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">Status</th>
                                        <th className="py-2 px-3 text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">Expires At</th>
                                        <th className="py-2 px-3 text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">Auto Renew</th>
                                        <th className="px-6 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#e5e7eb]">
                                    {subscriptions.data.length > 0 ? (
                                        subscriptions.data.map((sub) => (
                                            <tr key={sub.id} className={`hover:bg-[#f9fafb] transition-colors ${selectedIds.includes(sub.id) ? 'bg-[#f0f7ff]/50' : ''}`}>
                                                <td className="pl-6 pr-3 py-2">
                                                    <div
                                                        onClick={() => toggleSelect(sub.id)}
                                                        className={`w-[18px] h-[18px] border-[2px] rounded cursor-pointer transition-all flex items-center justify-center ${selectedIds.includes(sub.id)
                                                                ? 'bg-[#0a66c2] border-[#0a66c2]'
                                                                : 'border-[#c3c4ca] hover:border-[#0a66c2]'
                                                            }`}
                                                    >
                                                        {selectedIds.includes(sub.id) && <Check size={12} className="text-white" />}
                                                    </div>
                                                </td>
                                                <td className="py-2 px-3">
                                                    <div className="flex items-center gap-2.5">
                                                        <img 
                                                            src={sub.user?.profile_picture || `https://ui-avatars.com/api/?name=${sub.user?.name}&background=0a66c2&color=fff`} 
                                                            alt="Avatar" 
                                                            className="w-8 h-8 rounded-md object-cover border border-[#e5e7eb]"
                                                        />
                                                        <div className="flex flex-col">
                                                            <span className="text-[12px] font-bold text-[#111827]">{sub.user?.name}</span>
                                                            <span className="text-[11px] text-[#6b7280]">{sub.user?.email}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-2 px-3">
                                                    <div className="flex items-center gap-1.5">
                                                        <CreditCard size={14} className="text-slate-400" />
                                                        <span className="text-[12px] font-semibold text-[#374151]">{sub.pricing_plan?.name || 'N/A'}</span>
                                                    </div>
                                                </td>
                                                <td className="py-2 px-3">
                                                    <div className={`inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded-[4px] text-[10px] font-bold tracking-wide ${
                                                        sub.status === 'active' ? 'bg-[#ecfdf5] text-[#059669]' : 
                                                        sub.status === 'pending' ? 'bg-[#fffbeb] text-[#d97706]' : 
                                                        'bg-[#fef2f2] text-[#dc2626]'
                                                    }`}>
                                                        <span className="text-[6px]">●</span>
                                                        {sub.status.toUpperCase()}
                                                    </div>
                                                </td>
                                                <td className="py-2 px-3">
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className={`text-[12px] font-medium ${new Date(sub.expires_at) < new Date() ? 'text-red-500' : 'text-[#111827]'}`}>
                                                            {sub.expires_at ? new Date(sub.expires_at).toLocaleDateString() : 'N/A'}
                                                        </span>
                                                        {sub.expires_at && new Date(sub.expires_at) > new Date() && (
                                                            <div className="flex items-center gap-1 opacity-90">
                                                                <Clock size={10} className="text-[#0a66c2]" />
                                                                <CountdownTimer expiresAt={sub.expires_at} className="text-[10px]" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-2 px-3">
                                                    <span 
                                                        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold ${
                                                            sub.auto_renew ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'
                                                        }`}
                                                    >
                                                        <RefreshCw size={12} className={sub.auto_renew ? 'animate-spin-slow' : ''} />
                                                        {sub.auto_renew ? 'ON' : 'OFF'}
                                                    </span>
                                                </td>
                                                <td className="pr-6 py-2 text-right">
                                                    <div className="flex items-center justify-end">
                                                        <div className="flex items-center border border-[#e5e7eb] rounded-[6px] overflow-hidden bg-white shadow-sm">
                                                            <button 
                                                                title="View Details"
                                                                onClick={() => setViewModal({ isOpen: true, data: sub })}
                                                                className="w-8 h-8 flex items-center justify-center bg-[#ecfdf5] text-[#059669] hover:bg-[#d1fae5] border-r border-[#e5e7eb] transition-colors"
                                                            >
                                                                <Eye size={14} />
                                                            </button>
                                                            <button
                                                                title="Delete Subscription"
                                                                onClick={() => handleDelete(sub.id)}
                                                                className="w-8 h-8 flex items-center justify-center bg-[#fef2f2] text-[#ef4444] hover:bg-[#fee2e2] transition-colors"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="py-12 text-center">
                                                <CreditCard size={32} className="mx-auto text-[#d1d5db] mb-3" />
                                                <h3 className="text-[14px] font-semibold text-[#374151] mb-1">No subscriptions found</h3>
                                                <p className="text-[12px] text-[#6b7280]">Try adjusting your search filters.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-end gap-8 px-8 py-5 border-t border-[#e3e4e8]">
                            <div className="flex items-center gap-3">
                                <span className="text-[13px] text-[#727586]">Items per page:</span>
                                <div className="relative">
                                    <select
                                        value={filters.per_page || 10}
                                        onChange={handlePerPageChange}
                                        className="h-[38px] pl-4 pr-10 bg-white border border-[#e3e4e8] rounded-[6px] text-[13px] text-[#2f3344] font-medium appearance-none cursor-pointer focus:border-[#0a66c2] outline-none"
                                    >
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="20">20</option>
                                        <option value="50">50</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#727586]">
                                        <ChevronDown size={14} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <span className="text-[13px] text-[#2f3344] font-medium">
                                    {subscriptions.from || 0} - {subscriptions.to || 0} of {subscriptions.total || 0}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handlePageChange(subscriptions.prev_page_url)}
                                        disabled={!subscriptions.prev_page_url}
                                        className="w-[34px] h-[34px] flex items-center justify-center rounded-full text-[#0a66c2] hover:bg-[#0a66c2]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(subscriptions.next_page_url)}
                                        disabled={!subscriptions.next_page_url}
                                        className="w-[34px] h-[34px] flex items-center justify-center rounded-full text-[#0a66c2] hover:bg-[#0a66c2]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* View Details Modal */}
            <Modal show={viewModal.isOpen} onClose={() => setViewModal({ isOpen: false, data: null })} maxWidth="2xl">
                {viewModal.data && (
                    <div className="bg-white rounded-xl overflow-hidden">
                        {/* Header */}
                        <div className="bg-[#f8fafc] px-6 py-4 border-b border-[#e5e7eb] flex items-center justify-between">
                            <h2 className="text-[18px] font-bold text-[#0f172a]">Subscription Details</h2>
                            <button onClick={() => setViewModal({ isOpen: false, data: null })} className="text-[#64748b] hover:text-[#0f172a] transition-colors">
                                <XCircle size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {/* User Section */}
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <img 
                                        src={viewModal.data.user?.profile_picture || `https://ui-avatars.com/api/?name=${viewModal.data.user?.name}&background=0a66c2&color=fff`} 
                                        className="w-16 h-16 rounded-lg object-cover border border-[#e5e7eb] shadow-sm"
                                        alt="Avatar"
                                    />
                                    <div>
                                        <h3 className="text-[18px] font-bold text-[#0f172a]">{viewModal.data.user?.name}</h3>
                                        <p className="text-[14px] text-[#64748b]">{viewModal.data.user?.email}</p>
                                        <p className="text-[12px] font-medium text-[#0a66c2] mt-0.5">User ID: #{viewModal.data.user_id}</p>
                                    </div>
                                </div>

                                {/* Timer on the right */}
                                {viewModal.data.expires_at && new Date(viewModal.data.expires_at) > new Date() && (
                                    <div className="flex flex-col items-end">
                                        <div className="flex items-center gap-1.5 text-[#0369a1] mb-1.5">
                                            <Clock size={14} />
                                            <span className="text-[11px] font-bold uppercase tracking-wider">Time Remaining</span>
                                        </div>
                                        <div className="px-3 py-1.5 bg-[#f0f7ff] border border-[#bae6fd] rounded-md shadow-sm">
                                            <CountdownTimer expiresAt={viewModal.data.expires_at} />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                {/* Plan Information */}
                                <div className="bg-[#f8fafc] rounded-lg p-4 border border-[#e5e7eb]">
                                    <h4 className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-4 border-b border-[#e5e7eb] pb-2">Plan Information</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-[11px] text-[#64748b] mb-0.5">Subscribed Plan</p>
                                            <p className="text-[14px] font-semibold text-[#0f172a] flex items-center gap-1.5">
                                                <CreditCard size={14} className="text-[#0a66c2]" />
                                                {viewModal.data.pricing_plan?.name || 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-[#64748b] mb-0.5">Current Status</p>
                                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[11px] font-bold tracking-wide ${
                                                viewModal.data.status === 'active' ? 'bg-[#ecfdf5] text-[#059669]' : 
                                                viewModal.data.status === 'pending' ? 'bg-[#fffbeb] text-[#d97706]' : 
                                                'bg-[#fef2f2] text-[#dc2626]'
                                            }`}>
                                                <span className="text-[6px]">●</span>
                                                {viewModal.data.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-[#64748b] mb-0.5">Auto-Renew</p>
                                            <p className={`text-[13px] font-bold ${viewModal.data.auto_renew ? 'text-green-600' : 'text-slate-500'}`}>
                                                {viewModal.data.auto_renew ? 'Enabled' : 'Disabled'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Billing Dates */}
                                <div className="bg-[#f8fafc] rounded-lg p-4 border border-[#e5e7eb]">
                                    <h4 className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-4 border-b border-[#e5e7eb] pb-2">Billing & Dates</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-[11px] text-[#64748b] mb-0.5">Subscription Started</p>
                                            <p className="text-[14px] font-medium text-[#0f172a]">
                                                {viewModal.data.started_at ? new Date(viewModal.data.started_at).toLocaleString() : 'Not started yet'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-[#64748b] mb-0.5">Expiry / Next Billing</p>
                                            <p className={`text-[14px] font-medium ${new Date(viewModal.data.expires_at) < new Date() ? 'text-red-500 font-bold' : 'text-[#0f172a]'}`}>
                                                {viewModal.data.expires_at ? new Date(viewModal.data.expires_at).toLocaleString() : 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-[#64748b] mb-0.5">Trial Mode</p>
                                            <p className={`text-[13px] font-medium ${viewModal.data.is_trial ? 'text-[#0a66c2]' : 'text-[#64748b]'}`}>
                                                {viewModal.data.is_trial ? 'Yes (Trial Active)' : 'No'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Confirmation Modal */}
            <Modal show={confirmModal.isOpen} onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })} maxWidth="md">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
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
                            className="px-4 py-2 text-[13px] font-bold text-white bg-red-600 hover:bg-red-700 rounded-[8px] transition-colors"
                        >
                            Delete
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
