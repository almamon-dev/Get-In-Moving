import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { Hash, Home, Save, Tag, ShoppingBag, User, CreditCard, Receipt } from 'lucide-react';

export default function Prefixes() {
    const [formData, setFormData] = useState({
        order_prefix: 'ORD-',
        invoice_prefix: 'INV-',
        customer_prefix: 'CUST-',
        product_prefix: 'PROD-',
        transaction_prefix: 'TRX-',
        quote_prefix: 'QT-',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Prefixes Saved:', formData);
        alert('Universal prefixes updated successfully!');
    };

    return (
        <AdminLayout>
            <Head title="Prefix Settings" />
            
            <form onSubmit={handleSubmit} className="space-y-6 pb-20">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-[22px] font-bold text-[#2f3344]">System Prefixes</h1>
                        <div className="flex items-center gap-2 text-[13px] text-[#727586] mt-1">
                            <Home size={14} />
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Settings</span>
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Website</span>
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Prefixes</span>
                        </div>
                    </div>
                    <button 
                        type="submit"
                        className="bg-[#673ab7] text-white px-8 py-[10px] rounded-[6px] font-bold text-[14px] hover:bg-[#5e35b1] transition-all shadow-sm flex items-center gap-2"
                    >
                        <Save size={18} />
                        Update Prefixes
                    </button>
                </div>

                {/* Prefix Configurations */}
                <div className="bg-white rounded-[10px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                    <div className="px-7 py-5 border-b border-[#e3e4e8]">
                        <div className="flex items-center gap-2">
                            <Tag size={20} className="text-[#673ab7]" />
                            <h2 className="text-[17px] font-bold text-[#2f3344]">Identifier Prefixes</h2>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#2f3344]">Order Prefix</label>
                                <div className="relative">
                                    <input 
                                        name="order_prefix"
                                        type="text" 
                                        value={formData.order_prefix}
                                        onChange={handleInputChange}
                                        className="w-full h-[45px] pl-11 pr-4 bg-[#fafbfc] border border-[#e3e4e8] rounded-[6px] text-[14px] text-[#2f3344] focus:outline-none focus:border-[#673ab7] transition-all"
                                        placeholder="e.g. ORD-"
                                    />
                                    <ShoppingBag size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a3af]" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#2f3344]">Invoice Prefix</label>
                                <div className="relative">
                                    <input 
                                        name="invoice_prefix"
                                        type="text" 
                                        value={formData.invoice_prefix}
                                        onChange={handleInputChange}
                                        className="w-full h-[45px] pl-11 pr-4 bg-[#fafbfc] border border-[#e3e4e8] rounded-[6px] text-[14px] text-[#2f3344] focus:outline-none focus:border-[#673ab7] transition-all"
                                        placeholder="e.g. INV-"
                                    />
                                    <Receipt size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a3af]" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#2f3344]">Customer Prefix</label>
                                <div className="relative">
                                    <input 
                                        name="customer_prefix"
                                        type="text" 
                                        value={formData.customer_prefix}
                                        onChange={handleInputChange}
                                        className="w-full h-[45px] pl-11 pr-4 bg-[#fafbfc] border border-[#e3e4e8] rounded-[6px] text-[14px] text-[#2f3344] focus:outline-none focus:border-[#673ab7] transition-all"
                                        placeholder="e.g. CUST-"
                                    />
                                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a3af]" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#2f3344]">Product SKU Prefix</label>
                                <div className="relative">
                                    <input 
                                        name="product_prefix"
                                        type="text" 
                                        value={formData.product_prefix}
                                        onChange={handleInputChange}
                                        className="w-full h-[45px] pl-11 pr-4 bg-[#fafbfc] border border-[#e3e4e8] rounded-[6px] text-[14px] text-[#2f3344] focus:outline-none focus:border-[#673ab7] transition-all"
                                        placeholder="e.g. SKU-"
                                    />
                                    <Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a3af]" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#2f3344]">Transaction Prefix</label>
                                <div className="relative">
                                    <input 
                                        name="transaction_prefix"
                                        type="text" 
                                        value={formData.transaction_prefix}
                                        onChange={handleInputChange}
                                        className="w-full h-[45px] pl-11 pr-4 bg-[#fafbfc] border border-[#e3e4e8] rounded-[6px] text-[14px] text-[#2f3344] focus:outline-none focus:border-[#673ab7] transition-all"
                                        placeholder="e.g. TXN-"
                                    />
                                    <CreditCard size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a3af]" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#2f3344]">Quote Prefix</label>
                                <div className="relative">
                                    <input 
                                        name="quote_prefix"
                                        type="text" 
                                        value={formData.quote_prefix}
                                        onChange={handleInputChange}
                                        className="w-full h-[45px] pl-11 pr-4 bg-[#fafbfc] border border-[#e3e4e8] rounded-[6px] text-[14px] text-[#2f3344] focus:outline-none focus:border-[#673ab7] transition-all"
                                        placeholder="e.g. QT-"
                                    />
                                    <Tag size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a3af]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
