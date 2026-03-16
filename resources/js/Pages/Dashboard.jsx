import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    Home, Users, Truck, ShoppingCart, 
    Lock, AlertCircle, ArrowRight, Clock,
    TrendingUp, Activity, DollarSign, Calendar,
    ArrowUpRight, ArrowDownRight, UserCircle
} from 'lucide-react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
    PieChart, Pie, Cell, Legend 
} from 'recharts';

export default function Dashboard({ auth, stats, recent_disputes, revenue_data, user_distribution, recent_transactions }) {
    const statCards = [
        { 
            label: 'Total Revenue', 
            value: `$${parseFloat(stats.total_revenue).toLocaleString()}`, 
            icon: <TrendingUp size={24} />, 
            color: 'text-emerald-600', 
            bg: 'bg-emerald-500/10' 
        },
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

    const COLORS = ['#0a66c2', '#a855f7'];

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
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-400 bg-white border border-slate-100 px-3 py-1.5 rounded-full flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live System Monitor
                        </span>
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

                {/* Charts Row */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                    {/* Revenue Area Chart */}
                    <div className="xl:col-span-8 bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm p-6">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-[16px] font-bold text-[#2f3344]">Revenue Growth</h3>
                                <p className="text-[13px] text-slate-500">Monthly breakdown of system earnings</p>
                            </div>
                            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                                <TrendingUp size={20} />
                            </div>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenue_data}>
                                    <defs>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#673ab7" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#673ab7" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f2f4" />
                                    <XAxis 
                                        dataKey="month" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fontSize: 12, fill: '#adb5bd'}}
                                        dy={10}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fontSize: 12, fill: '#adb5bd'}}
                                        tickFormatter={(value) => `$${value}`}
                                    />
                                    <Tooltip 
                                        contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                                        formatter={(value) => [`$${value}`, 'Revenue']}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="total" 
                                        stroke="#673ab7" 
                                        strokeWidth={3}
                                        fillOpacity={1} 
                                        fill="url(#colorTotal)" 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* User Distribution Pie Chart */}
                    <div className="xl:col-span-4 bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm p-6 flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-[16px] font-bold text-[#2f3344]">User Base</h3>
                            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                <Users size={20} />
                            </div>
                        </div>
                        <div className="flex-1 min-h-[250px] relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={user_distribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {user_distribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36}/>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                                <p className="text-2xl font-black text-[#2f3344]">{stats.total_customers + stats.total_suppliers}</p>
                                <p className="text-[10px] uppercase font-bold text-slate-400">Total Users</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent History & Transactions */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                    {/* Recent Transactions Table */}
                    <div className="xl:col-span-8 bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-[#e3e4e8] flex items-center justify-between bg-[#fdfdfd]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                    <Activity size={20} />
                                </div>
                                <h3 className="text-[16px] font-bold text-[#2f3344]">Recent Transactions</h3>
                            </div>
                            <Link href={route('admin.transactions.index')} className="text-[13px] font-bold text-[#673ab7] hover:underline flex items-center gap-1">
                                View History <ArrowRight size={14} />
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[#e3e4e8] bg-[#fdfdfd]">
                                        <th className="text-left px-7 py-4 text-[12px] font-bold text-[#727586] uppercase tracking-wider whitespace-nowrap">Supplier</th>
                                        <th className="text-left px-5 py-4 text-[12px] font-bold text-[#727586] uppercase tracking-wider">Type</th>
                                        <th className="text-right px-7 py-4 text-[12px] font-bold text-[#727586] uppercase tracking-wider whitespace-nowrap">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#f1f2f4]">
                                    {recent_transactions.map((transaction) => (
                                        <tr key={transaction.id} className="hover:bg-[#fafbfc] transition-colors group">
                                            <td className="px-7 py-4">
                                                <p className="text-[13px] font-bold text-[#2f3344]">{transaction.supplier?.name}</p>
                                                <p className="text-[11px] text-slate-400 mt-0.5">{new Date(transaction.created_at).toLocaleDateString()}</p>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                    transaction.type === 'earning' ? 'bg-emerald-50 text-emerald-600' : 
                                                    transaction.type === 'withdrawal' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-600'
                                                }`}>
                                                    {transaction.type === 'earning' ? <ArrowDownRight size={10} /> : <ArrowUpRight size={10} />}
                                                    {transaction.type}
                                                </span>
                                            </td>
                                            <td className="px-7 py-4 text-right">
                                                <p className={`text-[14px] font-bold ${transaction.type === 'earning' ? 'text-emerald-600' : 'text-[#2f3344]'}`}>
                                                    {transaction.type === 'earning' ? '+' : '-'}${parseFloat(transaction.amount).toLocaleString()}
                                                </p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Recent Disputes Sidebar */}
                    <div className="xl:col-span-4 bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm overflow-hidden h-fit">
                        <div className="p-6 border-b border-[#e3e4e8] flex items-center justify-between bg-[#fdfdfd]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-600">
                                    <AlertCircle size={20} />
                                </div>
                                <h3 className="text-[16px] font-bold text-[#2f3344]">Active Issues</h3>
                            </div>
                            <Link href={route('admin.issues.index')} className="text-[13px] font-bold text-[#673ab7] hover:underline flex items-center gap-1">
                                All <ArrowRight size={14} />
                            </Link>
                        </div>
                        
                        <div className="p-0">
                            {recent_disputes.length > 0 ? (
                                <div className="divide-y divide-[#f1f2f4]">
                                    {recent_disputes.map((order) => (
                                        <div key={order.id} className="p-6 hover:bg-[#fafbfc] transition-colors">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-xs font-bold text-[#673ab7]">#{order.order_number}</span>
                                                <span className="px-2 py-0.5 text-[9px] uppercase font-bold bg-rose-100 text-rose-700 rounded-md">Rejected</span>
                                            </div>
                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center gap-2 text-[13px] text-slate-600">
                                                    <UserCircle className="text-slate-400" size={14} />
                                                    <span className="font-medium">{order.customer?.name}</span>
                                                </div>
                                            </div>
                                            <p className="text-[12px] text-slate-500 italic line-clamp-2">
                                                "{order.status_note || 'No reason specified'}"
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center">
                                    <p className="text-[14px] text-[#727586]">No active issues.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
