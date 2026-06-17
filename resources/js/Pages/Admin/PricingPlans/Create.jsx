import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, Plus, X } from 'lucide-react';

export default function Create({ auth }) {
    const [formData, setFormData] = useState({
        name: '',
        user_type: 'customer',
        price: '',
        billing_period: 'monthly',
        trial_days: 0,
        features: [''],
        is_active: true,
        is_popular: false,
        order: 0,
    });

    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Filter out empty features
        const cleanedFeatures = formData.features.filter(f => f.trim() !== '');
        
        router.post(route('admin.pricing-plans.store'), {
            ...formData,
            features: cleanedFeatures,
        }, {
            onError: (errors) => setErrors(errors),
        });
    };

    const addFeature = () => {
        setFormData({
            ...formData,
            features: [...formData.features, ''],
        });
    };

    const removeFeature = (index) => {
        const newFeatures = formData.features.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            features: newFeatures.length > 0 ? newFeatures : [''],
        });
    };

    const updateFeature = (index, value) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData({
            ...formData,
            features: newFeatures,
        });
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Create Pricing Plan" />

            <div className="min-h-screen bg-[#fafbfc]">
                <div className="max-w-8xl mx-auto px-6 py-8">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <Link
                            href={route('admin.pricing-plans.index')}
                            className="inline-flex items-center gap-2 px-4 py-2.5 text-[#6b7280] hover:text-[#111827] hover:bg-white border border-[#e3e4e8] rounded-lg text-[14px] font-medium transition-all"
                        >
                            <ChevronLeft size={18} />
                            Back
                        </Link>
                        <div>
                            <h1 className="text-[28px] font-bold text-[#2f3344]">Create New Pricing Plan</h1>
                            <p className="text-[14px] text-[#727586]">Add a new subscription plan for customers or suppliers</p>
                        </div>
                    </div>

                    {/* 2-Column Compact Layout */}
                    <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-6">
                        
                        {/* Left Column: Main Configuration */}
                        <div className="flex-1 bg-white rounded-xl border border-[#e3e4e8] shadow-sm p-6">
                            <h2 className="text-[16px] font-bold text-[#2f3344] border-b border-[#f1f2f4] pb-4 mb-6">Plan Details</h2>
                            
                            <div className="space-y-6">
                                {/* Plan Name */}
                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">
                                        Plan Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full h-[46px] px-3 bg-white border border-[#e3e4e8] rounded-[6px] text-[14px] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all placeholder:text-[#c3c4ca]"
                                        placeholder="e.g., Monthly, Annual, Free Trial"
                                    />
                                    {errors.name && <p className="text-[12px] text-red-500">{errors.name}</p>}
                                </div>

                                {/* User Type & Billing Period */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">
                                            User Type <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={formData.user_type}
                                            onChange={(e) => setFormData({ ...formData, user_type: e.target.value })}
                                            className="w-full h-[46px] px-3 bg-white border border-[#e3e4e8] rounded-[6px] text-[14px] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all"
                                        >
                                            <option value="customer">Customer</option>
                                            <option value="supplier">Supplier</option>
                                        </select>
                                        {errors.user_type && <p className="text-[12px] text-red-500">{errors.user_type}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">
                                            Billing Period <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={formData.billing_period}
                                            onChange={(e) => setFormData({ ...formData, billing_period: e.target.value })}
                                            className="w-full h-[46px] px-3 bg-white border border-[#e3e4e8] rounded-[6px] text-[14px] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all"
                                        >
                                            <option value="trial">Free Trial</option>
                                            <option value="monthly">Monthly</option>
                                            <option value="quarterly">Quarterly</option>
                                            <option value="annual">Annual</option>
                                        </select>
                                        {errors.billing_period && <p className="text-[12px] text-red-500">{errors.billing_period}</p>}
                                    </div>
                                </div>

                                {/* Price & Trial Days */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">
                                            Price (EUR) <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0a3af] font-medium">€</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                className="w-full h-[46px] pl-7 pr-3 bg-white border border-[#e3e4e8] rounded-[6px] text-[14px] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all placeholder:text-[#c3c4ca]"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        {errors.price && <p className="text-[12px] text-red-500">{errors.price}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">
                                            Trial Days
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.trial_days}
                                            onChange={(e) => setFormData({ ...formData, trial_days: parseInt(e.target.value) || 0 })}
                                            className="w-full h-[46px] px-3 bg-white border border-[#e3e4e8] rounded-[6px] text-[14px] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all placeholder:text-[#c3c4ca]"
                                            placeholder="0"
                                        />
                                        {errors.trial_days && <p className="text-[12px] text-red-500">{errors.trial_days}</p>}
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="space-y-2 pt-2">
                                    <div className="flex items-center justify-between border-b border-[#f1f2f4] pb-2 mb-3">
                                        <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">
                                            Features
                                        </label>
                                        <button
                                            type="button"
                                            onClick={addFeature}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-[#673ab7] hover:bg-indigo-100 rounded text-[12px] font-bold transition-all"
                                        >
                                            <Plus size={14} />
                                            Add Feature
                                        </button>
                                    </div>
                                    <div className="space-y-2.5">
                                        {formData.features.map((feature, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={feature}
                                                    onChange={(e) => updateFeature(index, e.target.value)}
                                                    className="flex-1 h-[42px] px-3 bg-white border border-[#e3e4e8] rounded-[6px] text-[14px] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all placeholder:text-[#c3c4ca]"
                                                    placeholder="e.g., Priority support"
                                                />
                                                {formData.features.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFeature(index)}
                                                        className="w-[42px] h-[42px] flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 border border-[#e3e4e8] rounded-[6px] transition-all"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    {errors.features && <p className="text-[12px] text-red-500">{errors.features}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Settings & Actions */}
                        <div className="w-full lg:w-[320px] flex flex-col gap-6">
                            
                            {/* Publishing Settings */}
                            <div className="bg-white rounded-xl border border-[#e3e4e8] shadow-sm p-6">
                                <h2 className="text-[16px] font-bold text-[#2f3344] border-b border-[#f1f2f4] pb-4 mb-6">Settings</h2>
                                
                                <div className="space-y-6">
                                    {/* Order */}
                                    <div className="space-y-1.5">
                                        <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">
                                            Display Order
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.order}
                                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                            className="w-full h-[46px] px-3 bg-white border border-[#e3e4e8] rounded-[6px] text-[14px] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all"
                                            placeholder="0"
                                        />
                                        <p className="text-[11px] text-[#727586]">Lower numbers appear first</p>
                                    </div>

                                    <div className="space-y-4 pt-2 border-t border-[#f1f2f4]">
                                        {/* Checkboxes */}
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={formData.is_active}
                                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                                className="w-4 h-4 text-[#673ab7] border-[#e3e4e8] rounded focus:ring-[#673ab7] cursor-pointer"
                                            />
                                            <span className="text-[14px] font-bold text-[#2f3344] group-hover:text-[#673ab7] transition-colors">Active</span>
                                        </label>

                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={formData.is_popular}
                                                onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                                                className="w-4 h-4 text-[#673ab7] border-[#e3e4e8] rounded focus:ring-[#673ab7] cursor-pointer"
                                            />
                                            <span className="text-[14px] font-bold text-[#2f3344] group-hover:text-[#673ab7] transition-colors">Mark as Popular</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="bg-white rounded-xl border border-[#e3e4e8] shadow-sm p-6 flex flex-col gap-3">
                                <button
                                    type="submit"
                                    className="w-full bg-[#673ab7] text-white py-2.5 rounded-[6px] font-bold text-[14px] hover:bg-[#5e35b1] transition-all shadow-sm flex justify-center items-center gap-2"
                                >
                                    Create Plan
                                </button>
                                <Link
                                    href={route('admin.pricing-plans.index')}
                                    className="w-full bg-white border border-[#e3e4e8] text-[#2f3344] py-2.5 rounded-[6px] font-bold text-[14px] hover:bg-slate-50 transition-all text-center"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
