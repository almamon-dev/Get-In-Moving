import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
  Search,
  Check,
  X,
  FileText,
  AlertCircle,
  Home,
  ChevronLeft
} from "lucide-react";
import Modal from "@/Components/Modal";

export default function Requests({ auth, requests, filters }) {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  const [approvedLimit, setApprovedLimit] = useState(5000);
  const [paymentTermsDays, setPaymentTermsDays] = useState(14);
  const [notes, setNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  const handleApprove = (e) => {
    e.preventDefault();
    if (!selectedRequest) return;

    router.patch(
      route("admin.credit.requests.approve", selectedRequest.id),
      {
        approved_limit: approvedLimit,
        payment_terms_days: paymentTermsDays,
        notes,
      },
      {
        onSuccess: () => {
          setApproveModalOpen(false);
          setSelectedRequest(null);
        },
      }
    );
  };

  const handleReject = (e) => {
    e.preventDefault();
    if (!selectedRequest || !rejectionReason.trim()) return;

    router.patch(
      route("admin.credit.requests.reject", selectedRequest.id),
      { rejection_reason: rejectionReason },
      {
        onSuccess: () => {
          setRejectModalOpen(false);
          setSelectedRequest(null);
        },
      }
    );
  };

  return (
    <AdminLayout user={auth.user}>
      <Head title="Pay Later Facility Requests" />

      <div className="space-y-6 w-full mx-auto px-6 py-8 pb-20">
        
        {/* Header Row matching Index.jsx */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[13px] text-[#727586] mb-1">
              <Home size={16} className="text-[#727586]" />
              <span className="text-[#c3c4ca]">-</span>
              <span className="hover:text-[#673ab7]">Credit Management</span>
              <span className="text-[#c3c4ca]">-</span>
              <span>Requests</span>
            </div>
            <h1 className="text-[24px] font-bold text-[#111827] tracking-tight">
              Pay Later Facility Requests
            </h1>
            <p className="text-[14px] text-[#6b7280] mt-0.5">
              Review document verification, risk assessments & approve credit limits
            </p>
          </div>

          <Link
            href={route("admin.credit.dashboard")}
            className="flex items-center gap-2 text-[#673ab7] hover:underline font-bold text-[14px]"
          >
            <ChevronLeft size={18} />
            Credit Dashboard
          </Link>
        </div>

        {/* Requests Table Container matching Index.jsx */}
        <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#e3e4e8] flex justify-between items-center">
            <h2 className="text-[15px] font-bold text-[#2f3344]">Pending & Reviewed Requests</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e3e4e8]">
                  <th className="text-left px-6 py-3 text-[12px] font-bold text-[#2f3344] uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="text-left px-4 py-3 text-[12px] font-bold text-[#2f3344] uppercase tracking-wider">
                    Requested Limit
                  </th>
                  <th className="text-left px-4 py-3 text-[12px] font-bold text-[#2f3344] uppercase tracking-wider">
                    Approved Limit
                  </th>
                  <th className="text-left px-4 py-3 text-[12px] font-bold text-[#2f3344] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-[12px] font-bold text-[#2f3344] uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-[12px] font-bold text-[#2f3344] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f2f4]">
                {requests.data.length > 0 ? (
                  requests.data.map((req) => (
                    <tr key={req.id} className="hover:bg-[#fafbfc] transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#673ab7] to-[#9c27b0] flex items-center justify-center text-white font-bold text-[13px]">
                            {req.user?.name?.charAt(0).toUpperCase() || 'C'}
                          </div>
                          <div>
                            <p className="text-[13px] font-bold text-[#2f3344]">{req.user?.name || 'Customer'}</p>
                            <p className="text-[11px] text-[#727586]">{req.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[13px] font-bold text-[#2f3344]">
                        €{Number(req.requested_credit_limit || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-[13px] font-bold text-green-600">
                        €{Number(req.approved_credit_limit || req.requested_credit_limit || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-0.5 border rounded-full text-[11px] font-bold uppercase tracking-wide inline-block ${
                          req.status === 'approved' ? 'border-green-200 bg-green-50 text-green-700' :
                          req.status === 'pending' ? 'border-orange-200 bg-orange-50 text-orange-700' : 'border-red-200 bg-red-50 text-red-700'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-[#727586]">
                        {new Date(req.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {req.status === 'pending' && (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedRequest(req);
                                  setApprovedLimit(req.requested_credit_limit || 5000);
                                  setApproveModalOpen(true);
                                }}
                                className="px-3 h-[30px] bg-green-600 hover:bg-green-700 text-white rounded-[6px] text-[12px] font-bold transition-all"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedRequest(req);
                                  setRejectModalOpen(true);
                                }}
                                className="px-3 h-[30px] bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white rounded-[6px] text-[12px] font-bold transition-all"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-[#727586] text-[13px]">
                      No Pay Later requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Approve Modal */}
      <Modal show={approveModalOpen} onClose={() => setApproveModalOpen(false)} maxWidth="md">
        <form onSubmit={handleApprove} className="p-6 space-y-4">
          <h2 className="text-[18px] font-bold text-[#2f3344] border-b border-[#e3e4e8] pb-3">
            Approve Pay Later Facility - {selectedRequest?.user?.name}
          </h2>
          <div>
            <label className="block text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">Approved Limit (€)</label>
            <input
              type="number"
              step="0.01"
              value={approvedLimit}
              onChange={(e) => setApprovedLimit(e.target.value)}
              className="w-full h-10 px-3 bg-white border border-[#d1d5db] rounded-[8px] text-[13px] font-bold text-[#2f3344] focus:outline-none focus:border-[#673ab7]"
            />
          </div>
          <div>
            <label className="block text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">Notes / Terms</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 bg-white border border-[#d1d5db] rounded-[8px] text-[13px] text-[#2f3344] focus:outline-none focus:border-[#673ab7]"
              placeholder="Approval notes..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setApproveModalOpen(false)} className="px-4 py-2 text-[13px] font-bold text-[#727586] hover:bg-[#f8f9fa] rounded-[8px]">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-[13px] font-bold text-white bg-[#673ab7] hover:bg-[#5e35b1] rounded-[8px]">
              Approve Facility
            </button>
          </div>
        </form>
      </Modal>

      {/* Reject Modal */}
      <Modal show={rejectModalOpen} onClose={() => setRejectModalOpen(false)} maxWidth="md">
        <form onSubmit={handleReject} className="p-6 space-y-4">
          <h2 className="text-[18px] font-bold text-[#2f3344] border-b border-[#e3e4e8] pb-3">
            Reject Pay Later Facility - {selectedRequest?.user?.name}
          </h2>
          <div>
            <label className="block text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">Rejection Reason</label>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-3 bg-white border border-[#d1d5db] rounded-[8px] text-[13px] text-[#2f3344] focus:outline-none focus:border-[#673ab7]"
              placeholder="Specify reason..."
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setRejectModalOpen(false)} className="px-4 py-2 text-[13px] font-bold text-[#727586] hover:bg-[#f8f9fa] rounded-[8px]">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-[13px] font-bold text-white bg-red-600 hover:bg-red-700 rounded-[8px]">
              Reject Facility
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}
