import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
  User,
  CreditCard,
  Package,
  FileText,
  Clock,
  ShieldAlert,
  Activity,
  Plus,
  ChevronLeft,
  Home,
  Check,
  AlertCircle,
  XCircle,
  PauseCircle,
  PlayCircle
} from "lucide-react";
import Modal from "@/Components/Modal";

export default function CustomerCreditProfile({
  auth,
  customer,
  account,
  activeTab = "summary",
  orders = [],
  invoices = [],
  ledger = [],
  payments = [],
  auditLogs = [],
}) {
  const [tab, setTab] = useState(activeTab);
  const [limitModalOpen, setLimitModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newLimit, setNewLimit] = useState(account.credit_limit || 5000);
  const [targetStatus, setTargetStatus] = useState("suspended");
  const [reason, setReason] = useState("");

  const handleAdjustLimit = (e) => {
    e.preventDefault();
    router.patch(
      route("admin.credit.account.adjust-limit", account.id),
      { credit_limit: newLimit, reason },
      { onSuccess: () => setLimitModalOpen(false) }
    );
  };

  const handleUpdateStatus = (e) => {
    e.preventDefault();
    router.patch(
      route("admin.credit.account.update-status", account.id),
      { status: targetStatus, reason },
      { onSuccess: () => setStatusModalOpen(false) }
    );
  };

  const tabs = [
    { id: "summary", label: "Credit Summary", icon: CreditCard },
    { id: "profile", label: "Profile Info", icon: User },
    { id: "orders", label: `Orders (${orders.length})`, icon: Package },
    { id: "invoices", label: `Invoices (${invoices.length})`, icon: FileText },
    { id: "ledger", label: `Ledger (${ledger.length})`, icon: Clock },
    { id: "payments", label: `Payments (${payments.length})`, icon: Activity },
    { id: "audit", label: `Audit Logs (${auditLogs.length})`, icon: ShieldAlert },
  ];

  return (
    <AdminLayout user={auth.user}>
      <Head title={`Credit Profile - ${customer.name}`} />

      <div className="space-y-6 w-full mx-auto px-6 py-8 pb-20">
        
        {/* Header Row matching Index.jsx */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[13px] text-[#727586] mb-1">
              <Home size={16} className="text-[#727586]" />
              <span className="text-[#c3c4ca]">-</span>
              <Link href={route('admin.customers.index')} className="hover:text-[#673ab7]">
                Customers
              </Link>
              <span className="text-[#c3c4ca]">-</span>
              <span>Credit Profile</span>
            </div>
            <h1 className="text-[24px] font-bold text-[#111827] tracking-tight">Customer Credit Profile</h1>
          </div>

          <Link
            href={route('admin.customers.index')}
            className="flex items-center gap-2 text-[#673ab7] hover:underline font-bold text-[14px]"
          >
            <ChevronLeft size={18} />
            Back to Customers
          </Link>
        </div>

        {/* Profile Banner Card */}
        <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm overflow-hidden p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#673ab7] to-[#9c27b0] flex items-center justify-center text-white font-bold text-[24px] shrink-0">
              {customer.name?.charAt(0)?.toUpperCase() || 'C'}
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-[20px] font-bold text-[#2f3344]">{customer.name}</h2>
                <span className={`px-2.5 py-0.5 border rounded-full text-[11px] font-bold uppercase tracking-wide ${
                  account.status === 'active' ? 'border-green-200 bg-green-50 text-green-700' :
                  account.status === 'suspended' ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-red-200 bg-red-50 text-red-700'
                }`}>
                  {account.status}
                </span>
              </div>
              <p className="text-[13px] text-[#727586] mt-1">{customer.email} • {customer.company_name || 'Individual Customer'}</p>
            </div>
          </div>

          {/* Action Buttons matching Index.jsx button style */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setNewLimit(account.credit_limit);
                setLimitModalOpen(true);
              }}
              className="px-4 h-[36px] bg-[#673ab7] hover:bg-[#5e35b1] text-white rounded-[8px] font-bold text-[13px] transition-colors flex items-center gap-2 shadow-sm"
            >
              <Plus size={16} />
              <span>Adjust Credit Limit</span>
            </button>

            {account.status === 'active' ? (
              <button
                onClick={() => {
                  setTargetStatus('suspended');
                  setStatusModalOpen(true);
                }}
                className="px-4 h-[36px] bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 rounded-[8px] font-bold text-[13px] transition-colors flex items-center gap-2"
              >
                <PauseCircle size={15} />
                <span>Suspend Credit</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setTargetStatus('active');
                  setStatusModalOpen(true);
                }}
                className="px-4 h-[36px] bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 rounded-[8px] font-bold text-[13px] transition-colors flex items-center gap-2"
              >
                <PlayCircle size={15} />
                <span>Resume Credit</span>
              </button>
            )}

            <button
              onClick={() => {
                setTargetStatus('revoked');
                setStatusModalOpen(true);
              }}
              className="px-4 h-[36px] bg-red-50 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white rounded-[8px] font-bold text-[13px] transition-colors flex items-center gap-2"
            >
              <XCircle size={15} />
              <span>Revoke Facility</span>
            </button>
          </div>
        </div>

        {/* Card Container for Navigation Tabs & Tab Content */}
        <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm overflow-hidden">
          
          {/* Tabs Bar */}
          <div className="flex items-center gap-6 px-6 border-b border-[#e3e4e8] overflow-x-auto">
            {tabs.map((t) => {
              const isActive = tab === t.id;
              const Icon = t.icon;

              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-2 py-4 text-[14px] font-bold border-b-2 whitespace-nowrap transition-colors ${
                    isActive
                      ? "border-[#673ab7] text-[#673ab7]"
                      : "border-transparent text-[#727586] hover:text-[#2f3344]"
                  }`}
                >
                  <Icon size={16} />
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {tab === "summary" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="p-5 bg-[#f8f6ff] rounded-[8px] border border-[#e9e3fb]">
                    <p className="text-[11px] text-[#673ab7] font-medium uppercase tracking-wider mb-1">Credit Limit</p>
                    <p className="text-[22px] font-bold text-[#2f3344]">€{Number(account.credit_limit || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div className="p-5 bg-amber-50 rounded-[8px] border border-amber-200">
                    <p className="text-[11px] text-amber-700 font-medium uppercase tracking-wider mb-1">Used Credit</p>
                    <p className="text-[22px] font-bold text-[#2f3344]">€{Number(account.used_credit || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div className="p-5 bg-green-50 rounded-[8px] border border-green-200">
                    <p className="text-[11px] text-green-700 font-medium uppercase tracking-wider mb-1">Available Credit</p>
                    <p className="text-[22px] font-bold text-[#2f3344]">€{Number(account.available_credit || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </div>
            )}

            {tab === "profile" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-[13px]">
                <div>
                  <p className="text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">Customer Name</p>
                  <p className="font-bold text-[#2f3344]">{customer.name}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">Email</p>
                  <p className="font-bold text-[#2f3344]">{customer.email}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">Company</p>
                  <p className="font-bold text-[#2f3344]">{customer.company_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">Phone</p>
                  <p className="font-bold text-[#2f3344]">{customer.phone_number || 'N/A'}</p>
                </div>
              </div>
            )}

            {tab === "orders" && (
              <div className="text-[13px] text-[#727586]">
                {orders.length > 0 ? (
                  <p className="font-bold text-[#2f3344]">{orders.length} order(s) found.</p>
                ) : (
                  <p>No orders recorded for this customer.</p>
                )}
              </div>
            )}

            {tab === "invoices" && (
              <div className="text-[13px] text-[#727586]">
                {invoices.length > 0 ? (
                  <p className="font-bold text-[#2f3344]">{invoices.length} invoice(s) found.</p>
                ) : (
                  <p>No invoices recorded for this customer.</p>
                )}
              </div>
            )}

            {tab === "ledger" && (
              <div className="text-[13px] text-[#727586]">
                {ledger.length > 0 ? (
                  <p className="font-bold text-[#2f3344]">{ledger.length} ledger entry(ies) found.</p>
                ) : (
                  <p>No credit ledger entries found.</p>
                )}
              </div>
            )}

            {tab === "payments" && (
              <div className="text-[13px] text-[#727586]">
                {payments.length > 0 ? (
                  <p className="font-bold text-[#2f3344]">{payments.length} payment(s) recorded.</p>
                ) : (
                  <p>No payment entries found.</p>
                )}
              </div>
            )}

            {tab === "audit" && (
              <div className="text-[13px] text-[#727586]">
                {auditLogs.length > 0 ? (
                  <p className="font-bold text-[#2f3344]">{auditLogs.length} audit log(s) found.</p>
                ) : (
                  <p>No audit logs available.</p>
                )}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Adjust Limit Modal */}
      <Modal show={limitModalOpen} onClose={() => setLimitModalOpen(false)} maxWidth="md">
        <form onSubmit={handleAdjustLimit} className="p-6 space-y-4">
          <h2 className="text-[18px] font-bold text-[#2f3344] border-b border-[#e3e4e8] pb-3">
            Adjust Credit Limit
          </h2>
          <div>
            <label className="block text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">New Credit Limit (€)</label>
            <input
              type="number"
              step="0.01"
              value={newLimit}
              onChange={(e) => setNewLimit(e.target.value)}
              className="w-full h-10 px-3 bg-white border border-[#d1d5db] rounded-[8px] text-[13px] font-bold text-[#2f3344] focus:outline-none focus:border-[#673ab7]"
            />
          </div>
          <div>
            <label className="block text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">Reason / Note</label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-3 bg-white border border-[#d1d5db] rounded-[8px] text-[13px] text-[#2f3344] focus:outline-none focus:border-[#673ab7]"
              placeholder="Reason for adjustment..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setLimitModalOpen(false)} className="px-4 py-2 text-[13px] font-bold text-[#727586] hover:bg-[#f8f9fa] rounded-[8px]">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-[13px] font-bold text-white bg-[#673ab7] hover:bg-[#5e35b1] rounded-[8px]">
              Save Limit
            </button>
          </div>
        </form>
      </Modal>

      {/* Status Modal */}
      <Modal show={statusModalOpen} onClose={() => setStatusModalOpen(false)} maxWidth="md">
        <form onSubmit={handleUpdateStatus} className="p-6 space-y-4">
          <h2 className="text-[18px] font-bold text-[#2f3344] border-b border-[#e3e4e8] pb-3">
            Update Account Status: {targetStatus}
          </h2>
          <div>
            <label className="block text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">Reason / Note</label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-3 bg-white border border-[#d1d5db] rounded-[8px] text-[13px] text-[#2f3344] focus:outline-none focus:border-[#673ab7]"
              placeholder="Specify reason..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setStatusModalOpen(false)} className="px-4 py-2 text-[13px] font-bold text-[#727586] hover:bg-[#f8f9fa] rounded-[8px]">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-[13px] font-bold text-white bg-[#673ab7] hover:bg-[#5e35b1] rounded-[8px]">
              Update Status
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}
