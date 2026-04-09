import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Home, Search, ChevronLeft, ChevronRight, 
    TrendingUp, Clock, Activity,
    Euro, ArrowUpRight, ShieldCheck,
    CreditCard, Calendar, User, Info, Timer 
} from 'lucide-react';
import { useEffect } from 'react';

const CountdownTimer = ({ targetDate }) => {
    const calculateTimeLeft = () => {
        if (!targetDate) return null;
        
        // Ensure the date is interpreted as UTC if it's a timezone-less string from the server
        let target = new Date(targetDate);
        if (typeof targetDate === 'string' && !targetDate.includes('Z') && !targetDate.includes('+')) {
            target = new Date(targetDate.replace(' ', 'T') + 'Z');
        }

        const difference = +target - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                d: Math.floor(difference / (1000 * 60 * 60 * 24)),
                h: Math.floor((difference / (1000 * 60 * 60)) % 24),
                m: Math.floor((difference / 1000 / 60) % 60),
                s: Math.floor((difference / 1000) % 60),
            };
        } else {
            timeLeft = null;
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    if (!timeLeft) {
        return <span className="text-emerald-600 font-bold uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck size={12} /> Ready to Release
        </span>;
    }

    return (
        <span className="flex items-center gap-1 font-mono tabular-nums tracking-tight text-[10px] sm:text-[11px]">
            <span className="opacity-70 mr-0.5">RELEASING IN</span>
            {timeLeft.d > 0 && <span className="font-bold">{timeLeft.d}d</span>}
            <span className="font-bold">{String(timeLeft.h).padStart(2, '0')}h</span>
            <span className="animate-pulse opacity-50">:</span>
            <span className="font-bold">{String(timeLeft.m).padStart(2, '0')}m</span>
            <span className="animate-pulse opacity-50">:</span>
            <span className="font-bold text-amber-500">{String(timeLeft.s).padStart(2, '0')}s</span>
        </span>
    );
};

