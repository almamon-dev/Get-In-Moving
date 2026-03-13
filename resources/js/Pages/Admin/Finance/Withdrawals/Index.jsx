import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Home, Search, X, Check, AlertCircle, Trash2,
    ChevronDown, ChevronLeft, ChevronRight, ArrowUpDown, Banknote,
    Clock, CheckCircle, Eye, MessageSquare, XCircle
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function Index({ auth, withdrawRequests, filters = {} }) {
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [adminNote, setAdminNote] = useState('');
    const [showPromo, setShowPromo] = useState(true);

    const handleStatusUpdate = (id, status) => {
        router.patch(route('admin.withdrawals.status', id), {
            status,
            admin_note: adminNote
        }, {
            onSuccess: () => {
                toast.success(`Request marked as ${status}`);
                setIsModalOpen(false);
                setAdminNote('');
            },
            onError: () => toast.error('Failed to update status')
        });
    };

    const handleStatusChange = (newStatus) => {
        setStatusFilter(newStatus);
        router.get(route('admin.withdrawals.index'), { status: newStatus }, { preserveState: true });
    };

    const handlePageChange = (url) => {
        if (url) router.get(url, {}, { preserveState: true });
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'completed': return 'border-[#00b090] text-[#00b090]';
            case 'approved': return 'border-[#2c8af8] text-[#2c8af8]';
            case 'rejected': return 'border-[#ff4d4f] text-[#ff4d4f]';
            default: return 'border-[#ffb000] text-[#ffb000]';
        }
    };

    const StatusBadge = ({ status }) => (
        <div className="flex items-center gap-2">
            <div className={`w-[18px] h-[18px] rounded-full border-[1.5px] flex items-center justify-center ${getStatusStyle(status)}`}>
                {status === 'completed' || status === 'approved' ? (
                    <Check size={11} strokeWidth={3} />
                ) : status === 'rejected' ? (
                    <X size={11} strokeWidth={3} />
                ) : (
                    <Clock size={11} strokeWidth={3} />
                )}
            </div>
            <span className="text-[13px] font-medium text-[#2f3344] capitalize">{status}</span>
        </div>
    );

    return (
        <AdminLayout user={auth.user}>
            <Head title="Withdrawal Requests" />

            <div className="space-y-6 max-w-8xl mx-auto pb-20">
                {/* Top Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-[24px] font-bold text-[#2f3344] tracking-tight">
                            Withdrawal Management
                        </h1>
                        <div className="flex items-center gap-2 text-[13px] text-[#727586] mt-1">
                            <Home size={16} className="text-[#727586]" />
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Withdrawals</span>
                        </div>
                    </div>
                </div>

                {/* Promo Banner */}
                {showPromo && (
                    <div className="relative bg-[#f4f0ff] rounded-[12px] p-6 border border-[#e9e3ff] overflow-hidden flex items-center justify-between">
                        <div className="flex-1">
                            <h2 className="text-[18px] font-bold text-[#2f3344] mb-1">
                                Manage and process supplier payout requests
                            </h2>
                            <p className="text-[14px] text-[#727586]">
                                Review withdrawal details, process payments and update status for supplier earnings.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-[100px] h-[60px] relative hidden md:block">
                                <div className="absolute right-0 top-0 text-[#673ab7] opacity-20 transform rotate-12">
                                    <Banknote size={40} />
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

                {/* Main Content Card */}
                <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                    {/* Filter Tabs */}
                    <div className="px-6 border-b border-[#e3e4e8]">
                        <div className="flex gap-10">
                            {['all', 'pending', 'approved', 'completed', 'rejected'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => handleStatusChange(status)}
                                    className={`pt-5 pb-4 text-[14px] font-bold transition-all relative capitalize ${
                                        statusFilter === status ? 'text-[#673ab7]' : 'text-[#727586] hover:text-[#2f3344]'
                                    }`}
                                >
                                    {status}
                                    {statusFilter === status && (
                                        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#673ab7] rounded-t-full"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table Area */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#e3e4e8]">
                                    <th className="text-left px-7 py-4 text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">
                                        Supplier
                                    </th>
                                    <th className="text-left px-5 py-4 text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="text-left px-5 py-4 text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">
                                        Method
                                    </th>
                                    <th className="text-left px-5 py-4 text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="text-left px-5 py-4 text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-7 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f1f2f4]">
                                {withdrawRequests.data.length > 0 ? (
                                    withdrawRequests.data.map((request) => (
                                        <tr key={request.id} className="hover:bg-[#fafbfc] transition-colors group">
                                            <td className="px-7 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2c8af8] to-[#1a7ae8] flex items-center justify-center text-white font-bold text-[14px]">
                                                        {(request.account_name || request.supplier?.name || "U").charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-[14px] font-bold text-[#2f3344] group-hover:text-[#673ab7] transition-colors">
                                                            {request.account_name || request.supplier?.name}
                                                        </p>
                                                        <p className="text-[12px] text-[#727586] font-normal">
                                                            {request.supplier?.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-5">
                                                <span className="text-[14px] font-bold text-[#2f3344]">
                                                    ${parseFloat(request.amount).toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="px-5 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-[13px] font-medium text-[#2f3344]">{request.payment_method}</span>
                                                    <span className="text-[11px] text-[#727586] truncate max-w-[150px]">{request.payment_details}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-5">
                                                <StatusBadge status={request.status} />
                                            </td>
                                            <td className="px-5 py-5">
                                                <span className="text-[13px] text-[#727586]">
                                                    {new Date(request.created_at).toLocaleDateString()}
                                                </span>
                                            </td>
                                            <td className="pr-7 py-5 text-right">
                                                <button 
                                                    onClick={() => {
                                                        setSelectedRequest(request);
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="h-[36px] inline-flex items-center bg-white border border-[#e3e4e8] text-[#2f3344] px-4 rounded-[6px] font-bold text-[13px] hover:border-[#673ab7] hover:text-[#673ab7] transition-all"
                                                >
                                                    View & Process
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-7 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3 text-[#727586]">
                                                <div className="w-16 h-16 bg-[#f8f9fa] rounded-full flex items-center justify-center mb-2">
                                                    <Banknote size={30} className="text-[#c3c4ca]" />
                                                </div>
                                                <p className="text-[16px] font-bold text-[#2f3344]">No withdrawal requests found</p>
                                                <p className="text-[14px]">Try adjusting your status filter.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-end gap-6 px-8 py-5 border-t border-[#e3e4e8]">
                        <span className="text-[13px] text-[#2f3344] font-medium">
                            {withdrawRequests.from || 0} - {withdrawRequests.to || 0} of {withdrawRequests.total || 0}
                        </span>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => handlePageChange(withdrawRequests.prev_page_url)}
                                disabled={!withdrawRequests.prev_page_url}
                                className="w-[34px] h-[34px] flex items-center justify-center rounded-full text-[#673ab7] hover:bg-[#673ab7]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button 
                                onClick={() => handlePageChange(withdrawRequests.next_page_url)}
                                disabled={!withdrawRequests.next_page_url}
                                className="w-[34px] h-[34px] flex items-center justify-center rounded-full text-[#673ab7] hover:bg-[#673ab7]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Request Detail Modal - Kept the modern style for the modal but adapted colors */}
            {isModalOpen && selectedRequest && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Process Request</h3>
                                <p className="text-sm text-slate-500">Review and update withdrawal status</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors">
                                <XCircle size={20} />
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6 bg-[#f4f0ff] p-5 rounded-xl border border-[#e9e3ff]">
                                <div className="space-y-1">
                                    <p className="text-[11px] font-bold text-[#673ab7] uppercase tracking-wider">Amount</p>
                                    <p className="text-xl font-bold text-[#673ab7]">${parseFloat(selectedRequest.amount).toLocaleString()}</p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</p>
                                    <StatusBadge status={selectedRequest.status} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 border border-slate-100 rounded-xl">
                                    <p className="text-sm font-bold text-slate-700">Payment Details</p>
                                    <p className="text-sm text-slate-500 mt-1">{selectedRequest.payment_details}</p>
                                    <p className="text-[12px] text-slate-400 mt-2">
                                        Account Name: {selectedRequest.account_name}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[13px] font-bold text-slate-700 flex items-center gap-2">
                                        <MessageSquare size={14} className="text-slate-400" />
                                        Admin Note
                                    </label>
                                    <textarea 
                                        rows="3"
                                        placeholder="Add transaction ID or reason..."
                                        value={adminNote}
                                        onChange={(e) => setAdminNote(e.target.value)}
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all resize-none"
                                    ></textarea>
                                </div>
                            </div>

                            {selectedRequest.status === 'pending' && (
                                <div className="flex gap-4 pt-4">
                                    <button 
                                        onClick={() => handleStatusUpdate(selectedRequest.id, 'completed')}
                                        className="flex-1 bg-[#673ab7] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#5a32a3] shadow-lg shadow-[#673ab7]/20 transition-all"
                                    >
                                        Approve & Complete
                                    </button>
                                    <button 
                                        onClick={() => handleStatusUpdate(selectedRequest.id, 'rejected')}
                                        className="flex-1 bg-white border border-rose-200 text-rose-500 py-3 rounded-xl font-bold text-sm hover:bg-rose-50 transition-all"
                                    >
                                        Reject Payout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
