import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, Save } from 'lucide-react';

export default function Edit({ auth, page }) {
    const [formData, setFormData] = useState({
        title: page.title || '',
        slug: page.slug || '',
        content: page.content || '',
        is_published: page.is_published ?? true,
    });

    const [errors, setErrors] = useState({});

    // Auto-generate slug from title
    const handleTitleChange = (e) => {
        const title = e.target.value;
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
            
        setFormData({ ...formData, title, slug });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.put(route('admin.pages.update', page.id), formData, {
            onError: (err) => setErrors(err),
        });
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title={`Edit ${page.title}`} />

            <div className="min-h-screen bg-[#fafbfc]">
                <div className="max-w-5xl mx-auto px-6 py-8">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <Link
                            href={route('admin.pages.index')}
                            className="inline-flex items-center gap-2 px-4 py-2.5 text-[#6b7280] hover:text-[#111827] hover:bg-white border border-[#e3e4e8] rounded-lg text-[14px] font-medium transition-all"
                        >
                            <ChevronLeft size={18} />
                            Back
                        </Link>
                        <div>
                            <h1 className="text-[28px] font-bold text-[#2f3344]">Edit Page</h1>
                            <p className="text-[14px] text-[#727586]">Update details for {page.title}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="bg-white rounded-xl border border-[#e3e4e8] shadow-sm p-6">
                            <div className="space-y-6">
                                {/* Title & Slug Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">
                                            Page Title <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={handleTitleChange}
                                            className="w-full h-[46px] px-3 bg-white border border-[#e3e4e8] rounded-[6px] text-[14px] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all"
                                            placeholder="e.g. Terms and Conditions"
                                        />
                                        {errors.title && <p className="text-[12px] text-red-500">{errors.title}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">
                                            URL Slug <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.slug}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                            className="w-full h-[46px] px-3 bg-white border border-[#e3e4e8] rounded-[6px] text-[14px] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all"
                                            placeholder="e.g. terms-and-conditions"
                                        />
                                        {errors.slug && <p className="text-[12px] text-red-500">{errors.slug}</p>}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">
                                        Page Content (HTML supported)
                                    </label>
                                    <textarea
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        rows="15"
                                        className="w-full p-4 bg-white border border-[#e3e4e8] rounded-[6px] text-[14px] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all font-mono"
                                        placeholder="<h1>Terms and Conditions</h1><p>Enter your content here...</p>"
                                    ></textarea>
                                    {errors.content && <p className="text-[12px] text-red-500">{errors.content}</p>}
                                </div>

                                {/* Status */}
                                <div className="pt-2">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_published}
                                            onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                                            className="w-4 h-4 text-[#673ab7] border-[#e3e4e8] rounded focus:ring-[#673ab7] cursor-pointer"
                                        />
                                        <span className="text-[14px] font-bold text-[#2f3344] group-hover:text-[#673ab7] transition-colors">Publish this page immediately</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3">
                            <Link
                                href={route('admin.pages.index')}
                                className="px-6 py-2.5 bg-white border border-[#e3e4e8] text-[#2f3344] rounded-[6px] font-bold text-[14px] hover:bg-slate-50 transition-all"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                className="px-6 py-2.5 bg-[#673ab7] text-white rounded-[6px] font-bold text-[14px] hover:bg-[#5e35b1] transition-all shadow-sm flex items-center gap-2"
                            >
                                <Save size={16} />
                                Update Page
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
