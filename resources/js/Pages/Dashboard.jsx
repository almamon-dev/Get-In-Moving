import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    Users, 
    Truck, 
    ShoppingCart, 
    Lock, 
    AlertCircle, 
    ArrowRight,
    Clock,
    DollarSign
} from 'lucide-react';

export default function Dashboard({ stats, recent_disputes }) {
    const statCards = [
        { label: 'Total Customers', value: stats.total_customers, icon: <Users className="text-blue-600" />, color: 'bg-blue-50' },
        { label: 'Total Suppliers', value: stats.total_suppliers, icon: <Truck className="text-purple-600" />, color: 'bg-purple-50' },
        { label: 'Total Orders', value: stats.total_orders, icon: <ShoppingCart className="text-orange-600" />, color: 'bg-orange-50' },
        { label: 'Held in Escrow', value: `$${stats.held_amount.toLocaleString()}`, icon: <Lock className="text-red-600" />, color: 'bg-red-50', subtext: `${stats.pending_payouts_count} payouts pending` },
        { label: 'Raised Issues', value: stats.disputed_orders_count, icon: <AlertCircle className="text-rose-600" />, color: 'bg-rose-50', subtext: 'Rejected PODs' },
    ];

    return (
        <AdminLayout
            header={
                <h2 className="text-xl font-bold leading-tight text-slate-800">
                    Admin Overview
                </h2>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {statCards.map((card, index) => (
                        <div key={index} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl ${card.color} group-hover:scale-110 transition-transform duration-300`}>
                                    {card.icon}
                                </div>
                                <div className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-full capitalize">
                                    Overall
                                </div>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{card.value}</h3>
                                <p className="text-sm font-medium text-slate-500 mt-1">{card.label}</p>
                                {card.subtext && (
                                    <p className="text-xs text-slate-400 mt-2 flex items-center gap-1 italic">
                                        <Clock size={12} /> {card.subtext}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Disputes Section */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-rose-50 rounded-lg">
                                    <AlertCircle className="text-rose-600" size={20} />
                                </div>
                                <h3 className="font-bold text-slate-800">Recent Issues & Disputes</h3>
                            </div>
                            <Link href="#" className="text-sm font-semibold text-[#0a66c2] hover:underline flex items-center gap-1">
                                View All <ArrowRight size={14} />
                            </Link>
                        </div>
                        <div className="p-0">
                            {recent_disputes.length > 0 ? (
                                <div className="divide-y divide-slate-50">
                                    {recent_disputes.map((order) => (
                                        <div key={order.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-bold text-[#0a66c2]">#{order.order_number}</span>
                                                <span className="px-2 py-1 text-[10px] uppercase font-bold bg-rose-100 text-rose-700 rounded-md">POD Rejected</span>
                                            </div>
                                            <p className="text-sm text-slate-600 line-clamp-2 italic mb-3">
                                                "{order.status_note || 'No reason specified'}"
                                            </p>
                                            <div className="flex items-center justify-between text-xs text-slate-400">
                                                <div className="flex items-center gap-4">
                                                    <span className="flex items-center gap-1">
                                                        <Users size={12} /> {order.customer?.name}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Truck size={12} /> {order.supplier?.name}
                                                    </span>
                                                </div>
                                                <span>{new Date(order.updated_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <AlertCircle className="text-slate-300" size={32} />
                                    </div>
                                    <p className="text-slate-500 font-medium">No active disputes found.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Escrow Quick Release (Placeholder for now) */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <Lock className="text-blue-600" size={20} />
                                </div>
                                <h3 className="font-bold text-slate-800">Financial Overview</h3>
                            </div>
                            <Link href={route('admin.transactions.index')} className="text-sm font-semibold text-[#0a66c2] hover:underline flex items-center gap-1">
                                Transactions <ArrowRight size={14} />
                            </Link>
                        </div>
                        <div className="p-8 text-center bg-slate-50/30">
                            <div className="flex flex-col items-center">
                                <div className="text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">Total Fund in Hold</div>
                                <div className="text-5xl font-black text-slate-800 mb-4 tracking-tight">
                                    ${stats.held_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-8">
                                    <div className="h-full bg-blue-500 w-[60%] rounded-full shadow-inner" />
                                </div>
                                <div className="grid grid-cols-2 w-full gap-4">
                                    <div className="bg-white p-4 rounded-xl border border-slate-100">
                                        <div className="text-2xl font-bold text-slate-800">{stats.pending_payouts_count}</div>
                                        <div className="text-xs text-slate-500 font-medium">Pending Payouts</div>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-slate-100">
                                        <div className="text-2xl font-bold text-slate-800">$0.00</div>
                                        <div className="text-xs text-slate-500 font-medium">Released Today</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