export default function Index({ auth, payments, stats, filters = {} }) {
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    const handleStatusChange = (newStatus) => {
        setStatusFilter(newStatus);
        router.get(route('admin.transactions.index'), { status: newStatus, search: searchQuery }, { preserveState: true });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.transactions.index'), { status: statusFilter, search: searchQuery }, { preserveState: true });
    };

    const handlePageChange = (url) => {
        if (url) router.get(url, {}, { preserveState: true });
    };

    const getStatusDetails = (status) => {
        switch (status) {
            case 'succeeded': 
                return { icon: <ShieldCheck size={14} />, color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'Paid' };
            case 'pending': 
                return { icon: <Clock size={14} />, color: 'text-amber-500', bg: 'bg-amber-500/10', label: 'Pending' };
            case 'failed': 
                return { icon: <Activity size={14} />, color: 'text-rose-500', bg: 'bg-rose-500/10', label: 'Failed' };
            default: 
                return { icon: <Info size={14} />, color: 'text-slate-500', bg: 'bg-slate-500/10', label: status };
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
                            <div className="w-12 h-12 rounded-full bg-[#673ab7]/10 flex items-center justify-center text-[#673ab7]">
                                <TrendingUp size={24} />
                            </div>
                        </div>
                        <div>
                            <p className="text-[13px] font-bold text-[#727586] uppercase tracking-wider mb-1">Total Payment Volume</p>
                            <h3 className="text-3xl font-bold text-[#2f3344]">€{parseFloat(stats.total_volume).toLocaleString()}</h3>
                            <p className="text-[12px] text-emerald-500 font-medium mt-2">All-time gross payments</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-[12px] p-6 border border-[#e3e4e8] shadow-sm flex flex-col justify-between">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                <ShieldCheck size={24} />
                            </div>
                        </div>
                        <div>
                            <p className="text-[13px] font-bold text-[#727586] uppercase tracking-wider mb-1">Released to Suppliers</p>
                            <h3 className="text-3xl font-bold text-[#2f3344]">€{parseFloat(stats.released_amount).toLocaleString()}</h3>
                            <p className="text-[12px] text-emerald-500 font-medium mt-2">Successfully disbursed</p>
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
                                <p className="text-[13px] font-bold text-[#727586] uppercase tracking-wider mb-1">Held in Escrow</p>
                                <h3 className="text-3xl font-bold text-[#2f3344]">€{parseFloat(stats.escrow_amount).toLocaleString()}</h3>
                                <div className="text-[13px] font-medium text-amber-600 mt-2 flex items-center gap-1">
                                    <span>{stats.pending_clearance_count} payments waiting for release</span>
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
                            {['all', 'succeeded', 'pending', 'failed'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => handleStatusChange(status)}
                                    className={`px-4 py-2 text-[13px] font-bold rounded-md transition-all capitalize ${
                                        statusFilter === status 
                                            ? 'bg-white text-[#673ab7] shadow-sm' 
                                            : 'text-[#727586] hover:text-[#2f3344]'
                                    }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSearch} className="relative w-full sm:w-auto">
                            <input
                                type="text"
                                placeholder="Search transaction, order, or supplier..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full sm:w-[320px] h-[40px] pl-10 pr-4 rounded-[8px] bg-[#f8f9fa] border-transparent focus:border-[#673ab7] focus:bg-white text-[13px] transition-all focus:ring-1 focus:ring-[#673ab7]/20 placeholder-[#a0a3af] text-[#2f3344] outline-none"
                            />
                            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a0a3af]" />
                        </form>
                    </div>

                    {/* Table Area */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#fdfdfd] border-b border-[#e3e4e8]">
                                <tr>
                                    <th className="px-6 py-4 text-[12px] font-bold text-[#727586] uppercase tracking-wider">Transaction Date</th>
                                    <th className="px-6 py-4 text-[12px] font-bold text-[#727586] uppercase tracking-wider">Payment Details</th>
                                    <th className="px-6 py-4 text-[12px] font-bold text-[#727586] uppercase tracking-wider">Parties</th>
                                    <th className="px-6 py-4 text-[12px] font-bold text-[#727586] uppercase tracking-wider">Status & Escrow</th>
                                    <th className="px-6 py-4 text-[12px] font-bold text-[#727586] uppercase tracking-wider text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f1f2f4]">
                                {payments?.data?.length > 0 ? (
                                    payments.data.map((payment) => {
                                        const statusInfo = getStatusDetails(payment.status);
                                        const order = payment.invoice?.order;
                                        
                                        return (
                                            <tr key={payment.id} className="hover:bg-[#fafbfc] transition-colors group">
                                                <td className="px-6 py-5 align-top">
                                                    <div className="flex flex-col">
                                                        <span className="text-[13px] font-bold text-[#2f3344]">
                                                            {new Date(payment.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </span>
                                                        <span className="text-[11px] text-[#727586] mt-0.5">
                                                            {new Date(payment.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 align-top">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[13px] font-bold text-[#2f3344] flex items-center gap-1.5">
                                                            <CreditCard size={14} className="text-[#a0a3af]" />
                                                            {payment.transaction_id || payment.session_id}
                                                        </span>
                                                        {order && (
                                                            <Link href="#" className="text-[12px] font-medium text-[#673ab7] hover:underline inline-flex items-center gap-1">
                                                                Order #{order.order_number}
                                                            </Link>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 align-top">
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-[#727586]">C</div>
                                                            <span className="text-[12px] text-[#424453] font-medium">{order?.customer?.name || "Client"}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-5 h-5 rounded-full bg-[#673ab7]/10 flex items-center justify-center text-[10px] font-bold text-[#673ab7]">S</div>
                                                            <span className="text-[12px] text-[#424453] font-medium">{order?.supplier?.company_name || order?.supplier?.name || "Supplier"}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 align-top">
                                                    <div className="flex flex-col gap-2">
                                                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] w-fit ${statusInfo.bg}`}>
                                                            <span className={`${statusInfo.color}`}>{statusInfo.icon}</span>
                                                            <span className={`text-[11px] font-bold uppercase ${statusInfo.color}`}>{statusInfo.label}</span>
                                                        </div>
                                                        
                                                        {payment.status === 'succeeded' && (
                                                            <div className="flex items-center gap-1.5">
                                                                {payment.is_released ? (
                                                                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">RELEASED</span>
                                                                ) : (
                                                                    <span className="text-[10px] sm:text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100 flex items-center gap-1.5 shadow-sm">
                                                                        <Timer size={12} className="animate-pulse" />
                                                                        <CountdownTimer targetDate={payment.available_at} />
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 align-top text-right">
                                                    <span className="text-[16px] font-bold text-[#2f3344]">
                                                        €{parseFloat(payment.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                    </span>
                                                    <p className="text-[11px] text-[#727586] uppercase tracking-wider">{payment.currency}</p>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3 text-[#727586]">
                                                <div className="w-16 h-16 bg-[#f8f9fa] rounded-full flex items-center justify-center mb-2">
                                                    <CreditCard size={30} className="text-[#c3c4ca]" />
                                                </div>
                                                <p className="text-[16px] font-bold text-[#2f3344]">No payment records found</p>
                                                <p className="text-[14px]">Try adjusting your filters or search terms.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {payments?.data?.length > 0 && (
                        <div className="flex items-center justify-between px-8 py-5 border-t border-[#e3e4e8] bg-[#fcfcfc]">
                            <span className="text-[13px] text-[#727586] font-medium">
                                Showing <strong className="text-[#2f3344]">{payments.from}</strong> to <strong className="text-[#2f3344]">{payments.to}</strong> of <strong className="text-[#2f3344]">{payments.total}</strong> results
                            </span>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => handlePageChange(payments.prev_page_url)}
                                    disabled={!payments.prev_page_url}
                                    className="w-[34px] h-[34px] flex items-center justify-center rounded-lg border border-[#e3e4e8] bg-white text-[#2f3344] hover:border-[#673ab7] hover:text-[#673ab7] disabled:opacity-50 disabled:bg-slate-50 disabled:cursor-not-allowed transition-all shadow-sm"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <button 
                                    onClick={() => handlePageChange(payments.next_page_url)}
                                    disabled={!payments.next_page_url}
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
