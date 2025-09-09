"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";

const routes: Record<string, string> = {
    'airplain-in': 'پرواز',
    'bus': 'اتوبوس',
    'train': 'قطار',
};

export default function MobileDrawerPageWithData({ open, setOpen, children }: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const firstSegment = pathname.split("/")[1];

    // Optional: hide on routes not in the routes object
    if (!routes[firstSegment]) return null;

    const [currentTitle, setCurrentTitle] = useState(routes[firstSegment] || "Menu");

    useEffect(() => {
        setCurrentTitle(routes[firstSegment] || "Menu");
    }, [firstSegment]);

    const handler = () => {
        setOpen(false);
    };

    return (
        <div className="lg:hidden">
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
                    <h2 className="text-lg font-semibold">{currentTitle}</h2>
                    <button onClick={handler}>
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Drawer content */}
                <nav className="p-4 w-full max-h-[calc(100vh-4rem)] overflow-y-auto">
                    {children}
                </nav>
            </div>
        </div>
    );
}
