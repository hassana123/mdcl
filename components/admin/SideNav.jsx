"use client"
import React from 'react'
import Image from "next/image";
import Link from "next/link";
import { LayoutDashboard, FolderOpen, FileText, ImageIcon, BookOpen, LogOut } from "lucide-react";
import { useAuth } from '@/app/(admin)/admin/AuthProvider';
import { usePathname } from 'next/navigation';

const SideNav = () => {
    const { logout } = useAuth();
    const pathname = usePathname();
    
    const sidebarLinks = [
        { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/projects", label: "Projects & Programmes", icon: FolderOpen },
        { href: "/admin/blog", label: "Blog", icon: FileText },
        { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
        { href: "/admin/resources", label: "Resources", icon: BookOpen },
    ];

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <nav className="w-64 bg-[#91BE74] text-white flex flex-col">
            <div className="p-6 border-b border-white/20">
                {/* Logo */}
                <div className="flex flex-col items-center space-y-2">
                    <Image
                        src="/mdcl/logo.jpg"
                        alt="MDCL Logo"
                        width={80}
                        height={80}
                        className="rounded"
                    />
                </div>

                {/* Navigation */}
                <nav className="mt-10 flex flex-col text-black font-bold space-y-6">
                    {sidebarLinks.map(({ href, label, icon: Icon }) => (
                        <SidebarLink 
                            key={href} 
                            href={href} 
                            label={label} 
                            Icon={Icon} 
                            isActive={pathname === href}
                        />
                    ))}
                </nav>
            </div>

            {/* Logout */}
            <div className="mt-auto p-6">
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 rounded bg-[#43612F] hover:bg-[#365026] text-white transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </nav>
    )
}

export default SideNav

function SidebarLink({ href, label, Icon, isActive }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-2 rounded transition-colors ${
                isActive 
                    ? "bg-[#5f8351] text-white" 
                    : "hover:bg-[#7fa96b] text-black"
            }`}
        >
            <Icon className="w-5 h-5" />
            <span className="text-sm font-bold">{label}</span>
        </Link>
    );
}
