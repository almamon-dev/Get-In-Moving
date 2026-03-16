import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    Home, Users, Truck, ShoppingCart, 
    Lock, AlertCircle, ArrowRight, Clock,
    TrendingUp, Activity, DollarSign, Calendar
} from 'lucide-react';

export default function Dashboard({ auth, stats, recent_disputes }) {
    const statCards = [
        { 
            label: 'Total Customers', 
            value: stats.total_customers, 
            icon: <Users size={24} />, 
            color: 'text-blue-600', 
            bg: 'bg-blue-500/10' 
        },
        { 
            label: 'Total Suppliers', 
            value: stats.total_suppliers, 
            icon: <Truck size={24} />, 
            color: 'text-purple-600', 
            bg: 'bg-purple-500/10' 
        },
        { 
            label: 'Total Orders', 
            value: stats.total_orders, 
            icon: <ShoppingCart size={24} />, 
            color: 'text-orange-600', 
            bg: 'bg-orange-500/10' 
        },
        { 
            label: 'Held in Escrow', 
            value: `$${parseFloat(stats.held_amount).toLocaleString()}`, 
            icon: <Lock size={24} />, 
            color: 'text-rose-600', 
            bg: 'bg-rose-500/10',
            subtext: `${stats.pending_payouts_count} payouts pending`
        },
        { 
            label: 'Raised Issues', 
            value: stats.disputed_orders_count, 
            icon: <AlertCircle size={24} />, 
            color: 'text-amber-600', 
            bg: 'bg-amber-500/10',
            subtext: 'Rejected PODs'
        },
    ];

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Admin Dashboard" />

            <div className="space-y-6 max-w-8xl mx-auto pb-20">
                {/* Top Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-[24px] font-bold text-[#2f3344] tracking-tight">
                            Admin Dashboard
                        </h1>
                        <div className="flex items-center gap-2 text-[13px] text-[#727586] mt-1">
                            <Home size={16} className="text-[#727586]" />
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Statistics</span>
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Overview</span>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {statCards.map((card, index) => (
                        <div key={index} className="bg-white rounded-[12px] p-6 border border-[#e3e4e8] shadow-sm flex flex-col justify-between hover:border-[#673ab7]/30 transition-all group">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 rounded-full ${card.bg} flex items-center justify-center ${card.color} group-hover:scale-110 transition-transform duration-300`}>
                                    {card.icon}
                                </div>
                            </div>
                            <div>
                                <p className="text-[13px] font-bold text-[#727586] uppercase tracking-wider mb-1">{card.label}</p>
                                <h3 className="text-2xl font-bold text-[#2f3344] tracking-tight">{card.value}</h3>
                                {card.subtext && (
                                    <p className="text-[12px] text-slate-400 font-medium mt-2 flex items-center gap-1 italic">
                                        <Clock size={12} /> {card.subtext}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Disputes Section */}
                    <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-[#e3e4e8] flex items-center justify-between bg-[#fdfdfd]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-600">
                                    <AlertCircle size={20} />
                                </div>
                                <h3 className="text-[16px] font-bold text-[#2f3344]">Recent Issues & Disputes</h3>
                            </div>
                            <Link href={route('admin.issues.index')} className="text-[13px] font-bold text-[#673ab7] hover:underline flex items-center gap-1">
                                View All <ArrowRight size={14} />
                            </Link>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[#e3e4e8] bg-[#fdfdfd]">
                                        <th className="text-left px-7 py-4 text-[12px] font-bold text-[#727586] uppercase tracking-wider">Order</th>
                                        <th className="text-left px-5 py-4 text-[12px] font-bold text-[#727586] uppercase tracking-wider">Parties</th>
                                        <th className="text-right px-7 py-4 text-[12px] font-bold text-[#727586] uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#f1f2f4]">
                                    {recent_disputes.length > 0 ? (
                                        recent_disputes.map((order) => (
                                            <tr key={order.id} className="hover:bg-[#fafbfc] transition-colors group">
                                                <td className="px-7 py-5">
                                                    <p className="text-[13px] font-bold text-[#673ab7]">#{order.order_number}</p>
                                                    <p className="text-[12px] text-[#727586] mt-0.5 flex items-center gap-1">
                                                        <Calendar size={12} /> {new Date(order.updated_at).toLocaleDateString()}
                                                    </p>
                                                </td>
                                                <td className="px-5 py-5">
                                                    <p className="text-[13px] font-bold text-[#2f3344] line-clamp-1">{order.customer?.name}</p>
                                                    <p className="text-[12px] text-[#727586] line-clamp-1">{order.supplier?.name}</p>
                                                </td>
                                                <td className="px-7 py-5 text-right">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-500/10 text-rose-600 border border-rose-500/20">
                                                        POD Rejected
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="px-7 py-12 text-center">
                                                <p className="text-[14px] text-[#727586]">No active disputes found.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Financial Overview Card */}
                    <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-[#e3e4e8] flex items-center justify-between bg-[#fdfdfd]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-[#673ab7]">
                                    <TrendingUp size={20} />
                                </div>
                                <h3 className="text-[16px] font-bold text-[#2f3344]">Financial Status</h3>
                            </div>
                            <Link href={route('admin.transactions.index')} className="text-[13px] font-bold text-[#673ab7] hover:underline flex items-center gap-1">
                                Transactions <ArrowRight size={14} />
                            </Link>
                        </div>
                        
                        <div className="p-8 flex-1 flex flex-col justify-center items-center text-center bg-[#fafbfc]/50">
                            <p className="text-[13px] font-bold text-[#727586] uppercase tracking-wider mb-2">Total Amount in Escrow</p>
                            <h2 className="text-5xl font-black text-[#2f3344] tracking-tight mb-6">
                                ${parseFloat(stats.held_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </h2>
                            
                            <div className="w-full max-w-sm h-2 bg-slate-100 rounded-full overflow-hidden mb-8 shadow-inner">
                                <div className="h-full bg-[#673ab7] w-[65%] rounded-full shadow-lg transition-all duration-1000" />
                            </div>
                            
                            <div className="grid grid-cols-2 w-full gap-4 max-w-md">
                                <div className="bg-white p-5 rounded-[12px] border border-[#e3e4e8] shadow-sm">
                                    <p className="text-2xl font-bold text-[#2f3344]">{stats.pending_payouts_count}</p>
                                    <p className="text-[12px] font-bold text-[#727586] uppercase mt-1">Pending Payouts</p>
                                </div>
                                <div className="bg-white p-5 rounded-[12px] border border-[#e3e4e8] shadow-sm">
                                    <p className="text-2xl font-bold text-[#2f3344]">$0.00</p>
                                    <p className="text-[12px] font-bold text-[#727586] uppercase mt-1">Released Today</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
