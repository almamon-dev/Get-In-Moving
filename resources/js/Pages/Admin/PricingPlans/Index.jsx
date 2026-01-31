import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Plus, Edit, Trash2, Power, PowerOff, Check, 
    Users, Truck, DollarSign, Calendar, Award
} from 'lucide-react';

export default function Index({ auth, supplierPlans, customerPlans }) {
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

    const PlanCard = ({ plan, userType }) => (
        <div className={`bg-white rounded-lg border transition-all ${
            plan.is_popular 
                ? 'border-[#673ab7] border-2' 
                : 'border-[#e5e7eb]'
        }`}>
            {/* Header */}
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <h3 className="text-[18px] font-bold text-[#2f3344]">{plan.name}</h3>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 flex-wrap mb-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium ${
                        userType === 'supplier' 
                            ? 'bg-[#673ab7]/10 text-[#673ab7]' 
                            : 'bg-[#3b82f6]/10 text-[#3b82f6]'
                    }`}>
                        {userType === 'supplier' ? <Truck size={12} /> : <Users size={12} />}
                        {userType === 'supplier' ? 'Supplier' : 'Customer'}
                    </span>
                    {plan.is_popular && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#f59e0b]/10 text-[#f59e0b] rounded-md text-[11px] font-medium">
                            <Award size={12} />
                            Most Popular
                        </span>
                    )}
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium ${
                        plan.is_active 
                            ? 'bg-[#10b981]/10 text-[#10b981]' 
                            : 'bg-[#ef4444]/10 text-[#ef4444]'
                    }`}>
                        {plan.is_active ? 'Inactive' : 'Inactive'}
                    </span>
                </div>

                {/* Price */}
                <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                        <span className="text-[32px] font-bold text-[#2f3344]">
                            ${plan.price}
                        </span>
                        <span className="text-[14px] text-[#727586]">
                            /{getBillingPeriodLabel(plan.billing_period).toLowerCase()}
                        </span>
                    </div>
                    {plan.trial_days > 0 && (
                        <p className="text-[13px] text-[#727586] mt-1">
                            {plan.trial_days} days free trial
                        </p>
                    )}
                </div>

                {/* Billing Period */}
                <div className="flex items-center gap-2 text-[13px] text-[#727586] mb-4 pb-4 border-b border-[#f1f2f4]">
                    <Calendar size={14} />
                    <span>{getBillingPeriodLabel(plan.billing_period)}</span>
                </div>

                {/* Features */}
                <div className="mb-6">
                    <h4 className="text-[13px] font-semibold text-[#2f3344] mb-3">Features</h4>
                    <ul className="space-y-2">
                        {plan.features && plan.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2 text-[13px] text-[#727586]">
                                <Check size={14} className="text-[#10b981] mt-0.5 flex-shrink-0" />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => toggleActive(plan.id)}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-[12px] font-medium transition-all ${
                            plan.is_active
                                ? 'bg-[#10b981]/10 text-[#10b981] hover:bg-[#10b981]/20'
                                : 'bg-[#ef4444]/10 text-[#ef4444] hover:bg-[#ef4444]/20'
                        }`}
                    >
                        {plan.is_active ? <Power size={14} /> : <PowerOff size={14} />}
                        {plan.is_active ? 'Activate' : 'Activate'}
                    </button>
                    <Link
                        href={route('admin.pricing-plans.edit', plan.id)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#3b82f6]/10 text-[#3b82f6] hover:bg-[#3b82f6]/20 rounded-md text-[12px] font-medium transition-all"
                    >
                        <Edit size={14} />
                        Edit
                    </Link>
                    <button
                        onClick={() => deletePlan(plan.id)}
                        className="flex items-center justify-center px-3 py-2 bg-[#ef4444]/10 text-[#ef4444] hover:bg-[#ef4444]/20 rounded-md text-[12px] font-medium transition-all"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <AdminLayout user={auth.user}>
            <Head title="Pricing Plans" />

            <div className="min-h-screen bg-[#fafbfc]">
                <div className="max-w-8xl mx-auto px-6 py-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-[28px] font-bold text-[#2f3344] mb-1">Pricing Plans</h1>
                            <p className="text-[14px] text-[#727586]">Manage subscription plans for customers and suppliers</p>
                        </div>
                        <Link
                            href={route('admin.pricing-plans.create')}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#673ab7] text-white hover:bg-[#5e35b1] rounded-lg text-[14px] font-medium transition-all shadow-sm"
                        >
                            <Plus size={18} />
                            Create New Plan
                        </Link>
                    </div>

                    {/* Supplier Plans */}
                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-9 h-9 rounded-lg bg-[#673ab7]/10 flex items-center justify-center">
                                <Truck size={18} className="text-[#673ab7]" />
                            </div>
                            <div>
                                <h2 className="text-[20px] font-bold text-[#2f3344]">Supplier Plans</h2>
                                <p className="text-[13px] text-[#727586]">Plans available for suppliers (includes 30-day free trial)</p>
                            </div>
                        </div>
                        {supplierPlans.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {supplierPlans.map((plan) => (
                                    <PlanCard key={plan.id} plan={plan} userType="supplier" />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg border border-[#e5e7eb] p-12 text-center">
                                <DollarSign size={40} className="mx-auto text-[#d1d5db] mb-3" />
                                <h3 className="text-[16px] font-semibold text-[#2f3344] mb-2">No Supplier Plans</h3>
                                <p className="text-[13px] text-[#727586] mb-4">Create your first supplier pricing plan</p>
                                <Link
                                    href={route('admin.pricing-plans.create')}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#673ab7] text-white hover:bg-[#5e35b1] rounded-lg text-[13px] font-medium transition-all"
                                >
                                    <Plus size={14} />
                                    Create Plan
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Customer Plans */}
                    <div>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-9 h-9 rounded-lg bg-[#3b82f6]/10 flex items-center justify-center">
                                <Users size={18} className="text-[#3b82f6]" />
                            </div>
                            <div>
                                <h2 className="text-[20px] font-bold text-[#2f3344]">Customer Plans</h2>
                                <p className="text-[13px] text-[#727586]">Plans available for customers (no free trial - must purchase)</p>
                            </div>
                        </div>
                        {customerPlans.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {customerPlans.map((plan) => (
                                    <PlanCard key={plan.id} plan={plan} userType="customer" />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg border border-[#e5e7eb] p-12 text-center">
                                <DollarSign size={40} className="mx-auto text-[#d1d5db] mb-3" />
                                <h3 className="text-[16px] font-semibold text-[#2f3344] mb-2">No Customer Plans</h3>
                                <p className="text-[13px] text-[#727586] mb-4">Create your first customer pricing plan</p>
                                <Link
                                    href={route('admin.pricing-plans.create')}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#3b82f6] text-white hover:bg-[#2563eb] rounded-lg text-[13px] font-medium transition-all"
                                >
                                    <Plus size={14} />
                                    Create Plan
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
