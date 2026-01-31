import React, { useState, useRef, useEffect } from "react";
import { router, usePage, Link } from "@inertiajs/react";
import { 
    Search, Bell, Menu, Settings, Maximize, 
    Mail, Globe, Monitor, Plus, LogOut, 
    ChevronDown, CreditCard, Home 
} from "lucide-react";

const Header = ({ onMenuClick }) => {
    const { auth } = usePage().props;
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        router.post(route("logout"));
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="h-[70px] bg-white/80 backdrop-blur-md sticky top-0 z-[50] flex items-center px-4 md:px-8 border-b border-slate-100 shadow-sm transition-all duration-300">
            
            {/* LEFT: Toggle & Mobile Logo */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
                >
                    <Menu size={20} />
                </button>
            </div>

            {/* CENTER: Search Bar */}
            <div className="flex-1 px-4 max-w-xl hidden md:block">
                <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0a66c2] transition-colors">
                        <Search size={18} strokeWidth={2} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search services, domains, settings..."
                        className="w-full bg-slate-50 border-none rounded-xl py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-[#0a66c2]/10 focus:bg-white transition-all placeholder:text-slate-400"
                    />
                </div>
            </div>

            {/* RIGHT: Actions & Profile */}
            <div className="flex items-center gap-2 md:gap-4 ml-auto">
                
                {/* Utility Icons */}
                <div className="flex items-center gap-1 border-r border-slate-100 pr-2 mr-2">
                    <Link 
                        href="/" 
                        className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-[#0a66c2] rounded-xl transition-all" 
                        title="Frontend"
                    >
                        <Home size={20} strokeWidth={1.5} />
                    </Link>
                    <button className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-50 rounded-xl relative" title="Notifications">
                        <Bell size={20} strokeWidth={1.5} />
                        <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                    </button>
                </div>

                {/* User Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button 
                        onClick={() => setOpen(!open)}
                        className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                    >
                        <img
                            src={auth?.user?.profile_photo_url || `https://ui-avatars.com/api/?name=${auth?.user?.name || 'Admin'}&background=673ab7&color=fff`}
                            alt="User"
                            className="w-9 h-9 rounded-lg object-cover shadow-sm"
                        />
                        <div className="hidden lg:block text-left leading-tight">
                            <p className="text-sm font-bold text-slate-700 block truncate">{auth?.user?.name || "Rashedul"}</p>
                            <p className="text-[11px] text-slate-400 font-medium">Administrator</p>
                        </div>
                        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {open && (
                        <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
                                <img
                                    src={auth?.user?.profile_photo_url || `https://ui-avatars.com/api/?name=${auth?.user?.name || 'Admin'}&background=673ab7&color=fff`}
                                    className="w-10 h-10 rounded-lg"
                                    alt="Avatar"
                                />
                                <div className="overflow-hidden">
                                    <p className="text-sm font-bold text-slate-900 truncate">{auth?.user?.name || "Admin"}</p>
                                    <Link href={route("profile.edit")} className="text-[11px] text-[#0a66c2] font-semibold hover:underline">Manage Account</Link>
                                </div>
                            </div>

                            <div className="p-2">
                                <DropdownLink icon={Settings} label="System Settings" href={route('admin.settings.website.system')} />
                                <DropdownLink icon={CreditCard} label="Billing Details" href="#" />
                                <DropdownLink icon={Globe} label="Region & Language" href={route('admin.settings.website.localization')} />
                            </div>

                            <div className="p-2 border-t border-slate-50 bg-slate-50/30">
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-3 py-2.5 text-[13px] text-red-500 hover:bg-red-50 font-bold flex items-center gap-3 rounded-xl transition-colors"
                                >
                                    <LogOut size={16} />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

const DropdownLink = ({ icon: Icon, label, href }) => (
    <Link 
        href={href}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all font-semibold group"
    >
        <Icon size={17} className="text-slate-400 group-hover:text-[#0a66c2] transition-colors" />
        <span>{label}</span>
    </Link>
);

export default Header;
