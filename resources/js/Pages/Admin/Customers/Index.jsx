import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Home, MoreVertical, Plus, Users, 
    Search, X, Check, AlertCircle, Trash2,
    ChevronDown, ChevronLeft, ChevronRight, ArrowUpDown 
} from 'lucide-react';

export default function Index({ auth, customers, filters = {}, stats }) {
    const [search, setSearch] = useState(filters.search || '');
    const [verified, setVerified] = useState(filters.verified !== undefined ? (filters.verified === '1' ? 'verified' : (filters.verified === '0' ? 'unverified' : 'all')) : 'all');
    const [selectedIds, setSelectedIds] = useState([]);
    const [showPromo, setShowPromo] = useState(true);

    const handleSearch = (value) => {
        setSearch(value);
        updateFilters({ search: value, page: 1 });
    };

    const updateFilters = (newFilters) => {
        router.get(
            route('admin.customers.index'),
            { ...filters, ...newFilters },
            { preserveState: true, replace: true }
        );
    };

    const handleStatusChange = (newStatus) => {
        setVerified(newStatus);
        const statusVal = newStatus === 'all' ? '' : (newStatus === 'verified' ? '1' : '0');
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
            setSelectedIds(customers.data.map(c => c.id));
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
        if (confirm('Are you sure you want to delete this customer?')) {
            router.delete(route('admin.customers.destroy', id));
        }
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Customers" />

            <div className="space-y-6 max-w-8xl mx-auto pb-20">
                {/* Top Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-[24px] font-bold text-[#2f3344] tracking-tight">
                            Customer Management
                        </h1>
                        <div className="flex items-center gap-2 text-[13px] text-[#727586] mt-1">
                            <Home size={16} className="text-[#727586]" />
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Customers</span>
                        </div>
                    </div>
                </div>

                {/* Promo Banner */}
                {showPromo && (
                    <div className="relative bg-[#f4f0ff] rounded-[12px] p-6 border border-[#e9e3ff] overflow-hidden flex items-center justify-between">
                        <div className="flex-1">
                            <h2 className="text-[18px] font-bold text-[#2f3344] mb-1">
                                Manage your customer base efficiently
                            </h2>
                            <p className="text-[14px] text-[#727586]">
                                Track customer activity, verification status, and manage accounts from one place.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-[100px] h-[60px] relative hidden md:block">
                                <div className="absolute right-0 top-0 text-[#673ab7] opacity-20 transform rotate-12">
                                    <Users size={40} />
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-[12px] border border-[#e3e4e8] p-6 shadow-sm">
                        <div className="text-[13px] font-medium text-[#727586] uppercase tracking-wider">Total Customers</div>
                        <div className="mt-2 text-[32px] font-bold text-[#2f3344]">{stats.total}</div>
                    </div>
                    <div className="bg-white rounded-[12px] border border-[#e3e4e8] p-6 shadow-sm">
                        <div className="text-[13px] font-medium text-[#727586] uppercase tracking-wider">Verified</div>
                        <div className="mt-2 text-[32px] font-bold text-[#00b090]">{stats.verified}</div>
                    </div>
                    <div className="bg-white rounded-[12px] border border-[#e3e4e8] p-6 shadow-sm">
                        <div className="text-[13px] font-medium text-[#727586] uppercase tracking-wider">Unverified</div>
                        <div className="mt-2 text-[32px] font-bold text-[#ffb000]">{stats.unverified}</div>
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
                                All customers
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
                                onClick={() => handleStatusChange('unverified')}
                                className={`pt-5 pb-4 text-[14px] font-bold transition-all relative ${
                                    verified === 'unverified' ? 'text-[#673ab7]' : 'text-[#727586] hover:text-[#2f3344]'
                                }`}
                            >
                                Unverified
                                {verified === 'unverified' && (
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
                                placeholder="Search by name, email, phone, or company..."
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
                                                selectedIds.length === customers.data.length && customers.data.length > 0
                                                ? 'bg-[#673ab7] border-[#673ab7]'
                                                : 'border-[#c3c4ca] hover:border-[#673ab7]'
                                            }`}
                                        >
                                            {selectedIds.length === customers.data.length && customers.data.length > 0 && <Check size={14} className="text-white" />}
                                        </div>
                                    </th>
                                    <th className="text-left px-5 py-4 text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">
                                        <div className="flex items-center gap-1.5 cursor-pointer hover:text-black group">
                                            Customer 
                                            <ArrowUpDown size={14} className="text-[#a0a3af] group-hover:text-[#673ab7]" />
                                        </div>
                                    </th>
                                    <th className="text-left px-5 py-4 text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th className="text-left px-5 py-4 text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">
                                        Company
                                    </th>
                                    <th className="text-left px-5 py-4 text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">
                                        Plan
                                    </th>
                                    <th className="text-left px-5 py-4 text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="text-left px-5 py-4 text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">
                                        Joined
                                    </th>
                                    <th className="px-7 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f1f2f4]">
                                {customers.data.length > 0 ? (
                                    customers.data.map((customer) => (
                                        <tr 
                                            key={customer.id} 
                                            className={`hover:bg-[#fafbfc] transition-colors group ${selectedIds.includes(customer.id) ? 'bg-[#f4f0ff]/50' : ''}`}
                                        >
                                            <td className="pl-7 pr-4 py-5">
                                                <div 
                                                    onClick={() => toggleSelect(customer.id)}
                                                    className={`w-5 h-5 border-[2px] rounded cursor-pointer transition-all flex items-center justify-center ${
                                                        selectedIds.includes(customer.id)
                                                        ? 'bg-[#673ab7] border-[#673ab7]'
                                                        : 'border-[#c3c4ca] hover:border-[#673ab7]'
                                                    }`}
                                                >
                                                    {selectedIds.includes(customer.id) && <Check size={14} className="text-white" />}
                                                </div>
                                            </td>
                                            <td className="px-5 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#673ab7] to-[#9c27b0] flex items-center justify-center text-white font-bold text-[14px]">
                                                        {customer.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-[14px] font-bold text-[#2f3344] group-hover:text-[#673ab7] transition-colors">
                                                            {customer.name}
                                                        </p>
                                                        <p className="text-[12px] text-[#727586] font-normal">
                                                            {customer.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-5">
                                                <span className="text-[13px] text-[#727586]">
                                                    {customer.phone_number || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-5">
                                                <span className="text-[13px] text-[#727586]">
                                                    {customer.company_name || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-[13px] font-medium text-[#673ab7]">
                                                        {customer.subscription?.pricing_plan?.name || 'No Plan'}
                                                    </span>
                                                    {customer.subscription?.expires_at && (
                                                        <span className="text-[11px] text-[#727586]">
                                                            Exp: {new Date(customer.subscription.expires_at).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-5 py-5">
                                                <div className="flex items-center gap-2">
                                                    {customer.is_verified ? (
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
                                            </td>
                                            <td className="px-5 py-5">
                                                <span className="text-[13px] text-[#727586]">
                                                    {new Date(customer.created_at).toLocaleDateString()}
                                                </span>
                                            </td>
                                            <td className="pr-7 py-5 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <Link
                                                        href={route('admin.customers.show', customer.id)}
                                                        className="h-[36px] inline-flex items-center bg-white border border-[#e3e4e8] text-[#2f3344] px-4 rounded-[6px] font-bold text-[13px] hover:border-[#673ab7] hover:text-[#673ab7] transition-all"
                                                    >
                                                        View
                                                    </Link>
                                                    <button 
                                                        onClick={() => handleDelete(customer.id)}
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
                                                <p className="text-[16px] font-bold text-[#2f3344]">No customers found</p>
                                                <p className="text-[14px]">Try adjusting your search or filters.</p>
                                                <button 
                                                    onClick={() => {setSearch(''); handleStatusChange('all');}}
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
                                {customers.from || 0} - {customers.to || 0} of {customers.total || 0}
                            </span>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => handlePageChange(customers.prev_page_url)}
                                    disabled={!customers.prev_page_url}
                                    className="w-[34px] h-[34px] flex items-center justify-center rounded-full text-[#673ab7] hover:bg-[#673ab7]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button 
                                    onClick={() => handlePageChange(customers.next_page_url)}
                                    disabled={!customers.next_page_url}
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
                                <span className="text-[14px] font-bold">{selectedIds.length} customers selected</span>
                                <button 
                                    onClick={() => setSelectedIds([])}
                                    className="text-slate-400 hover:text-white transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            
                            <div className="flex items-center gap-6 px-4 flex-1">
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
