"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    User, 
    Shield, 
    Bell, 
    PenTool, 
    FileText, 
    MessageSquare, 
    AlertCircle, 
    Palette, 
    Zap, 
    History, 
    Scale 
} from "lucide-react";

const navigation = [
    { name: "Account", href: "/settings/account", icon: User },
    { name: "Privacy", href: "/settings/privacy", icon: Shield },
    { name: "Notifications", href: "/settings/notifications", icon: Bell },
    { name: "Writing", href: "/settings/writing", icon: PenTool },
    { name: "Content", href: "/settings/content", icon: FileText },
    { name: "Interactions", href: "/settings/interactions", icon: MessageSquare },
    { name: "Moderation", href: "/settings/moderation", icon: AlertCircle },
    { name: "Appearance", href: "/settings/appearance", icon: Palette },
    { name: "Creator", href: "/settings/creator", icon: Zap },
    { name: "Activity", href: "/settings/activity", icon: History },
    { name: "Legal", href: "/settings/legal", icon: Scale },
];

export default function SettingsSidebar() {
    const pathname = usePathname();

    return (
        <nav className="flex flex-col gap-1 w-full sm:w-64 shrink-0">
            {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`
                            flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                            ${isActive 
                                ? "bg-black text-white shadow-md scale-[1.02]" 
                                : "text-gray-600 hover:bg-gray-100 hover:text-black"}
                        `}
                    >
                        <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                        <span className="text-sm font-medium">{item.name}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
