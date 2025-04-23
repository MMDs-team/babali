'use client'
import { useEffect, useState } from "react";
import { DatePicker } from "@/components/DatePicker";
import SourceTargetCity from "@/components/SourceTargetCity";
import { Button } from "@/components/ui/button";

const InputNav = () => {


    const [scrollY, setScrollY] = useState(0);
    const [isScrollingUp, setIsScrollingUp] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            setScrollY(currentY);
            setIsScrollingUp(currentY < lastScrollY);
            setLastScrollY(currentY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const baseStyle =
        'w-full z-50 transition-all duration-300 ease-in-out';
    let positionStyle = '';
    let isCollapsed = false;

    if (scrollY < 100) {
        // Initial
        positionStyle = 'sticky top-15';
        isCollapsed = false;
    } else if (isScrollingUp) {
        // Scrolling up: stick to top
        positionStyle = 'sticky top-15';
        isCollapsed = true;
    } else {
        // Scrolling down: stick a bit lower
        positionStyle = 'sticky top-0';
        isCollapsed = true;
    }
    return (
        <div className={`${baseStyle} ${positionStyle} bg-white shadow-md`}>
            <div className={`${isCollapsed?'hidden':'flex'} gap-2 border-1 border-t-0 px-12 md:px-18 lg:px-26 xl:px-42  py-8`}>
                <SourceTargetCity className='flex-5' />
                <DatePicker className='flex-3' />
                <Button className="flex-1 h-auto bg-amber-400 text-black hover:bg-amber-500">
                    جستجو
                </Button>
            </div>
            <div className={`${isCollapsed?'flex':'hidden'} w-full cursor-pointer items-center justify-center py-3 w-bold text-gray-700 whitespace-nowrap`}>
                <svg viewBox="0 0 24 24" width="1.5rem" height="1.5rem" fill="currentColor" className="shrink-0 text-grays-500 ml-2">
                    <path d="M14.81 3a3.284 3.284 0 0 1 3.281 3.28h.657c.723 0 1.312.59 1.312 1.313v1.969a.656.656 0 1 1-1.312 0V7.593h-.657v9.186a1.97 1.97 0 0 1-1.968 1.969v1.312c0 .724-.589 1.312-1.312 1.312h-.656a1.314 1.314 0 0 1-1.313-1.312v-1.312h-2.624v1.312c0 .724-.589 1.312-1.313 1.312H8.25a1.314 1.314 0 0 1-1.312-1.312v-1.312a1.97 1.97 0 0 1-1.969-1.969V7.593h-.656v1.969a.656.656 0 1 1-1.312 0V7.593c0-.724.589-1.312 1.312-1.312h.656A3.284 3.284 0 0 1 8.25 3h6.562Zm1.97 10.829a14.615 14.615 0 0 1-5.25.98c-1.779 0-3.557-.33-5.25-.98v2.95a.656.656 0 0 0 .657.656h9.186a.656.656 0 0 0 .656-.656v-2.95Zm-1.313.982a.656.656 0 0 1 .656.656v.656a.656.656 0 0 1-1.312 0v-.656a.656.656 0 0 1 .656-.656Zm-7.874 0a.656.656 0 0 1 .656.656v.656a.656.656 0 1 1-1.312 0v-.656a.656.656 0 0 1 .656-.656Zm6.562-9.186h-5.25a.656.656 0 0 0 0 1.312h5.25a.656.656 0 0 0 0-1.312Z">
                    </path>
                </svg>
                <h1 className="ml-4 text-4 font-medium my-0"> بلیط اتوبوس تهران به اصفهان</h1>
                <svg viewBox="0 0 24 24" width="1.5rem" height="1.5rem" fill="currentColor" className="text-grays-500 mx-2">
                    <path d="M15.75 3a.75.75 0 0 1 .75.75v.75h2.25c1.196 0 2.178.939 2.246 2.118L21 6.75v12a2.253 2.253 0 0 1-2.118 2.246L18.75 21H5.25a2.253 2.253 0 0 1-2.246-2.118L3 18.75v-12c0-1.196.939-2.178 2.118-2.246L5.25 4.5H7.5v-.75a.75.75 0 1 1 1.5 0v.75h6v-.75a.75.75 0 0 1 .75-.75Zm-3 12a.75.75 0 0 0-.745.662L12 15.75v.75a.75.75 0 0 0 1.495.088l.005-.088v-.75a.75.75 0 0 0-.75-.75Zm-3 0a.75.75 0 0 0-.745.662L9 15.75v.75a.75.75 0 0 0 1.495.088l.005-.088v-.75a.75.75 0 0 0-.75-.75Zm-3 0a.75.75 0 0 0-.745.662L6 15.75v.75a.75.75 0 0 0 1.495.088L7.5 16.5v-.75a.75.75 0 0 0-.75-.75Zm9-3.75a.75.75 0 0 0-.745.662L15 12v.75a.75.75 0 0 0 1.495.088l.005-.088V12a.75.75 0 0 0-.75-.75Zm-3 0a.75.75 0 0 0-.745.662L12 12v.75a.75.75 0 0 0 1.495.088l.005-.088V12a.75.75 0 0 0-.75-.75Zm-3 0a.75.75 0 0 0-.745.662L9 12v.75a.75.75 0 0 0 1.495.088l.005-.088V12a.75.75 0 0 0-.75-.75Zm-3 0a.75.75 0 0 0-.745.662L6 12v.75a.75.75 0 0 0 1.495.088l.005-.088V12a.75.75 0 0 0-.75-.75Zm12-5.25H16.5v.75a.75.75 0 1 1-1.5 0V6H9v.75a.75.75 0 1 1-1.5 0V6H5.25a.75.75 0 0 0-.745.663L4.5 6.75v1.5h15v-1.5a.75.75 0 0 0-.75-.75Z">
                    </path>
                </svg>
                <span className="ml-6">چهارشنبه، 30 آوریل</span>
                <button type="button" className="btn cursor-pointer bg-amber-400 rounded-full p-2 text-gray-800">
                    <svg viewBox="0 0 24 24" width="1.25rem" height="1.25rem" fill="currentColor">
                        <path d="M14.25 3A6.758 6.758 0 0 1 21 9.75a6.758 6.758 0 0 1-6.75 6.75 6.713 6.713 0 0 1-3.933-1.267l-5.445 5.445a1.095 1.095 0 0 1-1.55 0 1.098 1.098 0 0 1 0-1.551l5.444-5.445A6.713 6.713 0 0 1 7.5 9.75 6.758 6.758 0 0 1 14.25 3Zm-.005 2.259A4.5 4.5 0 0 0 9.75 9.754a4.5 4.5 0 0 0 4.495 4.496 4.5 4.5 0 0 0 4.496-4.495 4.5 4.5 0 0 0-4.496-4.496Z">
                        </path>
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default InputNav