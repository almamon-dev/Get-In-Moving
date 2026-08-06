import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import {
  CreditCard,
  Zap,
  Clock,
  FileText,
  ShieldAlert,
  Home,
  ChevronRight
} from "lucide-react";

export default function Dashboard({ auth, metrics, accounts }) {
  return (
    <AdminLayout user={auth.user}>
      <Head title="Credit Management Dashboard" />

      <div className="space-y-6 w-full mx-auto px-6 py-8 pb-20">
        
        {/* Header Row matching Index.jsx */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[13px] text-[#727586] mb-1">
              <Home size={16} className="text-[#727586]" />
              <span className="text-[#c3c4ca]">-</span>
              <span className="hover:text-[#673ab7]">Credit Management</span>
              <span className="text-[#c3c4ca]">-</span>
              <span>Dashboard</span>
            </div>
            <h1 className="text-[24px] font-bold text-[#111827] tracking-tight">
              Customer Credit & Pay Later Dashboard
            </h1>
            <p className="text-[14px] text-[#6b7280] mt-0.5">
              Risk analysis, exposure tracking & credit allocation ledger
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={route("admin.credit.requests.index")}
              className="px-4 h-[36px] bg-[#673ab7] hover:bg-[#5e35b1] text-white rounded-[8px] font-bold text-[13px] transition-colors flex items-center gap-2 shadow-sm"
            >
              <FileText size={16} />
              <span>Review Pay Later Requests ({metrics.pending_requests})</span>
            </Link>
          </div>
        </div>

        {/* Clean Unified Metrics Card */}
        <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#e3e4e8]">
            
            <div className="flex items-center justify-between sm:pr-6">
              <div>
                <p className="text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">
                  Total Credit Issued
                </p>
                <p className="text-[22px] font-bold text-[#2f3344]">
                  €{Number(metrics.total_credit_issued).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[11px] text-[#727586] mt-0.5">
                  Utilization: <strong className="text-[#673ab7]">{metrics.credit_utilization_percentage}%</strong>
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-purple-50 text-[#673ab7] flex items-center justify-center shrink-0">
                <CreditCard size={20} />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 sm:pt-0 sm:px-6">
              <div>
                <p className="text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">
                  Outstanding Balance
                </p>
                <p className="text-[22px] font-bold text-[#2f3344]">
                  €{Number(metrics.outstanding_balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[11px] text-[#727586] mt-0.5">Active deferred orders</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                <Clock size={20} />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 sm:pt-0 sm:px-6">
              <div>
                <p className="text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">
                  Available Credit
                </p>
                <p className="text-[22px] font-bold text-green-600">
                  €{Number(metrics.available_credit).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[11px] text-[#727586] mt-0.5">Ready for checkout</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                <Zap size={20} />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 sm:pt-0 sm:pl-6">
              <div>
                <p className="text-[11px] text-[#727586] font-medium uppercase tracking-wider mb-1">
                  Pending Requests
                </p>
                <p className="text-[22px] font-bold text-[#2f3344]">
                  {metrics.pending_requests}
                </p>
                <p className="text-[11px] text-[#727586] mt-0.5">Requires admin review</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <ShieldAlert size={20} />
              </div>
            </div>

          </div>
        </div>

        {/* Credit Accounts Table matching Index.jsx */}
        <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#e3e4e8] flex justify-between items-center">
            <h2 className="text-[15px] font-bold text-[#2f3344]">Customer Credit Accounts</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e3e4e8]">
                  <th className="text-left px-6 py-3 text-[12px] font-bold text-[#2f3344] uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="text-left px-4 py-3 text-[12px] font-bold text-[#2f3344] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-[12px] font-bold text-[#2f3344] uppercase tracking-wider">
                    Credit Limit
                  </th>
                  <th className="text-left px-4 py-3 text-[12px] font-bold text-[#2f3344] uppercase tracking-wider">
                    Used Credit
                  </th>
                  <th className="text-left px-4 py-3 text-[12px] font-bold text-[#2f3344] uppercase tracking-wider">
                    Available Credit
                  </th>
                  <th className="px-6 py-3 text-right text-[12px] font-bold text-[#2f3344] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f2f4]">
                {accounts && accounts.length > 0 ? (
                  accounts.map((acc) => (
                    <tr key={acc.id} className="hover:bg-[#fafbfc] transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#673ab7] to-[#9c27b0] flex items-center justify-center text-white font-bold text-[13px]">
                            {acc.user?.name?.charAt(0).toUpperCase() || 'C'}
                          </div>
                          <div>
                            <Link 
                              href={route('admin.credit.customer.profile', acc.user_id)}
                              className="text-[13px] font-bold text-[#2f3344] hover:text-[#673ab7] transition-colors"
                            >
                              {acc.user?.name || 'Customer'}
                            </Link>
                            <p className="text-[11px] text-[#727586]">{acc.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-0.5 border rounded-full text-[11px] font-bold uppercase tracking-wide ${
                          acc.status === 'active' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'
                        }`}>
                          {acc.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[13px] font-bold text-[#2f3344]">
                        €{Number(acc.credit_limit || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-[13px] font-bold text-amber-600">
                        €{Number(acc.used_credit || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-[13px] font-bold text-green-600">
                        €{Number(acc.available_credit || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <Link
                          href={route('admin.credit.customer.profile', acc.user_id)}
                          className="px-3 h-[30px] bg-white border border-[#e3e4e8] text-[#2f3344] hover:bg-[#f8f9fa] rounded-[6px] text-[12px] font-bold transition-all inline-flex items-center gap-1"
                        >
                          View Profile
                          <ChevronRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-[#727586] text-[13px]">
                      No credit accounts found.
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
