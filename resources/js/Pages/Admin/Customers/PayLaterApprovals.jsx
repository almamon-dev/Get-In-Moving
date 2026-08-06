import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import {
    Search,
    Edit3,
    Eye,
    X,
    CreditCard,
    Check,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import Modal from "@/Components/Modal";

export default function PayLaterApprovals({ auth, requests, filters = {}, stats }) {
    const [search, setSearch] = useState(filters.search || "");
    const [selectedUser, setSelectedUser] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);

    const activeType = filters.type || "activation";

    const { data, setData, patch, processing, reset } = useForm({
        pay_later_status: "approved",
        pay_later_credit_limit: 5000,
        pay_later_daily_limit: 1000,
        pay_later_weekly_limit: 2500,
        pay_later_rejection_reason: "",
    });

    const updateFilters = (newFilters) => {
        router.get(
            route("admin.pay-later-approvals.index"),
            { ...filters, ...newFilters },
            { preserveState: true, replace: true }
        );
    };

    const handleSearch = (value) => {
        setSearch(value);
        updateFilters({ search: value, page: 1 });
    };

    const handleTypeChange = (newType) => {
        updateFilters({ type: newType, page: 1 });
    };

    const openReviewModal = (reqUser) => {
        const targetUser = reqUser.user || reqUser;
        const facility = targetUser.pay_later_facility || targetUser.payLaterFacility || {};
        setSelectedUser(targetUser);
        setData({
            pay_later_status: targetUser.pay_later_status === "pending" ? "approved" : (targetUser.pay_later_status || "approved"),
            pay_later_credit_limit: targetUser.pay_later_credit_limit || facility.credit_limit || 5000,
            pay_later_daily_limit: targetUser.pay_later_daily_limit ?? facility.daily_limit ?? 1000,
            pay_later_weekly_limit: targetUser.pay_later_weekly_limit ?? facility.weekly_limit ?? 2500,
            pay_later_rejection_reason: targetUser.pay_later_rejection_reason || "",
        });
        setShowReviewModal(true);
    };

    const submitReview = (e) => {
        e.preventDefault();
        if (!selectedUser) return;

        patch(route("admin.customers.pay-later-status", selectedUser.id), {
            onSuccess: () => {
                setShowReviewModal(false);
                reset();
            },
        });
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Pay Later Approvals" />

            <div className="min-h-screen">
                <div className="w-full mx-auto px-6 py-8">
                    
                    {/* Header Row */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                        <div>
                            <h1 className="text-[24px] font-bold text-[#111827] tracking-tight">Pay Later Applications</h1>
                            <p className="text-[14px] text-[#6b7280] mt-0.5">Review deferred invoice credit limit requests and configure spending caps</p>
                        </div>
                    </div>

                    {/* Main Container matching Index.jsx */}
                    <div className="bg-white rounded-md border border-[#e5e7eb] shadow-sm">
                        
                        {/* Tabs Row */}
                        <div className="flex items-center gap-6 px-6 border-b border-[#e5e7eb] overflow-x-auto">
                            {[
                                { key: "activation", label: "Activation Requests", count: stats?.activation || 0 },
                                { key: "increase", label: "Limit Increase Requests", count: stats?.increase || 0 },
                                { key: "history", label: "Processed History", count: stats?.history || 0 },
                            ].map((tab) => {
                                const isActive = activeType === tab.key;
                                return (
                                    <button
                                        key={tab.key}
                                        onClick={() => handleTypeChange(tab.key)}
                                        className={`flex items-center gap-2 py-3.5 text-[14px] font-medium border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                                            isActive
                                                ? "border-[#673ab7] text-[#673ab7]"
                                                : "border-transparent text-[#6b7280] hover:text-[#374151] hover:border-gray-300"
                                        }`}
                                    >
                                        {tab.label}
                                        <span className="bg-[#f3f4f6] text-[#4b5563] text-[11px] px-2 py-0.5 rounded-full font-bold">
                                            {tab.count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Search Toolbar */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 border-b border-[#e5e7eb]">
                            <div className="relative w-full md:w-[400px]">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                                <input
                                    type="text"
                                    placeholder="Search by customer name, email, or company..."
                                    value={search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="w-full h-10 pl-10 pr-4 bg-white border border-[#d1d5db] rounded-[4px] text-[13px] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] placeholder:text-[#9ca3af]"
                                />
                            </div>
                        </div>

                        {/* Table Area */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[#e3e4e8] bg-gray-50/50">
                                        <th className="text-left px-6 py-3 text-[12px] font-bold text-[#2f3344] uppercase tracking-wider">
                                            Customer / Company
                                        </th>
                                        <th className="text-left px-4 py-3 text-[12px] font-bold text-[#2f3344] uppercase tracking-wider">
                                            Facility Status
                                        </th>
                                        <th className="text-left px-4 py-3 text-[12px] font-bold text-[#2f3344] uppercase tracking-wider">
                                            Total Limit
                                        </th>
                                        <th className="text-left px-4 py-3 text-[12px] font-bold text-[#2f3344] uppercase tracking-wider">
                                            Daily Cap
                                        </th>
                                        <th className="text-left px-4 py-3 text-[12px] font-bold text-[#2f3344] uppercase tracking-wider">
                                            Weekly Cap
                                        </th>
                                        <th className="text-left px-4 py-3 text-[12px] font-bold text-[#2f3344] uppercase tracking-wider">
                                            Requested Date
                                        </th>
                                        <th className="text-right px-6 py-3 text-[12px] font-bold text-[#2f3344] uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#e5e7eb]">
                                    {requests.data && requests.data.length > 0 ? (
                                        requests.data.map((req) => {
                                            const u = req.user || req;
                                            const facility = u.pay_later_facility || u.payLaterFacility || {};
                                            const statusVal = u.pay_later_status || req.status || "pending";

                                            return (
                                                <tr key={req.id || u.id} className="hover:bg-[#f9fafb] transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div>
                                                            <p className="text-[14px] font-bold text-[#111827]">{u.name}</p>
                                                            <p className="text-[12px] text-[#6b7280]">{u.company_name || u.email}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                                                            statusVal === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                                            statusVal === 'pending' || statusVal === 'under_review' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                                            'bg-rose-50 text-rose-700 border border-rose-200'
                                                        }`}>
                                                            {statusVal}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-[13px] font-bold text-[#673ab7]">
                                                        €{Number(req.requested_limit || u.pay_later_credit_limit || facility.credit_limit || 5000).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-[13px] font-semibold text-blue-600">
                                                        {Number(u.pay_later_daily_limit || facility.daily_limit || 0) > 0
                                                            ? `€${Number(u.pay_later_daily_limit || facility.daily_limit).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                                                            : 'Unlimited'}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-[13px] font-semibold text-purple-600">
                                                        {Number(u.pay_later_weekly_limit || facility.weekly_limit || 0) > 0
                                                            ? `€${Number(u.pay_later_weekly_limit || facility.weekly_limit).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                                                            : 'Unlimited'}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-[13px] text-[#6b7280]">
                                                        {req.created_at ? new Date(req.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => openReviewModal(req)}
                                                                className="px-3 py-1.5 bg-[#673ab7] hover:bg-[#5e35b1] text-white text-[12px] font-bold rounded transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                                                            >
                                                                <Edit3 size={14} />
                                                                <span>Review</span>
                                                            </button>
                                                            <Link
                                                                href={route("admin.customers.show", u.id)}
                                                                className="p-1.5 text-[#6b7280] hover:text-[#111827] hover:bg-gray-100 rounded transition-colors"
                                                                title="View Profile"
                                                            >
                                                                <Eye size={16} />
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="p-8 text-center text-[#9ca3af] text-[13px]">
                                                No Pay Later applications found matching your criteria.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>

            {/* Review & Edit Facility Modal */}
            {showReviewModal && selectedUser && (
                <Modal show={showReviewModal} onClose={() => setShowReviewModal(false)} maxWidth="md">
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded bg-purple-50 flex items-center justify-center text-[#673ab7]">
                                    <CreditCard size={20} />
                                </div>
                                <div>
                                    <h3 className="text-[16px] font-bold text-[#111827]">Review Pay Later Facility</h3>
                                    <p className="text-[12px] text-[#6b7280]">{selectedUser.name} ({selectedUser.company_name || selectedUser.email})</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowReviewModal(false)}
                                className="text-[#9ca3af] hover:text-[#111827] p-1 rounded transition-colors cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={submitReview} className="space-y-4">
                            <div>
                                <label className="block text-[13px] font-semibold text-[#374151] mb-1">
                                    Application Status
                                </label>
                                <select
                                    value={data.pay_later_status}
                                    onChange={(e) => setData("pay_later_status", e.target.value)}
                                    className="w-full text-[13px] px-3 py-2 border border-[#d1d5db] rounded-[4px] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7]"
                                >
                                    <option value="approved">Approved</option>
                                    <option value="pending">Under Review / Pending</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-[12px] font-semibold text-[#374151] mb-1">
                                        Total Limit (€)
                                    </label>
                                    <input
                                        type="number"
                                        step="100"
                                        value={data.pay_later_credit_limit}
                                        onChange={(e) => setData("pay_later_credit_limit", e.target.value)}
                                        className="w-full text-[13px] px-3 py-2 border border-[#d1d5db] rounded-[4px] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7]"
                                        placeholder="5000"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[12px] font-semibold text-[#374151] mb-1">
                                        Daily Cap (€)
                                    </label>
                                    <input
                                        type="number"
                                        step="50"
                                        value={data.pay_later_daily_limit}
                                        onChange={(e) => setData("pay_later_daily_limit", e.target.value)}
                                        className="w-full text-[13px] px-3 py-2 border border-[#d1d5db] rounded-[4px] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7]"
                                        placeholder="0 = Unlimited"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[12px] font-semibold text-[#374151] mb-1">
                                        Weekly Cap (€)
                                    </label>
                                    <input
                                        type="number"
                                        step="100"
                                        value={data.pay_later_weekly_limit}
                                        onChange={(e) => setData("pay_later_weekly_limit", e.target.value)}
                                        className="w-full text-[13px] px-3 py-2 border border-[#d1d5db] rounded-[4px] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7]"
                                        placeholder="0 = Unlimited"
                                    />
                                </div>
                            </div>

                            {data.pay_later_status === "rejected" && (
                                <div>
                                    <label className="block text-[13px] font-semibold text-rose-600 mb-1">
                                        Rejection Reason
                                    </label>
                                    <textarea
                                        value={data.pay_later_rejection_reason}
                                        onChange={(e) => setData("pay_later_rejection_reason", e.target.value)}
                                        className="w-full text-[13px] px-3 py-2 border border-rose-200 rounded-[4px] focus:outline-none focus:border-rose-500 text-rose-900"
                                        placeholder="Specify why the application was rejected..."
                                        rows={2}
                                        required
                                    />
                                </div>
                            )}

                            <div className="pt-4 border-t border-[#e5e7eb] flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowReviewModal(false)}
                                    className="px-4 py-2 border border-[#d1d5db] text-[#374151] rounded-[4px] text-[13px] font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-[#673ab7] hover:bg-[#5e35b1] text-white rounded-[4px] text-[13px] font-bold transition-colors shadow-sm disabled:opacity-50"
                                >
                                    Save Facility Settings
                                </button>
                            </div>
                        </form>
                    </div>
                </Modal>
            )}
        </AdminLayout>
    );
}
