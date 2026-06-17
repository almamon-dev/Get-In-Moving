import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Plus, Edit, Trash2, Power, PowerOff, Check, 
    Users, Truck, Euro, Calendar, Award, Upload,
    Search, Filter, RotateCw, LayoutGrid, Eye, ExternalLink
} from 'lucide-react';

export default function Index({ auth, supplierPlans, customerPlans }) {
    const [activeTab, setActiveTab] = useState('All');
    const [selectedPlans, setSelectedPlans] = useState([]);
    
    // UI states
    const [showFilters, setShowFilters] = useState(false);
    const [showColumnManager, setShowColumnManager] = useState(false);
    
    // Filter and layout states
    const [filters, setFilters] = useState({ search: '', billing_period: '' });
    const [visibleColumns, setVisibleColumns] = useState({
        status: true,
        targetUser: true,
        price: true,
        billing: true,
        features: true,
        popular: true
    });

    const toggleSelection = (id) => {
        setSelectedPlans(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
    };

    const toggleAll = (e) => {
        if (e.target.checked) {
            setSelectedPlans(filteredPlans.map(p => p.id));
        } else {
            setSelectedPlans([]);
        }
    };

    const handleBulkDelete = () => {
        if (selectedPlans.length === 0) return;
        if (confirm(`Are you sure you want to delete ${selectedPlans.length} plans?`)) {
            router.post(route('admin.pricing-plans.bulk-destroy'), { ids: selectedPlans }, {
                onSuccess: () => setSelectedPlans([])
            });
        }
    };

    const toggleActive = (planId) => {
        router.patch(route('admin.pricing-plans.toggle-active', planId));
    };

    const deletePlan = (planId) => {
        if (confirm('Are you sure you want to delete this pricing plan?')) {
            router.delete(route('admin.pricing-plans.destroy', planId));
        }
    };

    const getBillingPeriodLabel = (period) => {
        const labels = {
            trial: 'Free Trial',
            monthly: 'Monthly',
            quarterly: 'Quarterly',
            annual: 'Annual'
        };
        return labels[period] || period;
    };

    // Combine and sort plans for the table
    const allPlans = [...supplierPlans, ...customerPlans].sort((a, b) => a.order - b.order);

    // Filter plans based on active tab and search/filters
    const filteredPlans = allPlans.filter(plan => {
        // Tab filters
        if (activeTab === 'Supplier' && plan.user_type !== 'supplier') return false;
        if (activeTab === 'Customer' && plan.user_type !== 'customer') return false;
        if (activeTab === 'Active' && !plan.is_active) return false;
        if (activeTab === 'Draft' && plan.is_active) return false;

        // Search filter
        if (filters.search && !plan.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
        
        // Additional Filters
        if (filters.billing_period && plan.billing_period !== filters.billing_period) return false;

        return true;
    });

    // Reset selection when changing tabs
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSelectedPlans([]);
    };

    const getCount = (tabName) => {
        if (tabName === 'All') return allPlans.length;
        if (tabName === 'Supplier') return supplierPlans.length;
        if (tabName === 'Customer') return customerPlans.length;
        if (tabName === 'Active') return allPlans.filter(p => p.is_active).length;
        if (tabName === 'Draft') return allPlans.filter(p => !p.is_active).length;
        return 0;
    };

    const tabs = ['All', 'Supplier', 'Customer', 'Active', 'Draft'];

    return (
        <AdminLayout user={auth.user}>
            <Head title="Pricing Plans" />

            <div className="min-h-screen bg-[#f5f6f8]">
                <div className="w-full mx-auto px-6 py-8">
                    
                    {/* Header Row */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                        <div>
                            <h1 className="text-[24px] font-bold text-[#111827] tracking-tight">Pricing Plans</h1>
                            <p className="text-[14px] text-[#6b7280] mt-0.5">Manage your subscription packages, pricing, and features details</p>
                        </div>
                        <div className="flex items-center gap-3 mt-4 md:mt-0">
                            {selectedPlans.length > 0 && (
                                <button 
                                    onClick={handleBulkDelete}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded text-[13px] font-medium hover:bg-red-100 transition-colors shadow-sm"
                                >
                                    <Trash2 size={16} />
                                    Delete Selected ({selectedPlans.length})
                                </button>
                            )}
                            <Link
                                href={route('admin.pricing-plans.create')}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-[#673ab7] text-white rounded text-[13px] font-medium hover:bg-[#5e35b1] transition-colors shadow-sm"
                            >
                                <Plus size={16} />
                                Add Plan
                            </Link>
                        </div>
                    </div>

                    {/* Main Container */}
                    <div className="bg-white rounded-md border border-[#e5e7eb] shadow-sm">
                        
                        {/* Tabs Row */}
                        <div className="flex items-center gap-6 px-6 border-b border-[#e5e7eb] overflow-x-auto">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => handleTabChange(tab)}
                                    className={`flex items-center gap-2 py-3.5 text-[14px] font-medium border-b-2 whitespace-nowrap transition-colors ${
                                        activeTab === tab 
                                            ? 'border-[#673ab7] text-[#673ab7]' 
                                            : 'border-transparent text-[#6b7280] hover:text-[#374151] hover:border-gray-300'
                                    }`}
                                >
                                    {tab}
                                    <span className="bg-[#f3f4f6] text-[#4b5563] text-[11px] px-2 py-0.5 rounded-full font-bold">
                                        {getCount(tab)}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Search & Filter Toolbar */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 border-b border-[#e5e7eb]">
                            <div className="relative w-full md:w-[400px]">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                                <input 
                                    type="text" 
                                    placeholder="Search plans by name..." 
                                    value={filters.search}
                                    onChange={e => setFilters({...filters, search: e.target.value})}
                                    className="w-full h-10 pl-10 pr-4 bg-white border border-[#d1d5db] rounded-[4px] text-[13px] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] placeholder:text-[#9ca3af]"
                                />
                            </div>
                            <div className="flex items-center gap-2 w-full md:w-auto relative">
                                <button 
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`flex-1 md:flex-none inline-flex justify-center items-center gap-2 px-4 py-2 border rounded-[4px] text-[13px] font-medium transition-colors ${showFilters ? 'bg-[#f5f3ff] border-[#673ab7] text-[#673ab7]' : 'bg-white border-[#d1d5db] text-[#374151] hover:bg-gray-50'}`}
                                >
                                    <Filter size={14} />
                                    More Filters
                                    {filters.billing_period && <span className="w-2 h-2 rounded-full bg-[#673ab7] ml-1"></span>}
                                </button>
                                <div className="relative">
                                    <button 
                                        onClick={() => setShowColumnManager(!showColumnManager)}
                                        title="Column Layout"
                                        className={`w-10 h-10 flex items-center justify-center border rounded-[4px] transition-colors ${showColumnManager ? 'bg-[#f5f3ff] border-[#673ab7] text-[#673ab7]' : 'bg-white border-[#d1d5db] text-[#6b7280] hover:bg-gray-50'}`}
                                    >
                                        <LayoutGrid size={16} />
                                    </button>
                                    
                                    {showColumnManager && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white border border-[#e5e7eb] rounded-md shadow-lg z-20 py-2">
                                            <div className="px-4 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 mb-1">
                                                Manage Columns
                                            </div>
                                            {Object.entries({
                                                status: 'Status', targetUser: 'Target User', price: 'Price', 
                                                billing: 'Billing', features: 'Features', popular: 'Popular'
                                            }).map(([key, label]) => (
                                                <label key={key} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={visibleColumns[key]}
                                                        onChange={(e) => setVisibleColumns({...visibleColumns, [key]: e.target.checked})}
                                                        className="w-4 h-4 rounded border-gray-300 text-[#673ab7] focus:ring-[#673ab7]"
                                                    />
                                                    <span className="text-[13px] font-medium text-gray-700">{label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Extended Filters Panel */}
                        {showFilters && (
                            <div className="flex gap-4 p-4 border-b border-[#e5e7eb] bg-[#f9fafb]">
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Billing Period</label>
                                    <select 
                                        value={filters.billing_period}
                                        onChange={e => setFilters({...filters, billing_period: e.target.value})}
                                        className="h-9 pl-3 pr-8 border border-[#d1d5db] rounded-[4px] text-[13px] text-[#374151] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] min-w-[160px]"
                                    >
                                        <option value="">All Periods</option>
                                        <option value="trial">Free Trial</option>
                                        <option value="monthly">Monthly</option>
                                        <option value="quarterly">Quarterly</option>
                                        <option value="annual">Annual</option>
                                    </select>
                                </div>
                                <div className="flex items-end mb-1 ml-2">
                                    <button 
                                        onClick={() => {
                                            setFilters({ search: '', billing_period: '' });
                                            setActiveTab('All');
                                            setSelectedPlans([]);
                                            setShowFilters(false);
                                        }}
                                        className="text-[12px] font-bold text-red-500 hover:text-red-700 hover:underline transition-colors tracking-wide uppercase"
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Selection Banner */}
                        {selectedPlans.length > 0 && (
                            <div className="bg-[#f5f3ff] border-b border-[#ede9fe] px-6 py-2.5 flex items-center justify-between">
                                <div className="text-[13px] text-[#5b21b6]">
                                    <span className="font-semibold">{selectedPlans.length}</span> plans selected.
                                    {selectedPlans.length < allPlans.length && (
                                        <button 
                                            onClick={() => setSelectedPlans(allPlans.map(p => p.id))}
                                            className="ml-2 font-semibold text-[#673ab7] hover:text-[#5e35b1] underline"
                                        >
                                            Select all {allPlans.length} plans
                                        </button>
                                    )}
                                </div>
                                <button 
                                    onClick={() => setSelectedPlans([])}
                                    className="text-[13px] font-semibold text-[#673ab7] hover:text-[#5e35b1]"
                                >
                                    Clear selection
                                </button>
                            </div>
                        )}

                        {/* Data Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse whitespace-nowrap">
                                <thead>
                                    <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]/50">
                                        <th className="py-2 px-3 text-[11px] font-bold text-[#6b7280] uppercase tracking-wider w-[40px] text-center">
                                            <input 
                                                type="checkbox" 
                                                checked={filteredPlans.length > 0 && selectedPlans.length === filteredPlans.length}
                                                onChange={toggleAll}
                                                className="w-3.5 h-3.5 rounded border-gray-300 text-[#673ab7] focus:ring-[#673ab7]" 
                                            />
                                        </th>
                                        <th className="py-2 px-3 text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">Plan</th>
                                        {visibleColumns.status && <th className="py-2 px-3 text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">Status</th>}
                                        {visibleColumns.targetUser && <th className="py-2 px-3 text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">Target User</th>}
                                        {visibleColumns.price && <th className="py-2 px-3 text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">Price</th>}
                                        {visibleColumns.billing && <th className="py-2 px-3 text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">Billing</th>}
                                        {visibleColumns.features && <th className="py-2 px-3 text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">Features</th>}
                                        {visibleColumns.popular && <th className="py-2 px-3 text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">Popular</th>}
                                        <th className="py-2 px-3 text-[11px] font-bold text-[#6b7280] uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#e5e7eb]">
                                    {filteredPlans.length > 0 ? (
                                        filteredPlans.map((plan) => (
                                            <tr key={plan.id} className="hover:bg-[#f9fafb] transition-colors group">
                                                <td className="py-2 px-3 text-center">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={selectedPlans.includes(plan.id)}
                                                        onChange={() => toggleSelection(plan.id)}
                                                        className="w-3.5 h-3.5 rounded border-gray-300 text-[#673ab7] focus:ring-[#673ab7]" 
                                                    />
                                                </td>
                                                <td className="py-2 px-3">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-8 h-8 border border-[#e5e7eb] rounded bg-white flex items-center justify-center p-1 flex-shrink-0 text-[#6b7280]">
                                                            {plan.user_type === 'supplier' ? <Truck size={14} /> : <Users size={14} />}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[12px] font-bold text-[#111827]">{plan.name}</span>
                                                            <span className="text-[10px] text-[#9ca3af] mt-0.5 uppercase tracking-wider">#PLAN-{plan.id.toString().padStart(4, '0')}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                {visibleColumns.status && (
                                                    <td className="py-2 px-3">
                                                        <div className={`inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded-[4px] text-[10px] font-bold tracking-wide ${
                                                            plan.is_active ? 'bg-[#ecfdf5] text-[#059669]' : 'bg-[#fef2f2] text-[#dc2626]'
                                                        }`}>
                                                            <span className="text-[6px]">●</span>
                                                            {plan.is_active ? 'ACTIVE' : 'DRAFT'}
                                                        </div>
                                                    </td>
                                                )}
                                                {visibleColumns.targetUser && (
                                                    <td className="py-2 px-3">
                                                        <span className="text-[12px] font-semibold text-[#4b5563] capitalize">{plan.user_type}</span>
                                                    </td>
                                                )}
                                                {visibleColumns.price && (
                                                    <td className="py-2 px-3">
                                                        <span className="text-[12px] font-bold text-[#111827]">€{plan.price}</span>
                                                    </td>
                                                )}
                                                {visibleColumns.billing && (
                                                    <td className="py-2 px-3">
                                                        <span className="inline-flex px-1.5 py-0.5 bg-[#f3f4f6] text-[#6b7280] text-[10px] font-bold uppercase rounded-[4px] tracking-wider">
                                                            {getBillingPeriodLabel(plan.billing_period)}
                                                        </span>
                                                    </td>
                                                )}
                                                {visibleColumns.features && (
                                                    <td className="py-2 px-3">
                                                        <span className="text-[12px] text-[#6b7280] font-medium">{plan.features?.length || 0} items</span>
                                                    </td>
                                                )}
                                                {visibleColumns.popular && (
                                                    <td className="py-2 px-3">
                                                        {plan.is_popular ? (
                                                            <Check size={14} className="text-[#059669]" />
                                                        ) : (
                                                            <span className="text-[#d1d5db]">-</span>
                                                        )}
                                                    </td>
                                                )}
                                                <td className="py-2 px-3 text-right">
                                                    <div className="flex items-center justify-end">
                                                        <div className="flex bg-white shadow-sm border border-[#e5e7eb] rounded-[4px] overflow-hidden">
                                                            <button 
                                                                onClick={() => toggleActive(plan.id)}
                                                                title={plan.is_active ? 'Deactivate' : 'Activate'}
                                                                className="w-7 h-7 flex items-center justify-center bg-[#f3f4f6] hover:bg-[#e5e7eb] text-[#4b5563] border-r border-[#e5e7eb] transition-colors"
                                                            >
                                                                {plan.is_active ? <PowerOff size={12} /> : <Power size={12} />}
                                                            </button>
                                                            <Link 
                                                                href={route('admin.pricing-plans.show', plan.id)}
                                                                title="View Details"
                                                                className="w-7 h-7 flex items-center justify-center bg-[#f0fdfa] hover:bg-[#ccfbf1] text-[#0d9488] border-r border-[#e5e7eb] transition-colors"
                                                            >
                                                                <Eye size={12} />
                                                            </Link>
                                                            <Link 
                                                                href={route('admin.pricing-plans.edit', plan.id)}
                                                                title="Edit Plan"
                                                                className="w-7 h-7 flex items-center justify-center bg-[#ebf5ff] hover:bg-[#dbeafe] text-[#2563eb] border-r border-[#e5e7eb] transition-colors"
                                                            >
                                                                <Edit size={12} />
                                                            </Link>
                                                            <button 
                                                                onClick={() => deletePlan(plan.id)}
                                                                title="Delete Plan"
                                                                className="w-7 h-7 flex items-center justify-center bg-[#fef2f2] hover:bg-[#fee2e2] text-[#dc2626] transition-colors"
                                                            >
                                                                <Trash2 size={12} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="9" className="py-12 text-center">
                                                <Euro size={32} className="mx-auto text-[#d1d5db] mb-3" />
                                                <h3 className="text-[14px] font-semibold text-[#374151] mb-1">No plans found</h3>
                                                <p className="text-[12px] text-[#6b7280]">Adjust your filters or create a new pricing plan.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Footer */}
                        <div className="flex items-center justify-end px-6 py-4 border-t border-[#e5e7eb] bg-white rounded-b-md">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <select className="py-1 pl-3 pr-8 border border-[#d1d5db] rounded-[4px] text-[13px] text-[#374151] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] leading-tight">
                                        <option>10</option>
                                        <option>25</option>
                                        <option>50</option>
                                    </select>
                                </div>
                                <span className="text-[13px] font-medium text-[#374151]">
                                    1 - {filteredPlans.length} of {allPlans.length}
                                </span>
                                <div className="flex items-center gap-1">
                                    <button className="w-8 h-8 flex items-center justify-center border border-[#d1d5db] rounded-[4px] text-[#9ca3af] hover:bg-gray-50 cursor-not-allowed">
                                        <span className="text-lg leading-none mb-1">‹</span>
                                    </button>
                                    <button className="w-8 h-8 flex items-center justify-center border border-[#d1d5db] rounded-[4px] text-[#9ca3af] hover:bg-gray-50 cursor-not-allowed">
                                        <span className="text-lg leading-none mb-1">›</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
