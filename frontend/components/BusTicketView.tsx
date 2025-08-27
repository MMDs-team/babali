import React, { useEffect } from 'react'
import { Button } from './ui/button'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation';

const BusTicketView = ({ bus, seatsCount }: { bus: any, seatsCount: number }) => {

    const travelID = bus.travel_id;
    const price = bus.price || 0;
    const origin = bus.origin;
    const destination = bus.dest;
    const company = bus.cooperative || "ـ";
    const departureTime = bus.date_time.split("T")[1].substring(0, 5) || "--:--";
    const originTerminal = bus.originTerminal || "";
    const destinationTerminal = bus.destinationTerminal || "";
    const busType = bus.busType || "Standard";

    const router = useRouter();
    const pathname = usePathname();

    const date = new Date(bus.date_time);
    const persianDate = date.toLocaleDateString("fa-IR", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });


    const goBackToTicket = () => {
        const basePath = pathname.split("/").slice(0, 3).join("/");
        router.push(`${basePath}?date=${bus.date_time.split("T")[0]}`);
    }

    return (
        <div className='px-12 md:px-18 lg:px-26 xl:px-42 py-8'>
            <div className="flex w-full border-1 shadow bg-white">
                <div className='flex flex-3 p-4'>
                    <div className='flex flex-col px-4'>
                        <span className='py-2'>
                            {persianDate}
                        </span>
                        <Image
                            src={`/HMSFR.jpg`}
                            alt='company image'
                            width={50}
                            height={50}
                            objectFit="cover"
                            quality={100}
                        />
                    </div>
                    <div className='flex flex-col justify-around'>
                        <div className='flex gap-4'>
                            <span className='bg-gray-200 py-1 px-2 rounded-2xl text-sm text-gray-600'>
                                مان VIP (کاوه)
                            </span>
                            <span className='text-gray-800'>
                                همسفر چابکسواران پایانه بیهقی
                            </span>
                        </div>
                        <div className='flex p-2 py-4 gap-4'>
                            <span className='text-xl font-extrabold'>{departureTime}</span>
                            <div className='flex'>
                                <div className="text-center">
                                    <p className="text-sm text-gray-600">{origin}</p>
                                    <p className="text-xs text-gray-400">پایانه بیهقی</p>
                                </div>

                                <div className="flex items-center justify-center my-2 md:my-0">
                                    <span className="w-16 h-px bg-gray-300 mx-2" />
                                    <span role="img" aria-label="bus">🚌</span>
                                    <span className="w-16 h-px bg-gray-300 mx-2" />
                                </div>

                                <div className="text-center">
                                    <p className="text-sm text-gray-600">{destination}</p>
                                    <p className="text-xs text-gray-400">پایاه کاوه</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className='flex flex-1 flex-col items-center border-r p-4'>
                    <Button
                        className='w-full bg-white text-blue-500 border-2 border-blue-500 hover:bg-blue-500 hover:text-white'
                        onClick={() => goBackToTicket()}
                    >
                        تغییر بلیط
                    </Button>
                    <div className="flex flex-col gap-2 mt-6 text-gray-500">
                        <div>
                            <div className="flex items-center justify-between py-1 w-full">
                                <div className="text-2 ml-3 text-grays-400">هر صندلی </div>
                                <span className="text-3">
                                    <strong className="text-grays-500 font-medium" dir="ltr">{price}</strong>
                                    <small className="text-grays-500 mr-1">تومان</small>
                                </span>
                            </div>
                        </div>
                        <hr />
                        <div className="flex items-center justify-between w-full">
                            <div className="text-2 text-grays-400 ml-3 text-right">مجموع</div>
                            <span className="text-3">
                                <strong className="text-grays-500 font-medium" dir="ltr">{price * seatsCount}</strong>
                                <small className="text-grays-500 mr-1">تومان</small>
                            </span>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default BusTicketView