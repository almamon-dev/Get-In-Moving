import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    AlertCircle, Search, Home, 
    User, Truck, Calendar, 
    MoreHorizontal, CheckCircle, ArrowUpRight
} from 'lucide-react';
import { useState } from 'react';

export default function Index({ issues, filters, auth }) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.issues.index'), { search: searchQuery }, { preserveState: true });
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

                {/* Main Content Card */}
                <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                    {/* Header & Filters */}
                    <div className="p-6 border-b border-[#e3e4e8] flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-600">
                                <AlertCircle size={20} />
                            </div>
                            <div>
                                <h3 className="text-[16px] font-bold text-[#2f3344]">Active Cases</h3>
                                <p className="text-[12px] text-[#727586]">Manage and resolve customer complaints</p>
                            </div>
                        </div>

                        <form onSubmit={handleSearch} className="relative w-full sm:w-auto">
                            <input
                                type="text"
                                placeholder="Order #, customer or supplier..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full sm:w-[320px] h-[42px] pl-10 pr-4 rounded-[8px] bg-[#f8f9fa] border-transparent focus:border-[#673ab7] focus:bg-white text-[13px] transition-all focus:ring-1 focus:ring-[#673ab7]/20 placeholder-[#a0a3af] text-[#2f3344] outline-none"
                            />
                            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a0a3af]" />
                        </form>
                    </div>

                    {/* Table Area */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#e3e4e8] bg-[#fdfdfd]">
                                    <th className="text-left px-7 py-4 text-[12px] font-bold text-[#727586] uppercase tracking-wider">Order & Date</th>
                                    <th className="text-left px-5 py-4 text-[12px] font-bold text-[#727586] uppercase tracking-wider">Involved Parties</th>
                                    <th className="text-left px-5 py-4 text-[12px] font-bold text-[#727586] uppercase tracking-wider">Issue Reason</th>
                                    <th className="text-left px-5 py-4 text-[12px] font-bold text-[#727586] uppercase tracking-wider text-right">Amount</th>
                                    <th className="text-right px-7 py-4 text-[12px] font-bold text-[#727586] uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f1f2f4]">
                                {issues.data.length > 0 ? (
                                    issues.data.map((issue) => (
                                        <tr key={issue.id} className="hover:bg-[#fafbfc] transition-colors group">
                                            <td className="px-7 py-5">
                                                <p className="text-[13px] font-bold text-[#673ab7]">#{issue.order_number}</p>
                                                <p className="text-[12px] text-[#727586] mt-1 flex items-center gap-1">
                                                    <Calendar size={12} className="text-[#a0a3af]" /> 
                                                    {new Date(issue.created_at).toLocaleDateString()}
                                                </p>
                                            </td>
                                            <td className="px-5 py-5">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-[10px] font-bold uppercase">C</div>
                                                        <span className="text-[13px] font-bold text-[#2f3344]">{issue.customer?.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 text-[10px] font-bold uppercase">S</div>
                                                        <span className="text-[13px] font-bold text-[#2f3344]">{issue.supplier?.name}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-5">
                                                <div className="max-w-[280px]">
                                                    <p className="text-[13px] text-[#424453] leading-relaxed italic border-l-2 border-rose-200 pl-3">
                                                        "{issue.status_note || 'The customer rejected the delivery confirmation.'}"
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-5 py-5 text-right">
                                                <p className="text-[15px] font-bold text-[#2f3344]">
                                                    ${parseFloat(issue.total_amount).toLocaleString()}
                                                </p>
                                            </td>
                                            <td className="px-7 py-5 text-right">
                                                <button className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#673ab7] text-white text-[12px] font-bold rounded-lg hover:bg-[#5e35b1] transition-colors shadow-sm">
                                                    Resolve Case <ArrowUpRight size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-7 py-24 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-16 h-16 bg-[#f8f9fa] rounded-full flex items-center justify-center mb-2">
                                                    <AlertCircle size={32} className="text-[#c3c4ca]" />
                                                </div>
                                                <p className="text-[16px] font-bold text-[#2f3344]">No active issues reported</p>
                                                <p className="text-[14px] text-[#727586]">Everything looks clear for now!</p>
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
