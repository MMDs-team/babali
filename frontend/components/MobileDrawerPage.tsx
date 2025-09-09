"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const routes: Record<string, string> = {
    '/iranin': 'پرواز',
    '/bus-ticket': 'اتوبوس',
    '/train-ticket': 'قطار',
    '/iranout': 'پرواز خارج',
    '/hotel': 'هتل',
    '/tour': 'تور',
    '/accommodation': 'ویلا',
}

export default function MobileDrawerPage({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    const [mounted, setMounted] = useState(false); // always mount first
    const [open, setOpen] = useState(false);       // controls animation
    const [prevPath, setPrevPath] = useState(pathname);

    useEffect(() => {
        setMounted(true);
        // Trigger animation only after mount
        setTimeout(() => {
            if (pathname !== "/") setOpen(true);
        }, 50);
    }, []);

    // Detect route change
    useEffect(() => {
        if (prevPath !== pathname) {
            setOpen(false); // trigger closing animation
            setTimeout(() => {
                if (pathname !== "/") setOpen(true); // trigger opening animation for new route
            }, 300); // wait for closing animation
            setPrevPath(pathname);
        }
    }, [pathname, prevPath]);

    const handler = () => {
        setOpen(false);
        setTimeout(() => {
            if (pathname !== "/") router.push('/');
        }, 300);
    };

    if (!mounted) return null;

    return (
        <div className="lg:hidden p-4">
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity duration-300
                ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                onClick={handler}
            />

            {/* Drawer */}
            <div
                className={`fixed inset-y-0 left-0 w-full bg-white shadow-lg z-50 transform transition-transform duration-300 lg:hidden
                ${open ? "translate-x-0" : "-translate-x-full"}`}
            >
                {/* Drawer header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">{routes[pathname]}</h2>
                    <button onClick={handler}>
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Drawer content */}
                <nav className="p-4 w-full">{children}</nav>
            </div>
        </div>
    );
}
