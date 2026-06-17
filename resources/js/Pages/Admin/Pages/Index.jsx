import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, Eye, FileText, Search, LayoutGrid, Check, CheckCircle, XCircle } from 'lucide-react';

export default function Index({ auth, pages = [] }) {
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPages, setSelectedPages] = useState([]);
    
    // Filtering Logic
    const filteredPages = pages.filter(page => {
        const matchesTab = 
            activeTab === 'All' || 
            (activeTab === 'Published' && page.is_published) || 
            (activeTab === 'Draft' && !page.is_published);
            
        const matchesSearch = page.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              page.slug.toLowerCase().includes(searchQuery.toLowerCase());
                              
        return matchesTab && matchesSearch;
    });

    const getCount = (tabName) => {
        if (tabName === 'All') return pages.length;
        if (tabName === 'Published') return pages.filter(p => p.is_published).length;
        if (tabName === 'Draft') return pages.filter(p => !p.is_published).length;
        return 0;
    };

    const tabs = ['All', 'Published', 'Draft'];

    // Selection Logic
    const toggleAll = () => {
        if (selectedPages.length === filteredPages.length) {
            setSelectedPages([]);
        } else {
            setSelectedPages(filteredPages.map(p => p.id));
        }
    };

    const toggleSelection = (id) => {
        if (selectedPages.includes(id)) {
            setSelectedPages(selectedPages.filter(pageId => pageId !== id));
        } else {
            setSelectedPages([...selectedPages, id]);
        }
    };

    const deletePage = (id) => {
        if (confirm('Are you sure you want to delete this page?')) {
            router.delete(route('admin.pages.destroy', id));
        }
    };

    const handleBulkDelete = () => {
        if (confirm(`Are you sure you want to delete ${selectedPages.length} selected pages?`)) {
            // Requires a bulk destroy route if implemented, otherwise warn
            alert('Bulk delete not yet implemented for pages.');
        }
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Page Management" />

            <div className="min-h-screen bg-[#f5f6f8]">
                <div className="w-full mx-auto px-6 py-8">
                    
                    {/* Header Row */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                        <div>
                            <h1 className="text-[24px] font-bold text-[#111827] tracking-tight">Page Management</h1>
                            <p className="text-[14px] text-[#6b7280] mt-0.5">Manage your website's dynamic pages, policies, and terms</p>
                        </div>
                        <div className="flex items-center gap-3 mt-4 md:mt-0">
                            {selectedPages.length > 0 && (
                                <button 
                                    onClick={handleBulkDelete}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded text-[13px] font-medium hover:bg-red-100 transition-colors shadow-sm"
                                >
                                    <Trash2 size={16} />
                                    Delete Selected ({selectedPages.length})
                                </button>
                            )}
                            <Link
                                href={route('admin.pages.create')}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-[#673ab7] text-white rounded text-[13px] font-medium hover:bg-[#5e35b1] transition-colors shadow-sm"
                            >
                                <Plus size={16} />
                                Create Page
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
                                    onClick={() => setActiveTab(tab)}
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

                        {/* Search Toolbar */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 border-b border-[#e5e7eb]">
                            <div className="relative w-full md:w-[400px]">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                                <input 
                                    type="text" 
                                    placeholder="Search pages by title or slug..." 
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="w-full h-10 pl-10 pr-4 bg-white border border-[#d1d5db] rounded-[4px] text-[13px] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] placeholder:text-[#9ca3af]"
                                />
                            </div>
                        </div>

                        {/* Selection Banner */}
                        {selectedPages.length > 0 && (
                            <div className="bg-[#f5f3ff] border-b border-[#ede9fe] px-6 py-2.5 flex items-center justify-between">
                                <div className="text-[13px] text-[#5b21b6]">
                                    <span className="font-semibold">{selectedPages.length}</span> pages selected.
                                    {selectedPages.length < pages.length && (
                                        <button 
                                            onClick={() => setSelectedPages(pages.map(p => p.id))}
                                            className="ml-2 font-semibold text-[#673ab7] hover:text-[#5e35b1] underline"
                                        >
                                            Select all {pages.length} pages
                                        </button>
                                    )}
                                </div>
                                <button 
                                    onClick={() => setSelectedPages([])}
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
                                                checked={filteredPages.length > 0 && selectedPages.length === filteredPages.length}
                                                onChange={toggleAll}
                                                className="w-3.5 h-3.5 rounded border-gray-300 text-[#673ab7] focus:ring-[#673ab7]" 
                                            />
                                        </th>
                                        <th className="py-2 px-3 text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">Page Title</th>
                                        <th className="py-2 px-3 text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">URL Slug</th>
                                        <th className="py-2 px-3 text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">Status</th>
                                        <th className="py-2 px-3 text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">Last Updated</th>
                                        <th className="py-2 px-3 text-[11px] font-bold text-[#6b7280] uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#e5e7eb]">
                                    {filteredPages.length > 0 ? (
                                        filteredPages.map((page) => (
                                            <tr key={page.id} className="hover:bg-[#f9fafb] transition-colors group">
                                                <td className="py-2 px-3 text-center">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={selectedPages.includes(page.id)}
                                                        onChange={() => toggleSelection(page.id)}
                                                        className="w-3.5 h-3.5 rounded border-gray-300 text-[#673ab7] focus:ring-[#673ab7]" 
                                                    />
                                                </td>
                                                <td className="py-2 px-3">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-8 h-8 border border-[#e5e7eb] rounded bg-white flex items-center justify-center p-1 flex-shrink-0 text-[#6b7280]">
                                                            <FileText size={14} />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[12px] font-bold text-[#111827]">{page.title}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-2 px-3">
                                                    <span className="text-[12px] text-[#6b7280] font-mono bg-gray-50 px-2 py-1 rounded border border-gray-100">/{page.slug}</span>
                                                </td>
                                                <td className="py-2 px-3">
                                                    <div className={`inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded-[4px] text-[10px] font-bold tracking-wide ${
                                                        page.is_published ? 'bg-[#ecfdf5] text-[#059669]' : 'bg-[#fef2f2] text-[#dc2626]'
                                                    }`}>
                                                        <span className="text-[6px]">●</span>
                                                        {page.is_published ? 'PUBLISHED' : 'DRAFT'}
                                                    </div>
                                                </td>
                                                <td className="py-2 px-3">
                                                    <span className="text-[12px] text-[#6b7280]">
                                                        {new Date(page.updated_at).toLocaleDateString()}
                                                    </span>
                                                </td>
                                                <td className="py-2 px-3 text-right">
                                                    <div className="flex items-center justify-end">
                                                        <div className="flex bg-white shadow-sm border border-[#e5e7eb] rounded-[4px] overflow-hidden">
                                                            <Link 
                                                                href={route('admin.pages.show', page.id)}
                                                                title="View Details"
                                                                className="w-7 h-7 flex items-center justify-center bg-[#f0fdfa] hover:bg-[#ccfbf1] text-[#0d9488] border-r border-[#e5e7eb] transition-colors"
                                                            >
                                                                <Eye size={12} />
                                                            </Link>
                                                            <Link 
                                                                href={route('admin.pages.edit', page.id)}
                                                                title="Edit Page"
                                                                className="w-7 h-7 flex items-center justify-center bg-[#ebf5ff] hover:bg-[#dbeafe] text-[#2563eb] border-r border-[#e5e7eb] transition-colors"
                                                            >
                                                                <Edit size={12} />
                                                            </Link>
                                                            <button 
                                                                onClick={() => deletePage(page.id)}
                                                                title="Delete Page"
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
                                            <td colSpan="6" className="py-12 text-center">
                                                <FileText size={32} className="mx-auto text-[#d1d5db] mb-3" />
                                                <h3 className="text-[14px] font-semibold text-[#374151] mb-1">No pages found</h3>
                                                <p className="text-[12px] text-[#6b7280]">Adjust your search or create a new page.</p>
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
                                    1 - {filteredPages.length} of {pages.length}
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
