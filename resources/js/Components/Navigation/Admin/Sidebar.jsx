import React, { useState, useRef, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    Home, Globe, LayoutGrid, Waves, Mail,
    Cloud, CreditCard, Store, ChevronRight, ChevronsLeft,
    Settings, ShieldCheck, DollarSign, Cog, Users, FolderTree,
    Smartphone, Monitor, CircleDollarSign, Hexagon, LogOut, User,
    Truck, UserCircle, AlertCircle, FileText
} from "lucide-react";

const Sidebar = ({ isCollapsed, toggleCollapse }) => {
    const { url, props } = usePage();
    const { auth } = props;
    const currentPath = url.split("?")[0];

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
                    label: "Pay Later Management",
                    icon: <CreditCard />,
                    key: "pay_later",
                    children: [
                        { label: "Dashboard", path: route('admin.credit.dashboard'), route: "admin.credit.dashboard" },
                        { label: "Pay Later Approvals", path: route('admin.pay-later-approvals.index'), route: "admin.pay-later-approvals.index" },
                        { label: "Limit Requests", path: route('admin.credit.requests.index'), route: "admin.credit.requests.index" },
                    ]
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
                    label: "Page Management",
                    path: route('admin.pages.index'),
                    icon: <FileText />,
                    route: "admin.pages.index"
                },
                {
                    label: "Subscriptions",
                    path: route('admin.subscriptions.index'),
                    icon: <CreditCard />,
                    route: "admin.subscriptions.index"
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
                        { label: "Profile", path: route('admin.settings.general.profile'), route: 'admin.settings.general.profile' },
                        { label: "Security", path: route('admin.settings.general.security'), route: 'admin.settings.general.security' },
                    ]
                },
                {
                    label: "Website Settings",
                    icon: <Globe />,
                    key: "website",
                    children: [
                        { label: "System Settings", path: route('admin.settings.website.system'), route: 'admin.settings.website.system' },
                        { label: "Company Settings", path: route('admin.settings.website.company'), route: 'admin.settings.website.company' },
                    ]
                },
                {
                    label: "System Settings",
                    icon: <Monitor />,
                    key: "system",
                    children: [
                        { label: "Email", path: route('admin.settings.system.email'), route: 'admin.settings.system.email' },
                    ]
                },
                {
                    label: "Financial Settings",
                    icon: <CircleDollarSign />,
                    key: "financial",
                    children: [
                        { label: "Payment Gateway", path: route('admin.settings.financial.gateway'), route: 'admin.settings.financial.gateway' },
                    ]
                },

                { label: "Logout", path: "/logout", icon: <LogOut />, method: "post" },
            ]
        }
    ];

    const legacyMenuItems = [
        { label: "Home", path: "/dashboard", icon: <Home />, route: "dashboard" },
    ];

    const isChildActive = (child) => {
        if (typeof route !== 'undefined' && child.route) {
            const wildcardRoute = child.route.endsWith('.index') ? child.route.replace('.index', '.*') : `${child.route}.*`;
            if (route().current(child.route) || route().current(wildcardRoute)) {
                return true;
            }
        }
        if (child.path) {
            return currentPath === child.path || (child.path !== '/' && currentPath.startsWith(child.path));
        }
        return false;
    };

    const checkActive = (item) => {
        if (item.children) {
            return item.children.some(child => isChildActive(child));
        }
        if (typeof route !== 'undefined' && item.route) {
            const wildcardRoute = item.route.endsWith('.index') ? item.route.replace('.index', '.*') : `${item.route}.*`;
            if (route().current(item.route) || route().current(wildcardRoute)) {
                return true;
            }
        }
        if (item.path) {
            return currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
        }
        return false;
    };

    const getInitialOpenMenus = () => {
        const initial = {};
        menuGroups.forEach(group => {
            group.items.forEach(item => {
                if (item.children && item.key) {
                    if (item.children.some(child => isChildActive(child))) {
                        initial[item.key] = true;
                    }
                }
            });
        });
        return initial;
    };

    const [openMenus, setOpenMenus] = useState(() => getInitialOpenMenus());

    useEffect(() => {
        const autoOpen = getInitialOpenMenus();
        if (Object.keys(autoOpen).length > 0) {
            setOpenMenus(prev => ({ ...prev, ...autoOpen }));
        }
    }, [currentPath, url]);

    const renderMenuItem = (item) => {
        const active = checkActive(item);
        const isOpen = openMenus[item.key];
        const isLogout = item.label === "Logout";

        const content = (
            <>
                {/* Icon */}
                <div className={`flex-shrink-0 ${isCollapsed ? 'mb-1' : 'mr-3'} transition-transform duration-200 group-hover:scale-110 ${active || isOpen ? 'text-[#673ab7]' : 'text-slate-400 group-hover:text-[#673ab7]'}`}>
                    {React.cloneElement(item.icon, {
                        size: isCollapsed ? 24 : 18,
                        strokeWidth: active || isOpen ? 2 : 1.5
                    })}
                </div>

                {/* Label */}
                {!isCollapsed && (
                    <span className={`font-semibold leading-tight transition-all duration-300 text-[14px] flex-1 text-left whitespace-nowrap truncate
                        ${active || isOpen ? 'text-[#673ab7]' : 'text-slate-600'}`}>
                        {item.label}
                    </span>
                )}

                {/* Chevron */}
                {!isCollapsed && !isLogout && (
                    <ChevronRight
                        size={14}
                        className={`flex-shrink-0 transition-all duration-200 text-slate-300 group-hover:text-slate-500 ${isOpen ? 'rotate-90' : ''} ${item.children ? '' : 'opacity-60'}`}
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
                                ? 'bg-[#f8f6ff] text-[#673ab7] font-semibold'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                    >
                        {content}
                    </button>

                    {/* Sub-menu items */}
                    {!isCollapsed && isOpen && (
                        <div className="ml-4 mt-1 space-y-0.5 pl-2">
                            {item.children.map(child => {
                                const childActive = isChildActive(child);
                                return (
                                    <Link
                                        key={child.label}
                                        href={child.path}
                                        className={`flex items-center gap-3 py-2 px-3 rounded-lg text-[13px] transition-all hover:bg-[#f8f6ff]
                                            ${childActive ? 'text-[#673ab7] bg-[#f8f6ff] font-bold' : 'text-slate-600 font-medium hover:text-[#673ab7]'}`}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full ${childActive ? 'bg-[#673ab7]' : 'bg-slate-300'}`} />
                                        <span>{child.label}</span>
                                    </Link>
                                );
                            })}
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
                            ? 'bg-[#f8f6ff] text-[#673ab7]'
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
                        ? 'bg-[#f8f6ff] text-[#673ab7] font-semibold'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
            >
                {content}
            </Link>
        );
    };

    return (
        <div className="flex flex-col h-full bg-white relative border-r border-[#e3e4e8]">
            {/* Collapse Toggle Button */}
            <button
                onClick={toggleCollapse}
                className="absolute -right-3.5 top-5 z-50 w-7 h-7 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-[#673ab7] shadow-sm transition-transform duration-300"
                style={{ transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
                <ChevronsLeft size={14} strokeWidth={3} />
            </button>

            {/* Logo Section */}
            <div className={`h-[70px] flex items-center px-6 transition-all duration-300 ${isCollapsed ? 'justify-center px-0' : 'justify-start'}`}>
                <div className="min-w-[35px] w-[35px] h-[35px] bg-[#673ab7] rounded-lg flex items-center justify-center text-white shadow-sm">
                    <Cloud size={20} fill="currentColor" />
                </div>
                {!isCollapsed && (
                    <span className="ml-3 font-bold text-slate-800 text-lg tracking-tight animate-in fade-in duration-500">
                        Admin<span className="text-[#673ab7] font-bold">Panel</span>
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
                    <div key={group.title || 'main'} className="mb-6">
                        {!isCollapsed && group.title && (
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
