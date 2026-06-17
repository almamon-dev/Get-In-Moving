import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    AlertCircle, Search, Home, 
    User, Truck, Calendar, 
    MoreHorizontal, CheckCircle, ArrowUpRight,
    Search as SearchIcon, Shield, ChevronDown, ChevronLeft, ChevronRight
} from 'lucide-react';

export default function Index({ issues, filters = {}, auth, stats }) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [showPromo, setShowPromo] = useState(true);
    
    const handleSearch = (e) => {
        if (e) e.preventDefault();
        updateFilters({ search: searchQuery, page: 1 });
    };

    const handleStatusChange = (status) => {
        setStatusFilter(status);
        updateFilters({ status: status, page: 1, per_page: filters.per_page });
    };

    const handlePerPageChange = (e) => {
        updateFilters({ per_page: e.target.value, page: 1 });
    };

    const handlePageChange = (url) => {
        if (url) router.get(url, {}, { preserveState: true, replace: true });
    };

    const updateFilters = (newFilters) => {
        router.get(
            route('admin.issues.index'),
            { ...filters, ...newFilters },
            { preserveState: true, replace: true }
        );
    };

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Raised Issues" />

            <div className="min-h-screen bg-[#f5f6f8]">
                <div className="w-full mx-auto px-6 py-8">
                    
                    {/* Header Row */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                        <div>
                            <h1 className="text-[24px] font-bold text-[#111827] tracking-tight">Raised Issues & Disputes</h1>
                            <p className="text-[14px] text-[#6b7280] mt-0.5">Review and resolve conflicts regarding delivery rejections</p>
                        </div>
                    </div>
                    {/* Main Container */}
                    <div className="bg-white rounded-md border border-[#e5e7eb] shadow-sm">
                        
                        {/* Tabs Row */}
                        <div className="flex items-center gap-6 px-6 border-b border-[#e5e7eb] overflow-x-auto">
                            {[
                                { name: 'All Disputes', value: 'all', count: stats.total },
                                { name: 'Pending Review', value: 'pending', count: stats.pending },
                                { name: 'Resolved Cases', value: 'resolved', count: stats.resolved }
                            ].map((tab) => {
                                const isActive = statusFilter === tab.value;
                                
                                return (
                                    <button
                                        key={tab.name}
                                        onClick={() => handleStatusChange(tab.value)}
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
                            <form onSubmit={handleSearch} className="relative w-full md:w-[400px]">
                                <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                                <input 
                                    type="text" 
                                    placeholder="Search by order number, customer name, email or supplier..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full h-10 pl-10 pr-4 bg-white border border-[#d1d5db] rounded-[4px] text-[13px] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] placeholder:text-[#9ca3af]"
                                />
                            </form>
                        </div>

                        {/* Table Area */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#e3e4e8]">
                                    <th className="text-left px-7 py-4 text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">Order & Date</th>
                                    <th className="text-left px-5 py-4 text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">Parties Involved</th>
                                    <th className="text-left px-5 py-4 text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">Issue Reason</th>
                                    <th className="text-left px-5 py-4 text-[13px] font-bold text-[#2f3344] uppercase tracking-wider text-right">Amount</th>
                                    <th className="text-right px-7 py-4 text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f1f2f4]">
                                {issues.data.length > 0 ? (
                                    issues.data.map((issue) => (
                                        <tr key={issue.id} className="hover:bg-[#fafbfc] transition-colors group">
                                            <td className="px-7 py-5">
                                                <p className="text-[14px] font-bold text-[#673ab7]">#{issue.order_number}</p>
                                                <p className="text-[12px] text-[#727586] mt-1 flex items-center gap-1 font-medium">
                                                    <Calendar size={13} className="text-[#a0a3af]" /> 
                                                    {new Date(issue.created_at).toLocaleDateString()}
                                                </p>
                                            </td>
                                            <td className="px-5 py-5">
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-[10px] font-bold">C</div>
                                                        <span className="text-[13px] font-bold text-[#2f3344]">{issue.customer?.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 text-[10px] font-bold">S</div>
                                                        <span className="text-[13px] font-bold text-[#2f3344]">{issue.supplier?.name}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-5">
                                                <div className="max-w-[320px]">
                                                    <p className="text-[13px] text-[#424453] leading-relaxed italic border-l-[3px] border-rose-200 pl-3">
                                                        "{issue.status_note || 'The customer rejected the delivery confirmation.'}"
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-5 py-5 text-right font-bold text-[#2f3344] text-[15px]">
                                                ${parseFloat(issue.total_amount).toLocaleString()}
                                            </td>
                                            <td className="px-7 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="h-[36px] bg-[#673ab7] text-white px-4 rounded-[6px] font-bold text-[13px] hover:bg-[#5e35b1] shadow-sm flex items-center gap-2">
                                                        Resolve <ArrowUpRight size={14} />
                                                    </button>
                                                    <button className="w-9 h-9 flex items-center justify-center text-[#727586] hover:bg-slate-100 rounded-lg transition-all">
                                                        <MoreHorizontal size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-7 py-24 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-20 h-20 bg-[#f8f9fa] rounded-full flex items-center justify-center mb-2">
                                                    <AlertCircle size={40} className="text-[#c3c4ca]" />
                                                </div>
                                                <div>
                                                    <p className="text-[18px] font-bold text-[#2f3344]">No active issues</p>
                                                    <p className="text-[14px] text-[#727586]">You're all caught up! No disputes reported.</p>
                                                </div>
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
                                    <option value="15">15</option>
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
                                {issues.from || 0} - {issues.to || 0} of {issues.total || 0}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePageChange(issues.prev_page_url)}
                                    disabled={!issues.prev_page_url}
                                    className="w-[34px] h-[34px] flex items-center justify-center rounded-full text-[#673ab7] hover:bg-[#673ab7]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={() => handlePageChange(issues.next_page_url)}
                                    disabled={!issues.next_page_url}
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
        </AdminLayout>
    );
}
