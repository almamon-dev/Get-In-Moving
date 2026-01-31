import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Home, MoreVertical, Truck, 
    Search, X, Check, AlertCircle, Trash2,
    ChevronDown, ChevronLeft, ChevronRight, ArrowUpDown, Shield 
} from 'lucide-react';

export default function Index({ auth, suppliers, filters = {}, stats }) {
    const [search, setSearch] = useState(filters.search || '');
    const [verified, setVerified] = useState(filters.verified !== undefined ? (filters.verified === '1' ? 'verified' : (filters.verified === '0' ? 'unverified' : 'all')) : 'all');
    const [compliance, setCompliance] = useState(filters.compliance !== undefined ? (filters.compliance === '1' ? 'approved' : (filters.compliance === '0' ? 'pending' : 'all')) : 'all');
    const [selectedIds, setSelectedIds] = useState([]);
    const [showPromo, setShowPromo] = useState(true);

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
        const statusVal = newStatus === 'all' ? '' : (newStatus === 'verified' ? '1' : '0');
        updateFilters({ verified: statusVal, page: 1 });
    };

    const handleComplianceChange = (newCompliance) => {
        setCompliance(newCompliance);
        const complianceVal = newCompliance === 'all' ? '' : (newCompliance === 'approved' ? '1' : '0');
        updateFilters({ compliance: complianceVal, page: 1 });
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
        if (confirm('Are you sure you want to delete this supplier?')) {
            router.delete(route('admin.suppliers.destroy', id));
        }
    };

    const toggleCompliance = (supplier) => {
        if (confirm(`Are you sure you want to ${supplier.is_compliance_verified ? 'revoke' : 'approve'} compliance for this supplier?`)) {
            router.patch(route('admin.suppliers.compliance', supplier.id), {
                is_compliance_verified: !supplier.is_compliance_verified,
            });
        }
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Suppliers" />

            <div className="space-y-6 max-w-8xl mx-auto pb-20">
                {/* Top Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-[24px] font-bold text-[#2f3344] tracking-tight">
                            Supplier Management
                        </h1>
                        <div className="flex items-center gap-2 text-[13px] text-[#727586] mt-1">
                            <Home size={16} className="text-[#727586]" />
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Suppliers</span>
                        </div>
                    </div>
                </div>

                {/* Promo Banner */}
                {showPromo && (
                    <div className="relative bg-[#f4f0ff] rounded-[12px] p-6 border border-[#e9e3ff] overflow-hidden flex items-center justify-between">
                        <div className="flex-1">
                            <h2 className="text-[18px] font-bold text-[#2f3344] mb-1">
                                Manage supplier compliance and verification
                            </h2>
                            <p className="text-[14px] text-[#727586]">
                                Review insurance documents, approve compliance, and manage supplier accounts.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-[100px] h-[60px] relative hidden md:block">
                                <div className="absolute right-0 top-0 text-[#673ab7] opacity-20 transform rotate-12">
                                    <Truck size={40} />
                                </div>
                                <div className="absolute right-10 bottom-0 text-[#673ab7] opacity-20">
                                    <Shield size={30} />
                                </div>
                            </div>
                            <button 
                                onClick={() => setShowPromo(false)}
                                className="w-8 h-8 flex items-center justify-center bg-white rounded-lg border border-[#e3e4e8] text-[#727586] hover:bg-slate-50 transition-all"
                            >
                                <ChevronDown size={18} />
                            </button>
                        </div>
                        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#673ab7]/5 to-transparent pointer-events-none"></div>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-[12px] border border-[#e3e4e8] p-6 shadow-sm">
                        <div className="text-[13px] font-medium text-[#727586] uppercase tracking-wider">Total Suppliers</div>
                        <div className="mt-2 text-[32px] font-bold text-[#2f3344]">{stats.total}</div>
                    </div>
                    <div className="bg-white rounded-[12px] border border-[#e3e4e8] p-6 shadow-sm">
                        <div className="text-[13px] font-medium text-[#727586] uppercase tracking-wider">Verified</div>
                        <div className="mt-2 text-[32px] font-bold text-[#00b090]">{stats.verified}</div>
                    </div>
                    <div className="bg-white rounded-[12px] border border-[#e3e4e8] p-6 shadow-sm">
                        <div className="text-[13px] font-medium text-[#727586] uppercase tracking-wider">Compliance Approved</div>
                        <div className="mt-2 text-[32px] font-bold text-[#2c8af8]">{stats.compliance_verified}</div>
                    </div>
                    <div className="bg-white rounded-[12px] border border-[#e3e4e8] p-6 shadow-sm">
                        <div className="text-[13px] font-medium text-[#727586] uppercase tracking-wider">Pending Review</div>
                        <div className="mt-2 text-[32px] font-bold text-[#ffb000]">{stats.compliance_pending}</div>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                    {/* Filter Tabs */}
                    <div className="px-6 border-b border-[#e3e4e8]">
                        <div className="flex gap-10">
                            <button
                                onClick={() => handleStatusChange('all')}
                                className={`pt-5 pb-4 text-[14px] font-bold transition-all relative ${
                                    verified === 'all' ? 'text-[#673ab7]' : 'text-[#727586] hover:text-[#2f3344]'
                                }`}
                            >
                                All suppliers
                                {verified === 'all' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#673ab7] rounded-t-full"></div>
                                )}
                            </button>
                            <button
                                onClick={() => handleStatusChange('verified')}
                                className={`pt-5 pb-4 text-[14px] font-bold transition-all relative ${
                                    verified === 'verified' ? 'text-[#673ab7]' : 'text-[#727586] hover:text-[#2f3344]'
                                }`}
                            >
                                Verified
                                {verified === 'verified' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#673ab7] rounded-t-full"></div>
                                )}
                            </button>
                            <button
                                onClick={() => handleComplianceChange('approved')}
                                className={`pt-5 pb-4 text-[14px] font-bold transition-all relative ${
                                    compliance === 'approved' ? 'text-[#673ab7]' : 'text-[#727586] hover:text-[#2f3344]'
                                }`}
                            >
                                Compliance Approved
                                {compliance === 'approved' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#673ab7] rounded-t-full"></div>
                                )}
                            </button>
                            <button
                                onClick={() => handleComplianceChange('pending')}
                                className={`pt-5 pb-4 text-[14px] font-bold transition-all relative ${
                                    compliance === 'pending' ? 'text-[#673ab7]' : 'text-[#727586] hover:text-[#2f3344]'
                                }`}
                            >
                                Pending Review
                                {compliance === 'pending' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#673ab7] rounded-t-full"></div>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="p-7">
                        <div className="relative w-full">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#a0a3af]">
                                <Search size={22} />
                            </div>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Search by name, email, company, or policy number..."
                                className="w-full h-[52px] pl-14 pr-6 bg-white border border-[#e3e4e8] rounded-[8px] text-[15px] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all"
                            />
                        </div>
                    </div>

                    {/* Table Area */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#e3e4e8]">
                                    <th className="pl-7 pr-4 py-4 w-10">
                                        <div 
                                            onClick={toggleSelectAll}
                                            className={`w-5 h-5 border-[2px] rounded cursor-pointer transition-all flex items-center justify-center ${
                                                selectedIds.length === suppliers.data.length && suppliers.data.length > 0
                                                ? 'bg-[#673ab7] border-[#673ab7]'
                                                : 'border-[#c3c4ca] hover:border-[#673ab7]'
                                            }`}
                                        >
                                            {selectedIds.length === suppliers.data.length && suppliers.data.length > 0 && <Check size={14} className="text-white" />}
                                        </div>
                                    </th>
                                    <th className="text-left px-5 py-4 text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">
                                        <div className="flex items-center gap-1.5 cursor-pointer hover:text-black group">
                                            Supplier 
                                            <ArrowUpDown size={14} className="text-[#a0a3af] group-hover:text-[#673ab7]" />
                                        </div>
                                    </th>
                                    <th className="text-left px-5 py-4 text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">
                                        Company
                                    </th>
                                    <th className="text-left px-5 py-4 text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">
                                        Plan
                                    </th>
                                    <th className="text-left px-5 py-4 text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">
                                        Insurance
                                    </th>
                                    <th className="text-left px-5 py-4 text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">
                                        Policy Expiry
                                    </th>
                                    <th className="text-left px-5 py-4 text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-7 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f1f2f4]">
                                {suppliers.data.length > 0 ? (
                                    suppliers.data.map((supplier) => (
                                        <tr 
                                            key={supplier.id} 
                                            className={`hover:bg-[#fafbfc] transition-colors group ${selectedIds.includes(supplier.id) ? 'bg-[#f4f0ff]/50' : ''}`}
                                        >
                                            <td className="pl-7 pr-4 py-5">
                                                <div 
                                                    onClick={() => toggleSelect(supplier.id)}
                                                    className={`w-5 h-5 border-[2px] rounded cursor-pointer transition-all flex items-center justify-center ${
                                                        selectedIds.includes(supplier.id)
                                                        ? 'bg-[#673ab7] border-[#673ab7]'
                                                        : 'border-[#c3c4ca] hover:border-[#673ab7]'
                                                    }`}
                                                >
                                                    {selectedIds.includes(supplier.id) && <Check size={14} className="text-white" />}
                                                </div>
                                            </td>
                                            <td className="px-5 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2c8af8] to-[#1a7ae8] flex items-center justify-center text-white font-bold text-[14px]">
                                                        {supplier.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-[14px] font-bold text-[#2f3344] group-hover:text-[#673ab7] transition-colors">
                                                            {supplier.name}
                                                        </p>
                                                        <p className="text-[12px] text-[#727586] font-normal">
                                                            {supplier.email}
                                                        </p>
                                                        <p className="text-[12px] text-[#727586] font-normal">
                                                            {supplier.phone_number}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-5">
                                                <span className="text-[13px] font-medium text-[#2f3344]">
                                                    {supplier.company_name}
                                                </span>
                                            </td>
                                            <td className="px-5 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-[13px] font-medium text-[#673ab7]">
                                                        {supplier.subscription?.pricing_plan?.name || 'No Plan'}
                                                    </span>
                                                    {supplier.subscription?.expires_at && (
                                                        <span className="text-[11px] text-[#727586]">
                                                            Exp: {new Date(supplier.subscription.expires_at).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-5 py-5">
                                                <div>
                                                    <p className="text-[13px] text-[#2f3344] font-medium">
                                                        {supplier.insurance_provider_name}
                                                    </p>
                                                    <p className="text-[12px] text-[#727586]">
                                                        {supplier.policy_number}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-5 py-5">
                                                <span className="text-[13px] text-[#727586]">
                                                    {new Date(supplier.policy_expiry_date).toLocaleDateString()}
                                                </span>
                                            </td>
                                            <td className="px-5 py-5">
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-2">
                                                        {supplier.is_verified ? (
                                                            <>
                                                                <div className="w-[18px] h-[18px] rounded-full border-[1.5px] border-[#00b090] flex items-center justify-center text-[#00b090]">
                                                                    <Check size={11} strokeWidth={3} />
                                                                </div>
                                                                <span className="text-[13px] font-medium text-[#2f3344]">Verified</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="w-[18px] h-[18px] rounded-full border-[1.5px] border-[#ffb000] flex items-center justify-center text-[#ffb000]">
                                                                    <AlertCircle size={11} strokeWidth={3} />
                                                                </div>
                                                                <span className="text-[13px] font-medium text-[#2f3344]">Unverified</span>
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {supplier.is_compliance_verified ? (
                                                            <>
                                                                <div className="w-[18px] h-[18px] rounded-full border-[1.5px] border-[#2c8af8] flex items-center justify-center text-[#2c8af8]">
                                                                    <Shield size={11} strokeWidth={3} />
                                                                </div>
                                                                <span className="text-[13px] font-medium text-[#2f3344]">Compliance ✓</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="w-[18px] h-[18px] rounded-full border-[1.5px] border-[#ffb000] flex items-center justify-center text-[#ffb000]">
                                                                    <AlertCircle size={11} strokeWidth={3} />
                                                                </div>
                                                                <span className="text-[13px] font-medium text-[#2f3344]">Pending</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="pr-7 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={route('admin.suppliers.show', supplier.id)}
                                                        className="h-[36px] inline-flex items-center bg-white border border-[#e3e4e8] text-[#2f3344] px-4 rounded-[6px] font-bold text-[13px] hover:border-[#673ab7] hover:text-[#673ab7] transition-all"
                                                    >
                                                        View
                                                    </Link>
                                                    <button
                                                        onClick={() => toggleCompliance(supplier)}
                                                        className={`h-[36px] inline-flex items-center px-3 rounded-[6px] font-bold text-[13px] transition-all ${
                                                            supplier.is_compliance_verified
                                                                ? 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                                                                : 'bg-green-50 text-green-600 hover:bg-green-100'
                                                        }`}
                                                    >
                                                        {supplier.is_compliance_verified ? 'Revoke' : 'Approve'}
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(supplier.id)}
                                                        className="w-8 h-8 flex items-center justify-center text-[#727586] hover:bg-red-50 hover:text-red-600 rounded-lg transition-all"
                                                    >
                                                        <Trash2 size={16} />
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
                                                    onClick={() => {setSearch(''); handleStatusChange('all'); handleComplianceChange('all');}}
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

                {/* Bulk Action Bar */}
                {selectedIds.length > 0 && (
                    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-[800px] px-4 animate-in slide-in-from-bottom duration-300">
                        <div className="bg-[#2f3344] text-white p-4 rounded-[12px] shadow-2xl flex items-center justify-between">
                            <div className="flex items-center gap-4 border-r border-slate-600 pr-5">
                                <span className="text-[14px] font-bold">{selectedIds.length} suppliers selected</span>
                                <button 
                                    onClick={() => setSelectedIds([])}
                                    className="text-slate-400 hover:text-white transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            
                            <div className="flex items-center gap-6 px-4 flex-1">
                                <button className="text-[14px] font-bold text-green-400 hover:text-green-300 transition-colors flex items-center gap-2">
                                    <Shield size={16} /> Approve All
                                </button>
                                <button className="text-[14px] font-bold text-red-400 hover:text-red-300 transition-colors flex items-center gap-2">
                                    <Trash2 size={16} /> Delete Selected
                                </button>
                            </div>

                            <button 
                                onClick={() => setSelectedIds([])}
                                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-[13px] font-bold transition-all"
                            >
                                Cancel selection
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
