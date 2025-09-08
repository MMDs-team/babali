'use client'
import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { DatePicker } from "@/components/DatePicker";
import SourceTargetCity from "@/components/SourceTargetCity";
import PassengerSelector from "./PassengerCountSelect";
import SearchButton from "./SearchButton";
import MobileDrawerPageWithData from "./MobileDrawerPageWithData";

const typesName: Record<string, string> = {
    'bus': 'اتوبوس',
    'train': 'قطار',
    'airplain-in': 'پرواز'
}

const InputNav = () => {

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [sourceCity, setSourceCity] = useState<string>('');
    const [targetCity, setTargetCity] = useState<string>('');
    const [open, setOpen] = useState(false);
    const [totalPassengerCount, setTotalPassengerCount] = useState<number[]>([1, 0, 0]);

    const [type, setType] = useState<string>('bus')
    const [travelDate, setTravelDate] = useState<Date>(new Date());

    const [scrollY, setScrollY] = useState(0);
    const [isScrollingUp, setIsScrollingUp] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [MobileSize, setMobileSize] = useState(window.innerWidth < 1024);

    const formatCity = (city: string) => city.replace(/\s+/g, "_");

    function formatLocalDate(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    const searchTravel = async () => {
        if (!sourceCity || !targetCity || !travelDate) return;
        console.log(travelDate)
        const formattedDate = formatLocalDate(travelDate);
        const totalCnt = totalPassengerCount[0] + totalPassengerCount[1] + totalPassengerCount[2];

        console.log(formattedDate)

        router.push(`/${type}/${formatCity(sourceCity)}-${formatCity(targetCity)}?date=${formattedDate}${(type === 'train' || type === 'airplain-in') ? `&count=${totalCnt}&pass=${totalPassengerCount[0]}-${totalPassengerCount[1]}-${totalPassengerCount[2]}` : ''}`);
    };

    const showDrawer = () => {
        setOpen(true);
    }

    useEffect(() => {
        if (!pathname) return;

        if (window.innerWidth < 1024) {
            setMobileSize(true);
        } else setMobileSize(false);


        // Extract origin and dest from /bus/origin-dest
        const match = pathname.match(/\/(bus|train|airplain-in)\/([^/]+)-([^/]+)/);
        if (match) {
            // match[1] -> "bus" or "train" or "airplain-in"
            setSourceCity(decodeURIComponent(match[2]));
            setTargetCity(decodeURIComponent(match[3]));
            setType(match[1]);
        }

        // Get date from query
        const dateParam = searchParams?.get("date");
        const count = searchParams?.get("pass");
        if (count) {
            const passList = count.split("-").map(Number);
            setTotalPassengerCount(passList);
        }
        if (dateParam) setTravelDate(new Date(dateParam));

    }, [pathname, searchParams]);


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

    if (MobileSize) {
        positionStyle = 'sticky top-0';
        isCollapsed = true;
    } else {
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
    }

    return (
        <div className={`${baseStyle} ${positionStyle} bg-white shadow-md`}>
            <div className={`${isCollapsed ? 'hidden' : 'flex'} gap-2 border-1 border-t-0 px-12 md:px-18 lg:px-26 xl:px-42  py-8`}>
                <SourceTargetCity
                    className='flex-5'
                    sourceCity={sourceCity}
                    targetCity={targetCity}
                    setSourceCity={setSourceCity}
                    setTargetCity={setTargetCity}
                />
                <DatePicker className='flex-3' date={travelDate} setDate={setTravelDate} />
                {(type === 'train' || type === 'airplain-in') && <PassengerSelector
                    totalPassengerCount={totalPassengerCount}
                    setTotalPassengerCount={setTotalPassengerCount}
                />}

                <SearchButton onSearch={async () => await searchTravel()} />

            </div>
            {!open && <div
                className={`${isCollapsed ? 'flex' : 'hidden'} w-full cursor-pointer items-center justify-center py-3 w-bold text-gray-700 whitespace-nowrap`}
                onClick={() => showDrawer()}
            >

                {type === 'bus' ? <svg viewBox="0 0 24 24" width="1.5rem" height="1.5rem" fill="currentColor" className="text-grays-500 mx-2">
                    <svg viewBox="0 0 24 24" width="1.5rem" height="1.5rem" fill="currentColor" className="shrink-0 text-grays-500 ml-2">
                        <path d="M14.81 3a3.284 3.284 0 0 1 3.281 3.28h.657c.723 0 1.312.59 1.312 1.313v1.969a.656.656 0 1 1-1.312 0V7.593h-.657v9.186a1.97 1.97 0 0 1-1.968 1.969v1.312c0 .724-.589 1.312-1.312 1.312h-.656a1.314 1.314 0 0 1-1.313-1.312v-1.312h-2.624v1.312c0 .724-.589 1.312-1.313 1.312H8.25a1.314 1.314 0 0 1-1.312-1.312v-1.312a1.97 1.97 0 0 1-1.969-1.969V7.593h-.656v1.969a.656.656 0 1 1-1.312 0V7.593c0-.724.589-1.312 1.312-1.312h.656A3.284 3.284 0 0 1 8.25 3h6.562Zm1.97 10.829a14.615 14.615 0 0 1-5.25.98c-1.779 0-3.557-.33-5.25-.98v2.95a.656.656 0 0 0 .657.656h9.186a.656.656 0 0 0 .656-.656v-2.95Zm-1.313.982a.656.656 0 0 1 .656.656v.656a.656.656 0 0 1-1.312 0v-.656a.656.656 0 0 1 .656-.656Zm-7.874 0a.656.656 0 0 1 .656.656v.656a.656.656 0 1 1-1.312 0v-.656a.656.656 0 0 1 .656-.656Zm6.562-9.186h-5.25a.656.656 0 0 0 0 1.312h5.25a.656.656 0 0 0 0-1.312Z">
                        </path>
                    </svg>
                </svg> :
                    type === 'airplain-in' ?
                        <svg viewBox="0 0 24 24" width="1.5em" fill="currentColor" className="product-tabs__icon" data-v-c6bcaac6=""><path d="m9.849 20.989.025-.005h4.3c.7.07 1.393-.448 1.542-1.198l.017-.107a1.493 1.493 0 0 0-1.044-1.61l-1.048-.39.15-3.308 5.378 1.983.064.02c.977.254 1.767-.309 1.767-1.311v-.074l-.008-.14a2.308 2.308 0 0 0-1.22-1.847L18 12.013v-.587a1.538 1.538 0 0 0-1.581-1.498 3.69 3.69 0 0 0-1.098.105l-.078.024a.667.667 0 0 0-.209.128l-.115.11-.9-.508.188-4.08v-.255c0-.16-.007-.319-.022-.478C14.065 3.772 13.387 3 12 3c-.979 0-1.655.407-1.975 1.136l-.045.107c-.166.425-.19.822-.166 1.53l.168 4.01-.925.515-.118-.114a.666.666 0 0 0-.287-.151 3.88 3.88 0 0 0-.925-.112l-.336.01c-.74.053-1.36.682-1.39 1.469L6 12.014l-1.785.995A2.297 2.297 0 0 0 3 14.97v.073c0 .994.786 1.553 1.76 1.313l.07-.022 5.378-1.983.15 3.308-1.05.39.07-.016a1.498 1.498 0 0 0 .471 2.956ZM12 4.332c.628 0 .801.197.858.772l.01.136.006.15v.356l-.207 4.39a.666.666 0 0 0 .339.612l1.774.998a.668.668 0 0 0 .88-.21l.087-.15c.017-.025.034-.05.053-.074l.017-.021.123-.02c.102-.011.204-.017.307-.017l.152.004c.172-.002.264.083.268.193v.954c0 .242.13.464.341.582l2.127 1.185a.98.98 0 0 1 .532.838l.002.082.007.035-.045-.023-6.234-2.298a.667.667 0 0 0-.896.595l-.214 4.703a.666.666 0 0 0 .434.654l1.54.573c.115.036.163.116.147.196a.16.16 0 0 1-.172.127l-4.41-.002-.127.012a.165.165 0 0 1-.1-.313l.14-.04 1.54-.574a.666.666 0 0 0 .434-.654l-.214-4.702a.667.667 0 0 0-.896-.595l-6.241 2.301-.038.017c-.001-.001.01-.018.01-.061v-.053a.966.966 0 0 1 .517-.81l2.14-1.193a.665.665 0 0 0 .343-.582v-.979c.003-.082.091-.167.199-.166l.172-.006c.114 0 .221.006.325.018l.126.018.018.022.052.075.046.08a.668.668 0 0 0 .918.282l1.8-1a.666.666 0 0 0 .342-.61l-.186-4.416-.006-.255c-.003-.392.024-.612.105-.795.1-.228.288-.341.755-.341Z"></path></svg>
                        :
                        <svg viewBox="0 0 24 24" width="1.5em" fill="currentColor" className="product-tabs__icon" data-v-c6bcaac6=""><path d="m16.655 16.073.045.06 2.573 3.855a.645.645 0 0 1-1.028.75l-.045-.06-2.572-3.855a.645.645 0 0 1 1.027-.75Zm-7.852-.12a.637.637 0 0 1 .217.825l-.037.067L6.41 20.7a.645.645 0 0 1-.877.18.638.638 0 0 1-.21-.825v-.067l2.572-3.855a.63.63 0 0 1 .908-.18Zm6.397 2.46a.645.645 0 0 1 .075 1.282H9.41a.645.645 0 0 1-.075-1.282H15.2ZM13.91 16.5a.645.645 0 0 1 .075 1.282H10.7a.645.645 0 0 1-.075-1.282h3.285ZM15.523 3a3.217 3.217 0 0 1 3.21 3.202v7.073a1.93 1.93 0 0 1-1.95 1.928h-9a1.928 1.928 0 0 1-1.905-1.928V6.202A3.218 3.218 0 0 1 9.095 3h6.428Zm1.927 6.832-.832.413a4.575 4.575 0 0 1-1.8.465h-4.785a4.613 4.613 0 0 1-1.823-.383l-.195-.09-.825-.412v3.45a.645.645 0 0 0 .57.637h9.023a.645.645 0 0 0 .645-.637l.022-3.443Zm-8.55 1.5a.969.969 0 0 1 .536 1.706.967.967 0 1 1-.536-1.706Zm6.81 0a.967.967 0 1 1-.96.96.959.959 0 0 1 .96-.944v-.016Zm-.187-7.057H9.095A1.935 1.935 0 0 0 7.16 6.202v2.175l1.373.698c.39.194.817.309 1.252.338h4.823a3.39 3.39 0 0 0 1.275-.255l.165-.075 1.402-.706V6.202a1.928 1.928 0 0 0-1.815-1.927h-.112Zm-1.29.637a.645.645 0 0 1 .075 1.283h-3.93a.652.652 0 0 1-.645-.645.645.645 0 0 1 .57-.638h3.93Z" fill-rule="evenodd"></path></svg>
                }
                <h1 className="ml-4 text-4 font-medium my-0"> بلیط {typesName[type]} {sourceCity} به {targetCity}</h1>
                <svg viewBox="0 0 24 24" width="1.5rem" height="1.5rem" fill="currentColor" className="text-grays-500 mx-2">
                    <path d="M15.75 3a.75.75 0 0 1 .75.75v.75h2.25c1.196 0 2.178.939 2.246 2.118L21 6.75v12a2.253 2.253 0 0 1-2.118 2.246L18.75 21H5.25a2.253 2.253 0 0 1-2.246-2.118L3 18.75v-12c0-1.196.939-2.178 2.118-2.246L5.25 4.5H7.5v-.75a.75.75 0 1 1 1.5 0v.75h6v-.75a.75.75 0 0 1 .75-.75Zm-3 12a.75.75 0 0 0-.745.662L12 15.75v.75a.75.75 0 0 0 1.495.088l.005-.088v-.75a.75.75 0 0 0-.75-.75Zm-3 0a.75.75 0 0 0-.745.662L9 15.75v.75a.75.75 0 0 0 1.495.088l.005-.088v-.75a.75.75 0 0 0-.75-.75Zm-3 0a.75.75 0 0 0-.745.662L6 15.75v.75a.75.75 0 0 0 1.495.088L7.5 16.5v-.75a.75.75 0 0 0-.75-.75Zm9-3.75a.75.75 0 0 0-.745.662L15 12v.75a.75.75 0 0 0 1.495.088l.005-.088V12a.75.75 0 0 0-.75-.75Zm-3 0a.75.75 0 0 0-.745.662L12 12v.75a.75.75 0 0 0 1.495.088l.005-.088V12a.75.75 0 0 0-.75-.75Zm-3 0a.75.75 0 0 0-.745.662L9 12v.75a.75.75 0 0 0 1.495.088l.005-.088V12a.75.75 0 0 0-.75-.75Zm-3 0a.75.75 0 0 0-.745.662L6 12v.75a.75.75 0 0 0 1.495.088l.005-.088V12a.75.75 0 0 0-.75-.75Zm12-5.25H16.5v.75a.75.75 0 1 1-1.5 0V6H9v.75a.75.75 0 1 1-1.5 0V6H5.25a.75.75 0 0 0-.745.663L4.5 6.75v1.5h15v-1.5a.75.75 0 0 0-.75-.75Z">
                    </path>
                </svg>
                <span className="ml-6">{formatLocalDate(travelDate)}</span>
                <button
                    type="button"
                    className="btn cursor-pointer bg-amber-400 rounded-full p-2 text-gray-800"
                    onClick={async () => await searchTravel()}
                >
                    <svg viewBox="0 0 24 24" width="1.25rem" height="1.25rem" fill="currentColor">
                        <path d="M14.25 3A6.758 6.758 0 0 1 21 9.75a6.758 6.758 0 0 1-6.75 6.75 6.713 6.713 0 0 1-3.933-1.267l-5.445 5.445a1.095 1.095 0 0 1-1.55 0 1.098 1.098 0 0 1 0-1.551l5.444-5.445A6.713 6.713 0 0 1 7.5 9.75 6.758 6.758 0 0 1 14.25 3Zm-.005 2.259A4.5 4.5 0 0 0 9.75 9.754a4.5 4.5 0 0 0 4.495 4.496 4.5 4.5 0 0 0 4.496-4.495 4.5 4.5 0 0 0-4.496-4.496Z">
                        </path>
                    </svg>
                </button>
            </div>}

            <MobileDrawerPageWithData open={open} setOpen={setOpen}>
                <SourceTargetCity
                    className='flex-5'
                    sourceCity={sourceCity}
                    targetCity={targetCity}
                    setSourceCity={setSourceCity}
                    setTargetCity={setTargetCity}
                />
                <DatePicker className='w-full my-4' date={travelDate} setDate={setTravelDate} />
                {(type === 'train' || type === 'airplain-in') && <PassengerSelector
                    totalPassengerCount={totalPassengerCount}
                    setTotalPassengerCount={setTotalPassengerCount}
                />}

                <SearchButton onSearch={async () => {
                    await searchTravel()
                    setOpen(false);
                }} />
            </MobileDrawerPageWithData>
        </div>
    )
}

export default InputNav