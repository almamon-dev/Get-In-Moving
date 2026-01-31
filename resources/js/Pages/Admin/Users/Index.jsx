import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Home, Search, Plus, MoreVertical, Check, Trash2, User as UserIcon, Mail, Shield } from 'lucide-react';

export default function Index({ users, filters, auth }) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedIds, setSelectedIds] = useState([]);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.users.index'), { search, per_page: filters.per_page }, { preserveState: true });
    };

    const toggleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === users.data.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(users.data.map(user => user.id));
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(route('admin.users.destroy', id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Users Management" />

            <div className="space-y-6 max-w-[1240px] mx-auto">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-[24px] font-bold text-[#2f3344] tracking-tight">Users</h1>
                        <div className="flex items-center gap-2 text-[13px] text-[#727586] mt-1">
                            <Home size={16} className="text-[#727586]" />
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Account</span>
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Users</span>
                        </div>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                    <div className="px-6 border-b border-[#e3e4e8]">
                        <div className="flex gap-10">
                            <button className="pt-5 pb-4 text-[14px] font-bold transition-all relative text-[#673ab7]">
                                All users
                                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#673ab7] rounded-t-full"></div>
                            </button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="p-6 border-b border-[#f1f2f4]">
                        <form onSubmit={handleSearch} className="relative max-w-[400px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#727586]" size={18} />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full h-[45px] pl-11 pr-4 bg-[#f8f9fa] border-none rounded-[8px] text-[14px] text-[#2f3344] focus:ring-2 focus:ring-[#673ab7]/20 transition-all outline-none"
                            />
                        </form>
                    </div>

                    {/* Table Area */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-[#fafbfc] border-b border-[#f1f2f4]">
                                    <th className="pl-7 pr-4 py-4 w-[50px]">
                                        <div 
                                            onClick={toggleSelectAll}
                                            className={`w-5 h-5 border-[2px] rounded cursor-pointer transition-all flex items-center justify-center ${selectedIds.length === users.data.length && users.data.length > 0 ? 'bg-[#673ab7] border-[#673ab7]' : 'border-[#e3e4e8] hover:border-[#673ab7]'}`}
                                        >
                                            {users.data.length > 0 && selectedIds.length === users.data.length && <Check size={14} className="text-white" />}
                                        </div>
                                    </th>
                                    <th className="text-left px-5 py-4 text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">
                                        User Info
                                    </th>
                                    <th className="text-left px-5 py-4 text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">
                                        Roles
                                    </th>
                                    <th className="text-left px-5 py-4 text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">
                                        Created At
                                    </th>
                                    <th className="px-7 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f1f2f4]">
                                {users.data.length > 0 ? (
                                    users.data.map((user) => (
                                        <tr 
                                            key={user.id} 
                                            className={`hover:bg-[#fafbfc] transition-colors group ${selectedIds.includes(user.id) ? 'bg-[#f4f0ff]/50' : ''}`}
                                        >
                                            <td className="pl-7 pr-4 py-5">
                                                <div 
                                                    onClick={() => toggleSelect(user.id)}
                                                    className={`w-5 h-5 border-[2px] rounded cursor-pointer transition-all flex items-center justify-center ${selectedIds.includes(user.id) ? 'bg-[#673ab7] border-[#673ab7]' : 'border-[#e3e4e8] hover:border-[#673ab7]'}`}
                                                >
                                                    {selectedIds.includes(user.id) && <Check size={14} className="text-white" />}
                                                </div>
                                            </td>
                                            <td className="px-5 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-[#f4f0ff] flex items-center justify-center text-[#673ab7] font-bold">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="text-[14px] font-bold text-[#2f3344]">
                                                            {user.name}
                                                        </div>
                                                        <div className="text-[12px] text-[#727586] flex items-center gap-1">
                                                            <Mail size={12} /> {user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-5">
                                                <div className="flex flex-wrap gap-1">
                                                    {user.roles.length > 0 ? user.roles.map(role => (
                                                        <span key={role.id} className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-[#f4f0ff] text-[#673ab7] border border-[#dcd0ff]">
                                                            {role.name}
                                                        </span>
                                                    )) : (
                                                        <span className="text-[12px] text-[#c3c4ca]">No roles</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-5 py-5">
                                                <span className="text-[13px] text-[#727586] font-normal">
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </span>
                                            </td>
                                            <td className="pr-7 py-5 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <Link
                                                        href={route('admin.users.edit', user.id)}
                                                        className="h-[36px] inline-flex items-center bg-white border border-[#e3e4e8] text-[#2f3344] px-4 rounded-[6px] font-bold text-[13px] hover:border-[#673ab7] hover:text-[#673ab7] transition-all"
                                                    >
                                                        Manage
                                                    </Link>
                                                    <button 
                                                        onClick={() => handleDelete(user.id)}
                                                        className="w-8 h-8 flex items-center justify-center text-[#727586] hover:bg-red-50 hover:text-red-500 rounded-lg transition-all"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-5 py-10 text-center text-[#727586]">
                                            No users found.
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
