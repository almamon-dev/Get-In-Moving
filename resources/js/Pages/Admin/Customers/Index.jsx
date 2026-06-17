import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
    Home,
    MoreVertical,
    Plus,
    Users,
    Search,
    X,
    Check,
    AlertCircle,
    Trash2,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ArrowUpDown,
} from "lucide-react";
import Modal from '@/Components/Modal';

export default function Index({ auth, customers, filters = {}, stats }) {
    const [search, setSearch] = useState(filters.search || "");
    const [verified, setVerified] = useState(
        filters.verified !== undefined
            ? filters.verified === "1"
                ? "verified"
                : filters.verified === "0"
                  ? "unverified"
                  : "all"
            : "all",
    );
    const [selectedIds, setSelectedIds] = useState([]);
    const [showPromo, setShowPromo] = useState(true);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', action: null });
    const [successModal, setSuccessModal] = useState({ isOpen: false, title: '', message: '' });

    const handleSearch = (value) => {
        setSearch(value);
        updateFilters({ search: value, page: 1 });
    };

    const updateFilters = (newFilters) => {
        router.get(
            route("admin.customers.index"),
            { ...filters, ...newFilters },
            { preserveState: true, replace: true },
        );
    };

    const handleStatusChange = (newStatus) => {
        setVerified(newStatus);
        const statusVal =
            newStatus === "all" ? "" : newStatus === "verified" ? "1" : "0";
        updateFilters({ verified: statusVal, page: 1 });
    };

    const handlePerPageChange = (e) => {
        updateFilters({ per_page: e.target.value, page: 1 });
    };

    const handlePageChange = (url) => {
        if (url) router.get(url, {}, { preserveState: true });
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === customers.data.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(customers.data.map((c) => c.id));
        }
    };

    const toggleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds((prev) => prev.filter((i) => i !== id));
        } else {
            setSelectedIds((prev) => [...prev, id]);
        }
    };

    const handleDelete = (id) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Customer',
            message: 'Are you sure you want to delete this customer? This action cannot be undone.',
            action: () => {
                router.delete(route('admin.customers.destroy', id), {
                    onSuccess: () => {
                        setConfirmModal({ isOpen: false, title: '', message: '', action: null });
                        setSuccessModal({
                            isOpen: true,
                            title: 'Success!',
                            message: 'Customer has been successfully deleted.'
                        });
                    }
                });
            }
        });
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Customers" />

            <div className="min-h-screen bg-[#f5f6f8]">
                <div className="w-full mx-auto px-6 py-8">
                    
                    {/* Header Row */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                        <div>
                            <h1 className="text-[24px] font-bold text-[#111827] tracking-tight">Customer Management</h1>
                            <p className="text-[14px] text-[#6b7280] mt-0.5">Manage your customer base, verification status, and accounts</p>
                        </div>
                        <div className="flex items-center gap-3 mt-4 md:mt-0">
                            {selectedIds.length > 0 && (
                                <button 
                                    onClick={() => {
                                        setConfirmModal({
                                            isOpen: true,
                                            title: 'Delete Selected Customers',
                                            message: 'Are you sure you want to delete selected customers?',
                                            action: () => {
                                                router.post(route('admin.customers.bulk-destroy'), { ids: selectedIds }, {
                                                    onSuccess: () => {
                                                        setSelectedIds([]);
                                                        setConfirmModal({ isOpen: false, title: '', message: '', action: null });
                                                        setSuccessModal({
                                                            isOpen: true,
                                                            title: 'Success!',
                                                            message: 'Selected customers have been successfully deleted.'
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }}
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
                            {['All', 'Verified', 'Unverified'].map((tab) => {
                                const tabValue = tab.toLowerCase();
                                const isActive = verified === tabValue;
                                
                                return (
                                    <button
                                        key={tab}
                                        onClick={() => handleStatusChange(tabValue)}
                                        className={`flex items-center gap-2 py-3.5 text-[14px] font-medium border-b-2 whitespace-nowrap transition-colors ${
                                            isActive 
                                                ? 'border-[#673ab7] text-[#673ab7]' 
                                                : 'border-transparent text-[#6b7280] hover:text-[#374151] hover:border-gray-300'
                                        }`}
                                    >
                                        {tab}
                                        <span className="bg-[#f3f4f6] text-[#4b5563] text-[11px] px-2 py-0.5 rounded-full font-bold">
                                            {tab === 'All' ? stats.total : tab === 'Verified' ? stats.verified : stats.unverified}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Search & Filter Toolbar */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 border-b border-[#e5e7eb]">
                            <div className="relative w-full md:w-[400px]">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                                <input 
                                    type="text" 
                                    placeholder="Search by name, email, phone, or company..." 
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
                                <tr className="border-b border-[#e3e4e8]">
                                    <th className="pl-6 pr-3 py-3 w-10">
                                        <div
                                            onClick={toggleSelectAll}
                                            className={`w-[18px] h-[18px] border-[2px] rounded cursor-pointer transition-all flex items-center justify-center ${
                                                selectedIds.length ===
                                                    customers.data.length &&
                                                customers.data.length > 0
                                                    ? "bg-[#673ab7] border-[#673ab7]"
                                                    : "border-[#c3c4ca] hover:border-[#673ab7]"
                                            }`}
                                        >
                                            {selectedIds.length ===
                                                customers.data.length &&
                                                customers.data.length > 0 && (
                                                    <Check
                                                        size={12}
                                                        className="text-white"
                                                    />
                                                )}
                                        </div>
                                    </th>
                                    <th className="text-left px-4 py-3 text-[12px] font-bold text-[#2f3344] uppercase tracking-wider">
                                        <div className="flex items-center gap-1.5 cursor-pointer hover:text-black group">
                                            Customer
                                            <ArrowUpDown
                                                size={12}
                                                className="text-[#a0a3af] group-hover:text-[#673ab7]"
                                            />
                                        </div>
                                    </th>
                                    <th className="text-left px-4 py-3 text-[12px] font-bold text-[#2f3344] uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th className="text-left px-4 py-3 text-[12px] font-bold text-[#2f3344] uppercase tracking-wider">
                                        Company
                                    </th>
                                    <th className="text-center px-4 py-3 text-[12px] font-bold text-[#2f3344] uppercase tracking-wider">
                                        Plan
                                    </th>
                                    <th className="text-left px-4 py-3 text-[12px] font-bold text-[#2f3344] uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="text-left px-4 py-3 text-[12px] font-bold text-[#2f3344] uppercase tracking-wider">
                                        Joined
                                    </th>
                                    <th className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f1f2f4]">
                                {customers.data.length > 0 ? (
                                    customers.data.map((customer) => (
                                        <tr
                                            key={customer.id}
                                            className={`hover:bg-[#fafbfc] transition-colors group ${selectedIds.includes(customer.id) ? "bg-[#f4f0ff]/50" : ""}`}
                                        >
                                            <td className="pl-6 pr-3 py-2">
                                                <div
                                                    onClick={() =>
                                                        toggleSelect(
                                                            customer.id,
                                                        )
                                                    }
                                                    className={`w-[18px] h-[18px] border-[2px] rounded cursor-pointer transition-all flex items-center justify-center ${
                                                        selectedIds.includes(
                                                            customer.id,
                                                        )
                                                            ? "bg-[#673ab7] border-[#673ab7]"
                                                            : "border-[#c3c4ca] hover:border-[#673ab7]"
                                                    }`}
                                                >
                                                    {selectedIds.includes(
                                                        customer.id,
                                                    ) && (
                                                        <Check
                                                            size={12}
                                                            className="text-white"
                                                        />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#673ab7] to-[#9c27b0] flex items-center justify-center text-white font-bold text-[12px]">
                                                        {customer.name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <p className="text-[13px] font-bold text-[#2f3344] group-hover:text-[#673ab7] transition-colors leading-tight">
                                                            {customer.name}
                                                        </p>
                                                        <p className="text-[11px] text-[#727586] font-normal leading-tight mt-0.5">
                                                            {customer.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2">
                                                <span className="text-[12px] text-[#727586]">
                                                    {customer.phone_number ||
                                                        "N/A"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2">
                                                <span className="text-[12px] text-[#727586]">
                                                    {customer.company_name ||
                                                        "N/A"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[12px] font-medium text-[#673ab7] leading-tight">
                                                        {customer.user_subscription
                                                            ?.pricing_plan
                                                            ?.name || "No Plan"}
                                                    </span>
                                                    {customer.user_subscription
                                                        ?.expires_at && (
                                                        <span className="text-[11px] text-[#727586] leading-tight mt-0.5">
                                                            Exp:{" "}
                                                            {new Date(
                                                                customer
                                                                    .user_subscription
                                                                    .expires_at,
                                                            ).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-2">
                                                <div className="flex items-center gap-1.5">
                                                    {customer.is_verified ? (
                                                        <>
                                                            <div className="w-[14px] h-[14px] rounded-full border-[1.5px] border-[#00b090] flex items-center justify-center text-[#00b090]">
                                                                <Check
                                                                    size={9}
                                                                    strokeWidth={
                                                                        3
                                                                    }
                                                                />
                                                            </div>
                                                            <span className="text-[12px] font-medium text-[#2f3344]">
                                                                Verified
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="w-[14px] h-[14px] rounded-full border-[1.5px] border-[#ffb000] flex items-center justify-center text-[#ffb000]">
                                                                <AlertCircle
                                                                    size={9}
                                                                    strokeWidth={
                                                                        3
                                                                    }
                                                                />
                                                            </div>
                                                            <span className="text-[12px] font-medium text-[#2f3344]">
                                                                Unverified
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-2">
                                                <span className="text-[12px] text-[#727586]">
                                                    {new Date(
                                                        customer.created_at,
                                                    ).toLocaleDateString()}
                                                </span>
                                            </td>
                                            <td className="pr-6 py-2 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Link
                                                        href={route(
                                                            "admin.customers.show",
                                                            customer.id,
                                                        )}
                                                        className="h-[28px] inline-flex items-center bg-white border border-[#e3e4e8] text-[#2f3344] px-3 rounded text-[12px] font-bold hover:border-[#673ab7] hover:text-[#673ab7] transition-all"
                                                    >
                                                        View
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                customer.id,
                                                            )
                                                        }
                                                        className="w-7 h-7 flex items-center justify-center text-[#727586] hover:bg-red-50 hover:text-red-600 rounded transition-all"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-7 py-20 text-center"
                                        >
                                            <div className="flex flex-col items-center gap-3 text-[#727586]">
                                                <div className="w-16 h-16 bg-[#f8f9fa] rounded-full flex items-center justify-center mb-2">
                                                    <Search
                                                        size={30}
                                                        className="text-[#c3c4ca]"
                                                    />
                                                </div>
                                                <p className="text-[16px] font-bold text-[#2f3344]">
                                                    No customers found
                                                </p>
                                                <p className="text-[14px]">
                                                    Try adjusting your search or
                                                    filters.
                                                </p>
                                                <button
                                                    onClick={() => {
                                                        setSearch("");
                                                        handleStatusChange(
                                                            "all",
                                                        );
                                                    }}
                                                    className="mt-2 text-[#673ab7] font-bold text-[14px] hover:underline"
                                                >
                                                    Clear filters
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-end gap-8 px-8 py-5 border-t border-[#e3e4e8]">
                        <div className="flex items-center gap-3">
                            <span className="text-[13px] text-[#727586]">
                                Items per page:
                            </span>
                            <div className="relative">
                                <select
                                    value={filters.per_page || 10}
                                    onChange={handlePerPageChange}
                                    className="h-[38px] pl-4 pr-10 bg-white border border-[#e3e4e8] rounded-[6px] text-[13px] text-[#2f3344] font-medium appearance-none cursor-pointer focus:border-[#673ab7] outline-none"
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
                                {customers.from || 0} - {customers.to || 0} of{" "}
                                {customers.total || 0}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() =>
                                        handlePageChange(
                                            customers.prev_page_url,
                                        )
                                    }
                                    disabled={!customers.prev_page_url}
                                    className="w-[34px] h-[34px] flex items-center justify-center rounded-full text-[#673ab7] hover:bg-[#673ab7]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={() =>
                                        handlePageChange(
                                            customers.next_page_url,
                                        )
                                    }
                                    disabled={!customers.next_page_url}
                                    className="w-[34px] h-[34px] flex items-center justify-center rounded-full text-[#673ab7] hover:bg-[#673ab7]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
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
