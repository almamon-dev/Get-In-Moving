import React, { useState, useRef, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import { 
    Home, Globe, LayoutGrid, Waves, Mail, 
    Cloud, CreditCard, Store, ChevronRight, ChevronsLeft,
    Settings, ShieldCheck, DollarSign, Cog, Users, FolderTree,
    Smartphone, Monitor, CircleDollarSign, Hexagon, LogOut, User,
    Truck, UserCircle
} from "lucide-react";

const Sidebar = ({ isCollapsed, toggleCollapse }) => {
    const { url, props } = usePage();
    const { sidebarCategories = [], auth } = props;
    const currentPath = url.split("?")[0];

    const [openMenus, setOpenMenus] = useState(() => {
        // Initialize open menus based on current path
     
        if (currentPath.startsWith('/admin/billing')) {
            return { billing: true };
        }
        return {};
    });

    const menuGroups = [
        {
            items: [
                { 
                    label: "Customers", 
                    path: route('admin.customers.index'), 
                    icon: <UserCircle />, 
                    route: "admin.customers.index" 
                },
                { 
                    label: "Suppliers", 
                    path: route('admin.suppliers.index'), 
                    icon: <Truck />, 
                    route: "admin.suppliers.index" 
                },
                { 
                    label: "Raised Issues", 
                    path: route('admin.issues.index'), 
                    icon: <AlertCircle />, 
                    route: "admin.issues.index" 
                },
                { 
                    label: "Pricing Plans", 
                    path: route('admin.pricing-plans.index'), 
                    icon: <CircleDollarSign />, 
                    route: "admin.pricing-plans.index" 
                },
                { 
                    label: "Withdrawals", 
                    path: route('admin.withdrawals.index'), 
                    icon: <DollarSign />, 
                    route: "admin.withdrawals.index" 
                },
                { 
                    label: "Transactions", 
                    path: route('admin.transactions.index'), 
                    icon: <CircleDollarSign />, 
                    route: "admin.transactions.index" 
                },
            ]
        },
       
        {
            title: "Settings",
            items: [
                { 
                    label: "General Settings", 
                    icon: <Settings />, 
                    key: "general",
                    children: [
                        { label: "Profile", path: route('admin.settings.general.profile') },
                        { label: "Security", path: route('admin.settings.general.security') },
                       
                    ]
                },
                { 
                    label: "Website Settings", 
                    icon: <Globe />, 
                    key: "website",
                    children: [
                        { label: "System Settings", path: route('admin.settings.website.system') },
                        { label: "Company Settings", path: route('admin.settings.website.company') },
                       
                    ]
                },
                { 
                    label: "System Settings", 
                    icon: <Monitor />, 
                    key: "system",
                    children: [
                        { label: "Email", path: route('admin.settings.system.email') },
                      
                      
                    ]
                },
                { 
                    label: "Financial Settings", 
                    icon: <CircleDollarSign />, 
                    key: "financial",
                    children: [
                        { label: "Payment Gateway", path: route('admin.settings.financial.gateway') },
                      
                    ]
                },
               
                { label: "Logout", path: "/logout", icon: <LogOut />, method: "post" },
            ]
        }
    ];

    const legacyMenuItems = [
        { label: "Home", path: "/dashboard", icon: <Home />, route: "dashboard" },
    ];



    const checkActive = (item) => {
        if (typeof route !== 'undefined' && item.route) {
            if (route().current(item.route)) return true;
        }
        return currentPath === item.path;
    };

    const renderMenuItem = (item) => {
        const active = checkActive(item);
        const isOpen = openMenus[item.key];
        const isLogout = item.label === "Logout";
        
        const content = (
            <>
                {/* Icon */}
                <div className={`${isCollapsed ? 'mb-1' : 'mr-3'} transition-transform duration-200 group-hover:scale-110 ${active || isOpen ? 'text-[#0a66c2]' : 'text-slate-400 group-hover:text-[#0a66c2]'}`}>
                    {React.cloneElement(item.icon, { 
                        size: isCollapsed ? 24 : 18, 
                        strokeWidth: active || isOpen ? 2 : 1.5 
                    })}
                </div>

                {/* Label */}
                {!isCollapsed && (
                    <span className={`font-medium leading-tight transition-all duration-300 text-[14px] flex-1 text-left
                        ${active || isOpen ? 'text-[#0a66c2]' : 'text-slate-600'}`}>
                        {item.label}
                    </span>
                )}

                {/* Chevron for expandable or just as a visual guide */}
                {!isCollapsed && !isLogout && (
                    <ChevronRight 
                        size={14} 
                        className={`transition-all duration-200 text-slate-300 group-hover:text-slate-500 ${isOpen ? 'rotate-90' : ''} ${item.children ? '' : 'opacity-60'}`}
                    />
                )}

                {/* Tooltip for Collapsed State */}
                {isCollapsed && (
                    <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                        {item.label}
                    </div>
                )}
            </>
        );

        if (item.children) {
            return (
                <div key={item.label}>
                    <button
                        onClick={() => setOpenMenus(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                        className={`w-full flex transition-all duration-200 group relative rounded-lg
                            ${isCollapsed 
                                ? 'flex-col items-center justify-center py-4 px-1' 
                                : 'flex-row items-center py-2.5 px-4'}
                            ${active || isOpen
                                ? 'bg-[#0a66c2]/5 text-[#0a66c2]' 
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                    >
                        {content}
                    </button>

                    {/* Sub-menu items */}
                    {!isCollapsed && isOpen && (
                        <div className="ml-4 mt-1">
                            {item.children.map(child => (
                                <Link
                                    key={child.label}
                                    href={child.path}
                                    className={`flex items-center gap-3 py-2 px-3 rounded-lg text-[13px] transition-all hover:bg-slate-50
                                        ${(currentPath === child.path || (child.route && typeof route !== 'undefined' && route().current(child.route))) ? 'text-[#0a66c2] bg-[#0a66c2]/5 font-semibold' : 'text-slate-500'}`}
                                >
                                    {child.icon ? (
                                        React.cloneElement(child.icon, { size: 14 })
                                    ) : (
                                        <div className={`w-1 h-1 rounded-full ${currentPath === child.path ? 'bg-[#0a66c2]' : 'bg-slate-300'}`} />
                                    )}
                                    <span>{child.label}</span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        if (item.method === "post") {
            return (
                <Link
                    key={item.label}
                    href={item.path}
                    method="post"
                    as="button"
                    className={`w-full flex transition-all duration-200 group relative rounded-lg
                        ${isCollapsed 
                            ? 'flex-col items-center justify-center py-4 px-1' 
                            : 'flex-row items-center py-2.5 px-4'}
                        ${active 
                            ? 'bg-[#0a66c2]/5 text-[#0a66c2]' 
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                    {content}
                </Link>
            );
        }

        return (
            <Link
                key={item.label}
                href={item.path}
                className={`w-full flex transition-all duration-200 group relative rounded-lg
                    ${isCollapsed 
                        ? 'flex-col items-center justify-center py-4 px-1' 
                        : 'flex-row items-center py-2.5 px-4'}
                    ${active 
                        ? 'bg-[#0a66c2]/5 text-[#0a66c2]' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
            >
                {content}
            </Link>
        );
    };

    return (
        <div className="flex flex-col h-full bg-white relative">
            {/* Collapse Toggle Button */}
            <button 
                onClick={toggleCollapse}
                className="absolute -right-3.5 top-5 z-50 w-7 h-7 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-[#0a66c2] shadow-sm transition-transform duration-300"
                style={{ transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
                <ChevronsLeft size={14} strokeWidth={3} />
            </button>

            {/* Logo Section */}
            <div className={`h-[70px] flex items-center px-6 transition-all duration-300 ${isCollapsed ? 'justify-center px-0' : 'justify-start'}`}>
                <div className="min-w-[35px] w-[35px] h-[35px] bg-[#0a66c2] rounded-lg flex items-center justify-center text-white shadow-sm">
                    <Cloud size={20} fill="currentColor" />
                </div>
                {!isCollapsed && (
                    <span className="ml-3 font-bold text-slate-800 text-lg tracking-tight animate-in fade-in duration-500">
                        Admin<span className="text-slate-400 font-normal">Panel</span>
                    </span>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 flex flex-col pt-4 overflow-y-auto no-scrollbar px-2">
                {/* Legacy Items */}
                <div className="space-y-1 mb-6">
                    {legacyMenuItems.map((item) => renderMenuItem(item))}
                </div>

                {/* Sectioned Navigation */}
                {menuGroups.map((group) => (
                    <div key={group.title} className="mb-6">
                        {!isCollapsed && (
                            <div className="px-4 py-2 border-t border-slate-100 mt-2 mb-1">
                                <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    {group.title}
                                </h3>
                            </div>
                        )}
                        <div className="space-y-1">
                            {group.items.map((item) => renderMenuItem(item))}
                        </div>
                    </div>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;
