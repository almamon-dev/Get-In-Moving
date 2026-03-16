import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    AlertCircle, Search, Home, 
    User, Truck, Calendar, 
    MoreHorizontal, CheckCircle, ArrowUpRight,
    Search as SearchIcon, Shield, ChevronDown
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
        updateFilters({ status: status, page: 1 });
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

            <div className="space-y-6 max-w-8xl mx-auto pb-20">
                {/* Top Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-[24px] font-bold text-[#2f3344] tracking-tight">
                            Raised Issues & Disputes
                        </h1>
                        <div className="flex items-center gap-2 text-[13px] text-[#727586] mt-1">
                            <Home size={16} className="text-[#727586]" />
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Orders</span>
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Disputes</span>
                        </div>
                    </div>
                </div>

                {/* Promo Banner - Matches Supplier Management */}
                {showPromo && (
                    <div className="relative bg-[#fff0f0] rounded-[12px] p-6 border border-[#ffe3e3] overflow-hidden flex items-center justify-between">
                        <div className="flex-1">
                            <h2 className="text-[18px] font-bold text-[#2f3344] mb-1">
                                Resolution Center & Dispute Management
                            </h2>
                            <p className="text-[14px] text-[#727586]">
                                Review and resolve conflicts between customers and suppliers regarding delivery rejections.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-[100px] h-[60px] relative hidden md:block">
                                <div className="absolute right-0 top-0 text-rose-500 opacity-20 transform rotate-12">
                                    <AlertCircle size={40} />
                                </div>
                                <div className="absolute right-10 bottom-0 text-rose-500 opacity-20">
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
                        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-rose-500/5 to-transparent pointer-events-none"></div>
                    </div>
                )}

                {/* Stats Cards - Matches Supplier Management */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-[12px] border border-[#e3e4e8] p-6 shadow-sm">
                        <div className="text-[13px] font-medium text-[#727586] uppercase tracking-wider">Total Issues</div>
                        <div className="mt-2 text-[32px] font-bold text-[#2f3344] uppercase tracking-tight">{stats.total}</div>
                    </div>
                    <div className="bg-white rounded-[12px] border border-[#e3e4e8] p-6 shadow-sm">
                        <div className="text-[13px] font-medium text-[#727586] uppercase tracking-wider">POD Rejections</div>
                        <div className="mt-2 text-[32px] font-bold text-rose-500 uppercase tracking-tight">{stats.rejected}</div>
                    </div>
                    <div className="bg-white rounded-[12px] border border-[#e3e4e8] p-6 shadow-sm">
                        <div className="text-[13px] font-medium text-[#727586] uppercase tracking-wider">Pending Review</div>
                        <div className="mt-2 text-[32px] font-bold text-amber-500 uppercase tracking-tight">{stats.pending}</div>
                    </div>
                    <div className="bg-white rounded-[12px] border border-[#e3e4e8] p-6 shadow-sm">
                        <div className="text-[13px] font-medium text-[#727586] uppercase tracking-wider">Resolved</div>
                        <div className="mt-2 text-[32px] font-bold text-emerald-500 uppercase tracking-tight">{stats.resolved}</div>
                    </div>
                </div>

                {/* Main Content Card - Matches Supplier Management */}
                <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                    {/* Tabs / Filters - Functional */}
                    <div className="px-6 border-b border-[#e3e4e8]">
                        <div className="flex gap-10">
                            <button
                                onClick={() => handleStatusChange('all')}
                                className={`pt-5 pb-4 text-[14px] font-bold transition-all relative ${
                                    statusFilter === 'all' ? 'text-[#673ab7]' : 'text-[#727586] hover:text-[#2f3344]'
                                }`}
                            >
                                All Disputes
                                {statusFilter === 'all' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#673ab7] rounded-t-full"></div>
                                )}
                            </button>
                            <button
                                onClick={() => handleStatusChange('pending')}
                                className={`pt-5 pb-4 text-[14px] font-bold transition-all relative ${
                                    statusFilter === 'pending' ? 'text-[#673ab7]' : 'text-[#727586] hover:text-[#2f3344]'
                                }`}
                            >
                                Pending Review
                                {statusFilter === 'pending' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#673ab7] rounded-t-full"></div>
                                )}
                            </button>
                            <button
                                onClick={() => handleStatusChange('resolved')}
                                className={`pt-5 pb-4 text-[14px] font-bold transition-all relative ${
                                    statusFilter === 'resolved' ? 'text-[#673ab7]' : 'text-[#727586] hover:text-[#2f3344]'
                                }`}
                            >
                                Resolved Cases
                                {statusFilter === 'resolved' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#673ab7] rounded-t-full"></div>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Search Bar - Matches Supplier Management */}
                    <div className="p-7">
                        <form onSubmit={handleSearch} className="relative w-full">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#a0a3af]">
                                <SearchIcon size={22} />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by order number, customer name, email or supplier..."
                                className="w-full h-[52px] pl-14 pr-6 bg-white border border-[#e3e4e8] rounded-[8px] text-[15px] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all"
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
                </div>
            </div>
        </AdminLayout>
    );
}
