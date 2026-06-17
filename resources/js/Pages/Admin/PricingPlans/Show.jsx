import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { ChevronLeft, Edit, Check, X, ShieldCheck } from 'lucide-react';

export default function Show({ auth, pricingPlan }) {
    const getBillingPeriodLabel = (period) => {
        const labels = {
            trial: 'Free Trial',
            monthly: 'Monthly',
            quarterly: 'Quarterly',
            annual: 'Annual'
        };
        return labels[period] || period;
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title={`View ${pricingPlan.name}`} />

            <div className="min-h-screen bg-[#fafbfc]">
                <div className="max-w-8xl mx-auto px-6 py-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            
                            <div>
                                <h1 className="text-[28px] font-bold text-[#2f3344]">{pricingPlan.name}</h1>
                                <p className="text-[14px] text-[#727586]">View plan details</p>
                            </div>
                        </div>
                        <Link
                            href={route('admin.pricing-plans.edit', pricingPlan.id)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#673ab7] text-white rounded-lg text-[14px] font-bold hover:bg-[#5e35b1] transition-all shadow-sm"
                        >
                            <Edit size={16} />
                            Edit Plan
                        </Link>
                    </div>

                    {/* 2-Column Compact Layout */}
                    <div className="flex flex-col lg:flex-row gap-6">
                        
                        {/* Left Column: Main Details */}
                        <div className="flex-1 bg-white rounded-xl border border-[#e3e4e8] shadow-sm p-6">
                            <h2 className="text-[16px] font-bold text-[#2f3344] border-b border-[#f1f2f4] pb-4 mb-6">Plan Details</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Details Grid */}
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-[12px] font-bold text-[#8c8f9a] uppercase tracking-wider mb-1">Plan Name</p>
                                        <p className="text-[15px] font-semibold text-[#2f3344]">{pricingPlan.name}</p>
                                    </div>
                                    
                                    <div>
                                        <p className="text-[12px] font-bold text-[#8c8f9a] uppercase tracking-wider mb-1">Target User</p>
                                        <p className="text-[15px] font-semibold text-[#2f3344] capitalize">{pricingPlan.user_type}</p>
                                    </div>

                                    <div>
                                        <p className="text-[12px] font-bold text-[#8c8f9a] uppercase tracking-wider mb-1">Price</p>
                                        <p className="text-[15px] font-semibold text-[#2f3344]">€{pricingPlan.price}</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-[12px] font-bold text-[#8c8f9a] uppercase tracking-wider mb-1">Billing Period</p>
                                        <span className="inline-flex px-2.5 py-1 bg-[#f3f4f6] text-[#4b5563] text-[12px] font-bold uppercase rounded-[4px] tracking-wider">
                                            {getBillingPeriodLabel(pricingPlan.billing_period)}
                                        </span>
                                    </div>

                                    <div>
                                        <p className="text-[12px] font-bold text-[#8c8f9a] uppercase tracking-wider mb-1">Trial Days</p>
                                        <p className="text-[15px] font-semibold text-[#2f3344]">{pricingPlan.trial_days || 0} days</p>
                                    </div>
                                    
                                    <div>
                                        <p className="text-[12px] font-bold text-[#8c8f9a] uppercase tracking-wider mb-1">Plan ID / Stripe ID</p>
                                        <p className="text-[13px] font-medium text-[#6b7280]">#{pricingPlan.id}</p>
                                        {pricingPlan.stripe_product_id && (
                                            <p className="text-[12px] text-[#8c8f9a] mt-0.5 font-mono">{pricingPlan.stripe_product_id}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="mt-8 pt-6 border-t border-[#f1f2f4]">
                                <h3 className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider mb-4">
                                    Included Features
                                </h3>
                                
                                {pricingPlan.features && pricingPlan.features.length > 0 ? (
                                    <ul className="space-y-3">
                                        {pricingPlan.features.map((feature, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <div className="mt-0.5 text-[#10b981]">
                                                    <ShieldCheck size={18} />
                                                </div>
                                                <span className="text-[14px] text-[#4b5563] leading-relaxed">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-[13px] text-[#8c8f9a] italic">No features listed for this plan.</p>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Settings */}
                        <div className="w-full lg:w-[320px] flex flex-col gap-6">
                            
                            <div className="bg-white rounded-xl border border-[#e3e4e8] shadow-sm p-6">
                                <h2 className="text-[16px] font-bold text-[#2f3344] border-b border-[#f1f2f4] pb-4 mb-6">Configuration</h2>
                                
                                <div className="space-y-5">
                                    {/* Status */}
                                    <div>
                                        <p className="text-[12px] font-bold text-[#8c8f9a] uppercase tracking-wider mb-2">Status</p>
                                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-bold tracking-wide ${
                                            pricingPlan.is_active ? 'bg-[#ecfdf5] text-[#059669]' : 'bg-[#fef2f2] text-[#dc2626]'
                                        }`}>
                                            <span className="text-[8px]">●</span>
                                            {pricingPlan.is_active ? 'ACTIVE' : 'DRAFT'}
                                        </div>
                                    </div>

                                    {/* Popular */}
                                    <div>
                                        <p className="text-[12px] font-bold text-[#8c8f9a] uppercase tracking-wider mb-2">Popular Plan Tag</p>
                                        <div className="flex items-center gap-2">
                                            {pricingPlan.is_popular ? (
                                                <>
                                                    <div className="w-6 h-6 rounded-full bg-[#ecfdf5] flex items-center justify-center text-[#059669]">
                                                        <Check size={14} />
                                                    </div>
                                                    <span className="text-[14px] font-semibold text-[#2f3344]">Yes, marked as popular</span>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-6 h-6 rounded-full bg-[#f3f4f6] flex items-center justify-center text-[#9ca3af]">
                                                        <X size={14} />
                                                    </div>
                                                    <span className="text-[14px] font-semibold text-[#6b7280]">No</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Display Order */}
                                    <div>
                                        <p className="text-[12px] font-bold text-[#8c8f9a] uppercase tracking-wider mb-1">Display Order</p>
                                        <p className="text-[15px] font-semibold text-[#2f3344]">{pricingPlan.order || 0}</p>
                                    </div>
                                    
                                    {/* Timestamps */}
                                    <div className="pt-4 border-t border-[#f1f2f4]">
                                        <p className="text-[11px] text-[#8c8f9a]">
                                            Created: {new Date(pricingPlan.created_at).toLocaleDateString()}
                                        </p>
                                        <p className="text-[11px] text-[#8c8f9a] mt-1">
                                            Last Updated: {new Date(pricingPlan.updated_at).toLocaleDateString()}
                                        </p>
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
