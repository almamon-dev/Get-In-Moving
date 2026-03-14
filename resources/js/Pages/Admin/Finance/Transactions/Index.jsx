import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Home, Search, ChevronLeft, ChevronRight, 
    TrendingUp, TrendingDown, Clock, Activity,
    DollarSign, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

export default function Index({ auth, transactions, stats, filters = {} }) {
    const [typeFilter, setTypeFilter] = useState(filters.type || 'all');
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    const handleTypeChange = (newType) => {
        setTypeFilter(newType);
        router.get(route('admin.transactions.index'), { type: newType, search: searchQuery }, { preserveState: true });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.transactions.index'), { type: typeFilter, search: searchQuery }, { preserveState: true });
    };

    const handlePageChange = (url) => {
        if (url) router.get(url, {}, { preserveState: true });
    };

    const getTypeDetails = (type) => {
        switch (type) {
            case 'earning': 
                return { icon: <ArrowDownRight size={14} />, color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'Earning' };
            case 'withdrawal': 
                return { icon: <ArrowUpRight size={14} />, color: 'text-rose-500', bg: 'bg-rose-500/10', label: 'Withdrawal' };
            case 'refund': 
                return { icon: <ArrowDownRight size={14} />, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Refund' };
            case 'adjustment': 
                return { icon: <Activity size={14} />, color: 'text-purple-500', bg: 'bg-purple-500/10', label: 'Adjustment' };
            default: 
                return { icon: <Activity size={14} />, color: 'text-slate-500', bg: 'bg-slate-500/10', label: type };
        }
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="System Transactions" />

            <div className="space-y-6 max-w-8xl mx-auto pb-20">
                {/* Top Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-[24px] font-bold text-[#2f3344] tracking-tight">
                            System Transactions
                        </h1>
                        <div className="flex items-center gap-2 text-[13px] text-[#727586] mt-1">
                            <Home size={16} className="text-[#727586]" />
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Finance</span>
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Transactions</span>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-[12px] p-6 border border-[#e3e4e8] shadow-sm flex flex-col justify-between">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                <TrendingUp size={24} />
                            </div>
                        </div>
                        <div>
                            <p className="text-[13px] font-bold text-[#727586] uppercase tracking-wider mb-1">Total Supplier Earnings</p>
                            <h3 className="text-3xl font-bold text-[#2f3344]">${parseFloat(stats.total_earnings).toLocaleString()}</h3>
                            <p className="text-[12px] text-emerald-500 font-medium mt-2">Active funds in system</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-[12px] p-6 border border-[#e3e4e8] shadow-sm flex flex-col justify-between">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-600">
                                <DollarSign size={24} />
                            </div>
                        </div>
                        <div>
                            <p className="text-[13px] font-bold text-[#727586] uppercase tracking-wider mb-1">Total Withdrawn</p>
                            <h3 className="text-3xl font-bold text-[#2f3344]">${parseFloat(stats.total_withdrawn).toLocaleString()}</h3>
                            <p className="text-[12px] text-rose-500 font-medium mt-2">Successfully paid out</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-[12px] p-6 border border-[#e3e4e8] shadow-sm flex flex-col justify-between md:col-span-2">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600">
                                <Clock size={24} />
                            </div>
                        </div>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-[13px] font-bold text-[#727586] uppercase tracking-wider mb-1">Pending Clearance</p>
                                <h3 className="text-3xl font-bold text-[#2f3344]">${parseFloat(stats.pending_withdrawal_amount).toLocaleString()}</h3>
                                <div className="text-[13px] font-medium text-amber-600 mt-2 flex items-center gap-1">
                                    <span>{stats.pending_requests_count} withdrawal requests waiting</span>
                                    <Link href={route('admin.withdrawals.index')} className="text-[#673ab7] hover:underline ml-2 flex items-center">
                                        View Requests <ArrowUpRight size={14} className="ml-1" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                    {/* Header & Filters */}
                    <div className="p-6 border-b border-[#e3e4e8] flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
                            {['all', 'earning', 'withdrawal', 'refund', 'adjustment'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => handleTypeChange(type)}
                                    className={`px-4 py-2 text-[13px] font-bold rounded-md transition-all capitalize ${
                                        typeFilter === type 
                                            ? 'bg-white text-[#673ab7] shadow-sm' 
                                            : 'text-[#727586] hover:text-[#2f3344]'
                                    }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSearch} className="relative w-full sm:w-auto">
                            <input
                                type="text"
                                placeholder="Search supplier or order..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full sm:w-[300px] h-[40px] pl-10 pr-4 rounded-[8px] bg-[#f8f9fa] border-transparent focus:border-[#673ab7] focus:bg-white text-[13px] transition-all focus:ring-1 focus:ring-[#673ab7]/20 placeholder-[#a0a3af] text-[#2f3344] outline-none"
                            />
                            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a0a3af]" />
                        </form>
                    </div>

                    {/* Table Area */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#e3e4e8] bg-[#fdfdfd]">
                                    <th className="text-left px-7 py-4 text-[12px] font-bold text-[#727586] uppercase tracking-wider whitespace-nowrap">
                                        Transaction Date
                                    </th>
                                    <th className="text-left px-5 py-4 text-[12px] font-bold text-[#727586] uppercase tracking-wider whitespace-nowrap">
                                        Supplier / Details
                                    </th>
                                    <th className="text-left px-5 py-4 text-[12px] font-bold text-[#727586] uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="text-left px-5 py-4 text-[12px] font-bold text-[#727586] uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th className="text-right px-7 py-4 text-[12px] font-bold text-[#727586] uppercase tracking-wider">
                                        Amount
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f1f2f4]">
                                {transactions?.data?.length > 0 ? (
                                    transactions.data.map((transaction) => {
                                        const typeStyles = getTypeDetails(transaction.type);
                                        const isNegative = transaction.type === 'withdrawal' || transaction.type === 'refund';

                                        return (
                                            <tr key={transaction.id} className="hover:bg-[#fafbfc] transition-colors group">
                                                <td className="px-7 py-4 align-top">
                                                    <p className="text-[13px] font-bold text-[#2f3344]">
                                                        {new Date(transaction.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </p>
                                                    <p className="text-[12px] text-[#727586] mt-0.5">
                                                        {new Date(transaction.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-[13px]">
                                                            {(transaction.supplier?.company_name || transaction.supplier?.name || "U").charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="text-[14px] font-bold text-[#2f3344]">
                                                                {transaction.supplier?.company_name || transaction.supplier?.name}
                                                            </p>
                                                            {transaction.order && (
                                                                <p className="text-[12px] text-[#727586] mt-0.5 flex items-center">
                                                                    Order <span className="text-[#673ab7] ml-1">#{transaction.order.order_number}</span>
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 align-top">
                                                    <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-[6px]">
                                                        <div className={`p-1 rounded-sm ${typeStyles.bg} ${typeStyles.color}`}>
                                                            {typeStyles.icon}
                                                        </div>
                                                        <span className={`text-[12px] font-bold ${typeStyles.color}`}>
                                                            {typeStyles.label}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 align-top max-w-[250px]">
                                                    <p className="text-[13px] text-[#424453] leading-snug break-words">
                                                        {transaction.description || '-'}
                                                    </p>
                                                </td>
                                                <td className="px-7 py-4 align-top text-right">
                                                    <p className={`text-[15px] font-bold ${isNegative ? 'text-[#2f3344] opacity-80' : 'text-emerald-600'}`}>
                                                        {isNegative ? '-' : '+'}${parseFloat(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </p>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-7 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3 text-[#727586]">
                                                <div className="w-16 h-16 bg-[#f8f9fa] rounded-full flex items-center justify-center mb-2">
                                                    <Activity size={30} className="text-[#c3c4ca]" />
                                                </div>
                                                <p className="text-[16px] font-bold text-[#2f3344]">No transactions found</p>
                                                <p className="text-[14px]">Try adjusting your search or filters.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {transactions?.data?.length > 0 && (
                        <div className="flex items-center justify-between px-8 py-5 border-t border-[#e3e4e8] bg-[#fcfcfc]">
                            <span className="text-[13px] text-[#727586] font-medium">
                                Showing <strong className="text-[#2f3344]">{transactions.from}</strong> to <strong className="text-[#2f3344]">{transactions.to}</strong> of <strong className="text-[#2f3344]">{transactions.total}</strong> results
                            </span>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => handlePageChange(transactions.prev_page_url)}
                                    disabled={!transactions.prev_page_url}
                                    className="w-[34px] h-[34px] flex items-center justify-center rounded-lg border border-[#e3e4e8] bg-white text-[#2f3344] hover:border-[#673ab7] hover:text-[#673ab7] disabled:opacity-50 disabled:bg-slate-50 disabled:cursor-not-allowed transition-all shadow-sm"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <button 
                                    onClick={() => handlePageChange(transactions.next_page_url)}
                                    disabled={!transactions.next_page_url}
                                    className="w-[34px] h-[34px] flex items-center justify-center rounded-lg border border-[#e3e4e8] bg-white text-[#2f3344] hover:border-[#673ab7] hover:text-[#673ab7] disabled:opacity-50 disabled:bg-slate-50 disabled:cursor-not-allowed transition-all shadow-sm"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
