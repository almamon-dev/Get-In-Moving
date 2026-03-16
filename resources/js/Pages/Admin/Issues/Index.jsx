import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    AlertCircle, 
    Search, 
    ArrowRight,
    User,
    Truck,
    Calendar,
    MoreHorizontal,
    CheckCircle
} from 'lucide-react';
import { useState } from 'react';

export default function Index({ issues, filters }) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    
    const handleSearch = (e) => {
        e.preventDefault();
        // Trigger inertia visit for search
    };

    return (
        <AdminLayout
            header={
                <h2 className="text-xl font-bold leading-tight text-slate-800">
                    Raised Issues & Disputes
                </h2>
            }
        >
            <Head title="Raised Issues" />

            <div className="space-y-6">
                {/* Header & Search */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl bg-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0a66c2]/20 focus:border-[#0a66c2] transition-all"
                            placeholder="Search by order number, customer or supplier..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Issues Table/List */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Order & Date</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Parties Involved</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Issue Reason</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Amount</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {issues.data.length > 0 ? (
                                issues.data.map((issue) => (
                                    <tr key={issue.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-[#0a66c2] text-sm">#{issue.order_number}</span>
                                                <span className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                                                    <Calendar size={12} /> {new Date(issue.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <User size={14} className="text-slate-400" />
                                                    <span className="font-medium">{issue.customer?.name}</span>
                                                    <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded uppercase font-bold">Client</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <Truck size={14} className="text-slate-400" />
                                                    <span className="font-medium">{issue.supplier?.name}</span>
                                                    <span className="text-[10px] px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded uppercase font-bold">Supplier</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="max-w-xs">
                                                <p className="text-sm text-slate-600 italic line-clamp-2">
                                                    "{issue.status_note || 'The customer rejected the delivery confirmation.'}"
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="font-bold text-slate-700">${parseFloat(issue.total_amount).toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center">
                                            <AlertCircle size={40} className="text-slate-200 mb-3" />
                                            <p className="text-slate-500 font-medium">No active issues or disputes reported.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
