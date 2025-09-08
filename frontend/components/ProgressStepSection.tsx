'use client'

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const typesName: Record<string, string> = {
    'bus': 'اتوبوس',
    'train': 'قطار',
    'airplain-in': 'پرواز'
}

const ProgressStepSection = ({ step }: { step: number }) => {

    const [scrollY, setScrollY] = useState(0);
    const [isScrollingUp, setIsScrollingUp] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [mobileSize, setMobileSize] = useState(window.innerWidth < 1024);
    const [type, setType] = useState('bus');

    const pathname = usePathname();

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

    useEffect(() => {
        if (window.innerWidth < 1024) {
            setMobileSize(true);
        } else setMobileSize(false);

        const match = pathname.match(/\/(bus|train|airplain-in)\/([^/]+)-([^/]+)/);
        if (match) {
            setType(match[1]);
        }
    }, [pathname])

    const baseStyle = 'w-full z-50 transition-all duration-300 ease-in-out';
    let positionStyle = '';

    
        if (scrollY < 100) {
            positionStyle = `sticky ${mobileSize?'top-0':'top-15'}`;
        } else if (isScrollingUp) {
            positionStyle = `sticky ${mobileSize?'top-0':'top-15'}`;
        } else {
            positionStyle = `sticky top-0`;
        }
    

    return (
        <ul className={`flex px-0 md:px-18 lg:px-26 xl:px-42 py-8 bg-white text-gray-400 text-xs shadow-sm ${positionStyle} ${baseStyle}`}>
            <li className={`pr-4 flex-1 flex flex-col items-center relative after:content-[''] after:absolute after:right-1/2 after:top-[11px] after:z-[-1] after:h-px after:w-full after:border-b after:${step > 0 ? 'border-green-600' : 'border-gray-200'}`}>
                <span className="flex bg-white md:pb-1 md:px-1">
                    <svg viewBox="0 0 24 24" width="26px" height="26px" fill="currentColor" className={step >= 0 ? 'text-green-600' : 'text-gray-200'}>
                        <path d="m17.726 9.74-6.805 6.805a1.122 1.122 0 0 1-1.591 0l-3.75-3.75a1.124 1.124 0 1 1 1.59-1.59l2.955 2.954 6.01-6.01a1.124 1.124 0 1 1 1.591 1.59ZM12 1.5C6.21 1.5 1.5 6.21 1.5 12S6.21 22.5 12 22.5 22.5 17.79 22.5 12 17.79 1.5 12 1.5Z">
                        </path>
                    </svg>
                </span>
                <span className={`font-bold text-center ${step === 0 ? 'text-green-700' : step < 0 ? 'text-gray-400' : 'text-gray-800'}`}>انتخاب {typesName[type]}</span>

            </li>
            <li className={`flex-1 flex flex-col items-center relative after:content-[''] after:absolute after:right-1/2 after:top-[11px] after:z-[-1] after:h-px after:w-full after:border-b after:${step > 1 ? 'border-green-600' : 'border-gray-200'}`}>
                <span className="flex bg-white md:pb-1 md:px-2">
                    <svg viewBox="0 0 24 24" width="26px" height="26px" fill="currentColor" className={step >= 1 ? 'text-green-600' : 'text-gray-200'}>
                        <path d="M12.75 8.25A3.754 3.754 0 0 0 16.5 12a3.754 3.754 0 0 0 3.75-3.75A3.754 3.754 0 0 0 16.5 4.5a3.754 3.754 0 0 0-3.75 3.75ZM10.5 19.5h11.25a.75.75 0 0 0 .75-.75V16.5a3.754 3.754 0 0 0-3.75-3.75H13.5a3.754 3.754 0 0 0-3.75 3.75v2.25c0 .415.335.75.75.75ZM6.375 12A2.628 2.628 0 0 1 3.75 9.375 2.628 2.628 0 0 1 6.375 6.75 2.628 2.628 0 0 1 9 9.375 2.628 2.628 0 0 1 6.375 12ZM2.25 18.75H7.5a.75.75 0 0 0 .75-.75v-1.5c0-.349.078-.683.23-.993a1.934 1.934 0 0 0-.082-1.89 1.838 1.838 0 0 0-1.57-.867H5.25A3.754 3.754 0 0 0 1.5 16.5V18c0 .415.335.75.75.75Z" fillRule="evenodd">
                        </path>
                    </svg>
                </span>
                <span className={`font-bold text-center ${step === 1 ? 'text-green-700' : step < 1 ? 'text-gray-400' : 'text-gray-800'}`}
                >مشخصات مسافران</span>

            </li>
            <li className={`flex-1 flex flex-col items-center relative after:content-[''] after:absolute after:right-1/2 after:top-[11px] after:z-[-1] after:h-px after:w-full after:border-b after:${step > 2 ? 'border-green-600' : 'border-gray-200'}`}>
                <span className="flex bg-white md:pb-1 md:px-1">
                    <svg viewBox="0 0 24 24" width="26px" height="26px" fill="currentColor" className={step >= 2 ? 'text-green-600' : 'text-gray-200'}>
                        <path d="M18.75 3.75A2.25 2.25 0 0 1 21 6v12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18V6a2.25 2.25 0 0 1 2.25-2.25h13.5Zm0 1.5H5.25A.75.75 0 0 0 4.5 6v12c0 .414.336.75.75.75h13.5a.75.75 0 0 0 .75-.75V6a.75.75 0 0 0-.75-.75ZM17.35 15c.36 0 .65.291.65.65v.2a.65.65 0 0 1-.65.65H10.4a.65.65 0 0 1-.65-.65v-.2a.65.65 0 0 1 .65-.65h6.95ZM7.5 15a.75.75 0 1 1 0 1.5h-.75a.75.75 0 1 1 0-1.5h.75Zm9.85-3.75c.36 0 .65.291.65.65v.2a.65.65 0 0 1-.65.65H10.4a.65.65 0 0 1-.65-.65v-.2a.65.65 0 0 1 .65-.65h6.95Zm-9.85 0a.75.75 0 1 1 0 1.5h-.75a.75.75 0 1 1 0-1.5h.75Zm9.85-3.75c.36 0 .65.291.65.65v.2a.65.65 0 0 1-.65.65H10.4a.65.65 0 0 1-.65-.65v-.2a.65.65 0 0 1 .65-.65h6.95Zm-9.85 0a.75.75 0 1 1 0 1.5h-.75a.75.75 0 1 1 0-1.5h.75Z" fillRule="evenodd">
                        </path>
                    </svg>
                </span>
                <span className={`font-bold text-center ${step === 2 ? 'text-green-700' : step < 2 ? 'text-gray-400' : 'text-gray-800'}`}>تایید اطلاعات</span>

            </li>
            <li className={`flex-1 flex flex-col items-center relative after:content-[''] after:absolute after:right-1/2 after:top-[11px] after:z-[-1] after:h-px after:w-full after:border-b after:${step > 3 ? 'border-green-600' : 'border-gray-200'}`}>
                <span className="flex bg-white md:pb-1 md:px-1">
                    <svg viewBox="0 0 24 24" width="26px" height="26px" fill="currentColor" className={step >= 3 ? 'text-green-600' : 'text-gray-200'}>
                        <path d="M20.25 4.5a2.25 2.25 0 0 1 2.25 2.25v10.5a2.25 2.25 0 0 1-2.25 2.25H3.75a2.25 2.25 0 0 1-2.25-2.25V6.75A2.25 2.25 0 0 1 3.75 4.5h16.5ZM21 9.75H3v7.5c0 .385.29.702.663.745L3.75 18h16.5a.75.75 0 0 0 .75-.75v-7.5ZM9 13.5a.75.75 0 0 1 .087 1.495L9 15H5.25a.75.75 0 0 1-.087-1.495l.087-.005H9Zm3 0a.75.75 0 0 1 .088 1.495L12 15h-.75a.75.75 0 0 1-.088-1.495l.088-.005H12ZM20.25 6H3.75a.75.75 0 0 0-.75.75v1.5h18v-1.5a.75.75 0 0 0-.663-.745L20.25 6Z">
                        </path>
                    </svg>
                </span>
                <span className={`font-bold text-center ${step === 3 ? 'text-green-700' : step < 3 ? 'text-gray-400' : 'text-gray-800'}`}>پرداخت</span>

            </li>
            <li className="pl-4 flex-1 flex flex-col items-center">
                <span className="flex bg-white md:pb-1 md:px-1">
                    <svg viewBox="0 0 24 24" width="26px" height="26px" fill="currentColor" className={step >= 4 ? 'text-green-600' : 'text-gray-200'}>
                        <path d="M11.348 4.5c.697 0 1.272.483 1.455 1.15l.036.111a1.502 1.502 0 0 0 2.857-.112l.037-.115c.215-.606.763-1.034 1.42-1.034h3.097a2.25 2.25 0 0 1 2.25 2.25v10.5a2.25 2.25 0 0 1-2.25 2.25h-3.097c-.698 0-1.273-.483-1.457-1.15l-.036-.112a1.5 1.5 0 0 0-2.857.113l-.036.115c-.215.606-.763 1.034-1.42 1.034H3.75a2.25 2.25 0 0 1-2.25-2.25V6.75A2.25 2.25 0 0 1 3.75 4.5h7.598Zm0 1.5H3.75a.75.75 0 0 0-.75.75v10.5c0 .414.336.75.75.75h7.598c-.003 0-.004 0-.004-.002l.058-.193a3.001 3.001 0 0 1 5.74.147l.01.048h3.098a.75.75 0 0 0 .75-.75V6.75a.75.75 0 0 0-.75-.75l-3.094.002-.058.192a3 3 0 0 1-5.74-.146l-.014-.046.004-.002Zm2.902 3.75a.75.75 0 0 1 .745.662L15 10.5v3a.75.75 0 0 1-1.495.088L13.5 13.5v-3a.75.75 0 0 1 .75-.75Zm-3.75 3a.75.75 0 0 1 .088 1.495l-.088.005H5.25a.75.75 0 0 1-.087-1.495l.087-.005h5.25Zm8.25 0a.75.75 0 0 1 .087 1.495l-.087.005H18a.75.75 0 0 1-.087-1.495L18 12.75h.75Zm-8.25-3a.75.75 0 0 1 .088 1.495l-.088.005H5.25a.75.75 0 0 1-.087-1.495l.087-.005h5.25Zm8.25 0a.75.75 0 0 1 .087 1.495l-.087.005H18a.75.75 0 0 1-.087-1.495L18 9.75h.75Z" fillRule="evenodd">
                        </path>
                    </svg>
                </span>
                <span className={`font-bold text-center ${step === 4 ? 'text-green-700' : step < 4 ? 'text-gray-400' : 'text-gray-800'}`}>صدور بلیط</span>

            </li>
        </ul>
    )
}

export default ProgressStepSection