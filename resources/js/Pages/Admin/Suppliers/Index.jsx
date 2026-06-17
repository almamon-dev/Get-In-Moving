import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Home, MoreVertical, Truck,
    Search, X, Check, AlertCircle, Trash2,
    ChevronDown, ChevronLeft, ChevronRight, ArrowUpDown, Shield
} from 'lucide-react';
import Modal from '@/Components/Modal';

export default function Index({ auth, suppliers, filters = {}, stats }) {
    const [search, setSearch] = useState(filters.search || '');
    const [verified, setVerified] = useState(filters.verified !== undefined ? (filters.verified === '1' ? 'verified' : (filters.verified === '0' ? 'unverified' : 'all')) : 'all');
    const [compliance, setCompliance] = useState(filters.compliance !== undefined ? (filters.compliance === '1' ? 'approved' : (filters.compliance === '0' ? 'pending' : 'all')) : 'all');
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
            route('admin.suppliers.index'),
            { ...filters, ...newFilters },
            { preserveState: true, replace: true }
        );
    };

    const handleStatusChange = (newStatus) => {
        setVerified(newStatus);
        setCompliance('all'); // Reset compliance when status changes
        const statusVal = newStatus === 'all' ? '' : (newStatus === 'verified' ? '1' : '0');
        updateFilters({ verified: statusVal, compliance: '', page: 1 });
    };

    const handleComplianceChange = (newCompliance) => {
        setCompliance(newCompliance);
        setVerified('all'); // Reset verified when compliance changes
        const complianceVal = newCompliance === 'all' ? '' : (newCompliance === 'approved' ? '1' : '0');
        updateFilters({ compliance: complianceVal, verified: '', page: 1 });
    };

    const handlePerPageChange = (e) => {
        updateFilters({ per_page: e.target.value, page: 1 });
    };

    const handlePageChange = (url) => {
        if (url) router.get(url, {}, { preserveState: true });
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === suppliers.data.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(suppliers.data.map(s => s.id));
        }
    };

    const toggleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(prev => prev.filter(i => i !== id));
        } else {
            setSelectedIds(prev => [...prev, id]);
        }
    };

    const handleDelete = (id) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Supplier',
            message: 'Are you sure you want to delete this supplier? This action cannot be undone.',
            action: () => {
                router.delete(route('admin.suppliers.destroy', id), {
                    onSuccess: () => {
                        setConfirmModal({ isOpen: false, title: '', message: '', action: null });
                        setSuccessModal({
                            isOpen: true,
                            title: 'Success!',
                            message: 'Supplier has been successfully deleted.'
                        });
                    }
                });
            }
        });
    };

    const toggleCompliance = (supplier) => {
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

    return (
        <AdminLayout user={auth.user}>
            <Head title="Suppliers" />

            <div className="min-h-screen bg-[#f5f6f8]">
                <div className="w-full mx-auto px-6 py-8">
                    
                    {/* Header Row */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                        <div>
                            <h1 className="text-[24px] font-bold text-[#111827] tracking-tight">Supplier Management</h1>
                            <p className="text-[14px] text-[#6b7280] mt-0.5">Manage supplier compliance, verification, and accounts</p>
                        </div>
                        <div className="flex items-center gap-3 mt-4 md:mt-0">
                            {selectedIds.length > 0 && (
                                <>
                                    <button 
                                        onClick={() => {
                                            setConfirmModal({
                                                isOpen: true,
                                                title: 'Approve Selected Suppliers',
                                                message: 'Are you sure you want to approve compliance for selected suppliers?',
                                                action: () => {
                                                    // Assuming there is a bulk compliance route, else they need to do it one by one
                                                    // For now, close modal
                                                    setConfirmModal({ isOpen: false, title: '', message: '', action: null });
                                                }
                                            });
                                        }}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 border border-green-200 rounded text-[13px] font-medium hover:bg-green-100 transition-colors shadow-sm"
                                    >
                                        <Shield size={16} />
                                        Approve Selected
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setConfirmModal({
                                                isOpen: true,
                                                title: 'Delete Selected Suppliers',
                                                message: 'Are you sure you want to delete selected suppliers?',
                                                action: () => {
                                                    // Bulk destroy route assuming it exists or keep for UI
                                                    setConfirmModal({ isOpen: false, title: '', message: '', action: null });
                                                }
                                            });
                                        }}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded text-[13px] font-medium hover:bg-red-100 transition-colors shadow-sm"
                                    >
                                        <Trash2 size={16} />
                                        Delete Selected ({selectedIds.length})
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Main Container */}
                    <div className="bg-white rounded-md border border-[#e5e7eb] shadow-sm">
                        
                        {/* Tabs Row */}
                        <div className="flex items-center gap-6 px-6 border-b border-[#e5e7eb] overflow-x-auto">
                            {[
                                { name: 'All', value: 'all', count: stats.total, click: () => handleStatusChange('all') },
                                { name: 'Verified', value: 'verified', count: stats.verified, click: () => handleStatusChange('verified') },
                                { name: 'Compliance Approved', value: 'approved', count: stats.compliance_verified, click: () => handleComplianceChange('approved') },
                                { name: 'Pending Review', value: 'pending', count: stats.compliance_pending, click: () => handleComplianceChange('pending') }
                            ].map((tab) => {
                                const isActive = (tab.value === 'all' && verified === 'all' && compliance === 'all') || 
                                                 (tab.value === 'verified' && verified === 'verified') || 
                                                 (tab.value === 'approved' && compliance === 'approved') || 
                                                 (tab.value === 'pending' && compliance === 'pending');
                                
                                return (
                                    <button
                                        key={tab.name}
                                        onClick={tab.click}
                                        className={`flex items-center gap-2 py-3.5 text-[14px] font-medium border-b-2 whitespace-nowrap transition-colors ${
                                            isActive 
                                                ? 'border-[#673ab7] text-[#673ab7]' 
                                                : 'border-transparent text-[#6b7280] hover:text-[#374151] hover:border-gray-300'
                                        }`}
                                    >
                                        {tab.name}
                                        <span className="bg-[#f3f4f6] text-[#4b5563] text-[11px] px-2 py-0.5 rounded-full font-bold">
                                            {tab.count}
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
                                    placeholder="Search by name, email, company, or policy number..." 
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
                                            className={`w-[18px] h-[18px] border-[2px] rounded cursor-pointer transition-all flex items-center justify-center ${selectedIds.length === suppliers.data.length && suppliers.data.length > 0
                                                    ? 'bg-[#673ab7] border-[#673ab7]'
                                                    : 'border-[#c3c4ca] hover:border-[#673ab7]'
                                                }`}
                                        >
                                            {selectedIds.length === suppliers.data.length && suppliers.data.length > 0 && <Check size={12} className="text-white" />}
                                        </div>
                                    </th>
                                    <th className="text-left px-4 py-3 text-[12px] font-bold text-[#2f3344] uppercase tracking-wider">
                                        <div className="flex items-center gap-1.5 cursor-pointer hover:text-black group">
                                            Supplier
                                            <ArrowUpDown size={12} className="text-[#a0a3af] group-hover:text-[#673ab7]" />
                                        </div>
                                    </th>
                                    <th className="text-left px-4 py-3 text-[12px] font-bold text-[#2f3344] uppercase tracking-wider">
                                        Company
                                    </th>
                                    <th className="text-center px-4 py-3 text-[12px] font-bold text-[#2f3344] uppercase tracking-wider">
                                        Plan
                                    </th>
                                    <th className="text-left px-4 py-3 text-[12px] font-bold text-[#2f3344] uppercase tracking-wider">
                                        Insurance
                                    </th>
                                    <th className="text-left px-4 py-3 text-[12px] font-bold text-[#2f3344] uppercase tracking-wider">
                                        Policy Expiry
                                    </th>
                                    <th className="text-left px-4 py-3 text-[12px] font-bold text-[#2f3344] uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f1f2f4]">
                                {suppliers.data.length > 0 ? (
                                    suppliers.data.map((supplier) => (
                                        <tr
                                            key={supplier.id}
                                            className={`hover:bg-[#fafbfc] transition-colors group ${selectedIds.includes(supplier.id) ? 'bg-[#f4f0ff]/50' : ''}`}
                                        >
                                            <td className="pl-6 pr-3 py-2">
                                                <div
                                                    onClick={() => toggleSelect(supplier.id)}
                                                    className={`w-[18px] h-[18px] border-[2px] rounded cursor-pointer transition-all flex items-center justify-center ${selectedIds.includes(supplier.id)
                                                            ? 'bg-[#673ab7] border-[#673ab7]'
                                                            : 'border-[#c3c4ca] hover:border-[#673ab7]'
                                                        }`}
                                                >
                                                    {selectedIds.includes(supplier.id) && <Check size={12} className="text-white" />}
                                                </div>
                                            </td>
                                            <td className="px-4 py-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2c8af8] to-[#1a7ae8] flex items-center justify-center text-white font-bold text-[12px]">
                                                        {supplier.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <p className="text-[13px] font-bold text-[#2f3344] group-hover:text-[#673ab7] transition-colors leading-tight">
                                                            {supplier.name}
                                                        </p>
                                                        <p className="text-[11px] text-[#727586] font-normal leading-tight mt-0.5">
                                                            {supplier.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2">
                                                <span className="text-[12px] font-medium text-[#2f3344]">
                                                    {supplier.company_name}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[12px] font-medium text-[#673ab7] leading-tight">
                                                        {supplier.user_subscription?.pricing_plan?.name || 'No Plan'}
                                                    </span>
                                                    {supplier.user_subscription?.expires_at && (
                                                        <span className="text-[11px] text-[#727586] leading-tight mt-0.5">
                                                            Exp: {new Date(supplier.user_subscription.expires_at).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-2">
                                                <div className="flex flex-col">
                                                    <p className="text-[12px] text-[#2f3344] font-medium leading-tight">
                                                        {supplier.insurance_provider_name}
                                                    </p>
                                                    <p className="text-[11px] text-[#727586] leading-tight mt-0.5">
                                                        {supplier.policy_number}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2">
                                                <span className="text-[12px] text-[#727586]">
                                                    {new Date(supplier.policy_expiry_date).toLocaleDateString()}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1.5">
                                                        {supplier.is_verified ? (
                                                            <>
                                                                <div className="w-[14px] h-[14px] rounded-full border-[1.5px] border-[#00b090] flex items-center justify-center text-[#00b090]">
                                                                    <Check size={9} strokeWidth={3} />
                                                                </div>
                                                                <span className="text-[12px] font-medium text-[#2f3344]">Verified</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="w-[14px] h-[14px] rounded-full border-[1.5px] border-[#ffb000] flex items-center justify-center text-[#ffb000]">
                                                                    <AlertCircle size={9} strokeWidth={3} />
                                                                </div>
                                                                <span className="text-[12px] font-medium text-[#2f3344]">Unverified</span>
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        {supplier.is_compliance_verified ? (
                                                            <>
                                                                <div className="w-[14px] h-[14px] rounded-full border-[1.5px] border-[#2c8af8] flex items-center justify-center text-[#2c8af8]">
                                                                    <Shield size={9} strokeWidth={3} />
                                                                </div>
                                                                <span className="text-[12px] font-medium text-[#2f3344]">Compliance ✓</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="w-[14px] h-[14px] rounded-full border-[1.5px] border-[#ffb000] flex items-center justify-center text-[#ffb000]">
                                                                    <AlertCircle size={9} strokeWidth={3} />
                                                                </div>
                                                                <span className="text-[12px] font-medium text-[#2f3344]">Pending</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="pr-6 py-2 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Link
                                                        href={route('admin.suppliers.show', supplier.id)}
                                                        className="h-[28px] inline-flex items-center bg-white border border-[#e3e4e8] text-[#2f3344] px-3 rounded text-[12px] font-bold hover:border-[#673ab7] hover:text-[#673ab7] transition-all"
                                                    >
                                                        View
                                                    </Link>
                                                    <button
                                                        onClick={() => toggleCompliance(supplier)}
                                                        className={`h-[28px] inline-flex items-center px-3 rounded font-bold text-[12px] transition-all ${supplier.is_compliance_verified
                                                                ? 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                                                                : 'bg-green-50 text-green-600 hover:bg-green-100'
                                                            }`}
                                                    >
                                                        {supplier.is_compliance_verified ? 'Revoke' : 'Approve'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(supplier.id)}
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
                                        <td colSpan="7" className="px-7 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3 text-[#727586]">
                                                <div className="w-16 h-16 bg-[#f8f9fa] rounded-full flex items-center justify-center mb-2">
                                                    <Search size={30} className="text-[#c3c4ca]" />
                                                </div>
                                                <p className="text-[16px] font-bold text-[#2f3344]">No suppliers found</p>
                                                <p className="text-[14px]">Try adjusting your search or filters.</p>
                                                <button
                                                    onClick={() => { setSearch(''); handleStatusChange('all'); handleComplianceChange('all'); }}
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
                            <span className="text-[13px] text-[#727586]">Items per page:</span>
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
                                {suppliers.from || 0} - {suppliers.to || 0} of {suppliers.total || 0}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePageChange(suppliers.prev_page_url)}
                                    disabled={!suppliers.prev_page_url}
                                    className="w-[34px] h-[34px] flex items-center justify-center rounded-full text-[#673ab7] hover:bg-[#673ab7]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={() => handlePageChange(suppliers.next_page_url)}
                                    disabled={!suppliers.next_page_url}
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
