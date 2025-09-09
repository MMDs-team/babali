import { useTravel } from '@/contexts/TravelContext';
import Image from 'next/image';
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from 'react';
import TrainStaions from './TrainStations';
import TravelStars from './Stars';
import SelectTicketButton from './SelectTicketButton';

type TrainTravelSampleProps = {
    travel: any
};

const TrainTravelSample: React.FC<TrainTravelSampleProps> = ({ travel }) => {

    const [stationsVisable, setStaionVisable] = useState(false);

    const { vehicleDetails, setVehicleDetails } = useTravel();
    const router = useRouter();
    const pathname = usePathname();

    const travelID = travel.travel_id;
    const price = travel.price || 0;
    const origin = travel.route[0];
    const destination = travel.route[travel.route.length - 1];
    const company = travel.cooperative || "ـ";
    const capacity = travel.capacity;
    const routes = travel.route;
    const empty_compartment = travel.empty_compartment;
    const stars = travel.star;

    const currency = 'تومان'

    const formatTime = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toISOString().substring(11, 16);
    }
    const arrivalHM = formatTime(travel.arrival_time);
    const departureHM = formatTime(travel.departure_time);

    const handleClick = () => {
        setVehicleDetails(travel)

        router.push(`${pathname}/${travelID}`);
    };

    return (
        <div
            className="flex flex-col md:flex-row border rounded-xl shadow-sm overflow-hidden bg-white w-full max-w-5xl mx-auto text-right"
            onClick={(e) => {
                if (window.innerWidth < 1024) {
                    handleClick();
                } else {
                    // Prevent parent div from hijacking clicks on lg+
                    e.stopPropagation();
                }
            }}
        >

            <div className="md:w-3/4 w-full p-4" >
                <div className="flex items-center justify-between mb-3">
                    <div className='flex items-center'>
                        <Image
                            src={`/HMSFR.jpg`}
                            alt='company image'
                            width={50}
                            height={50}
                            objectFit="cover"
                            quality={100}
                        />
                        <h2 className="pr-4 text-sm text-gray-800 font-semibold">تعاونی {company}</h2>
                        <div className='pr-4 gap-x-2 flex'>
                            <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                                {stars} ستاره
                            </span>
                            <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                                کوپه ۴ نفره
                            </span>
                        </div>
                    </div>
                    <TravelStars rating={3} size={20} />
                </div>


                <div className="flex justify-between lg:px-14 py-4">
                    <p className="font-extrabold lg:px-4">{departureHM}</p>
                    <div className="flex lg:flex-col md:flex-row md:justify-between items-center gap-2 md:gap-0">

                        <div className="text-center">
                            <p className="text-sm text-gray-600">{origin}</p>

                        </div>

                        <div className="flex items-center justify-center my-2 md:my-0">
                            <span className="w-8 lg:w-16 h-px bg-gray-300 mx-2" />
                            <span role="img" aria-label="train">🚆</span>
                            <span className="w-8 lg:w-16 h-px bg-gray-300 mx-2" />
                        </div>

                        <div className="text-center">
                            <p className="text-sm text-gray-600">{destination}</p>
                        </div>
                    </div>
                    <p className="font-extrabold px-4">{arrivalHM}</p>

                </div>
                <div className='px-8'>
                    {stationsVisable &&
                        <TrainStaions stations={routes} />

                    }
                </div>

                <div className="hidden lg:flex text-sm text-blue-600 mt-4 gap-12">
                    <div
                        className='cursor-pointer '>اطلاعات قطار</div>
                    <div
                        className='cursor-pointer '
                        onClick={() => setStaionVisable(!stationsVisable)}
                    >ایستگاه‌ها</div>
                    <div
                        className='cursor-pointer '
                    >قوانین استرداد</div>
                </div>
            </div>

            <div className="md:w-1/4 w-full p-4 flex lg:flex-col items-center justify-between lg:justify-center border-r space-y-3">
                <p className="text-xl font-bold text-blue-600">
                    {price.toLocaleString()} {currency}
                </p>

                <SelectTicketButton className='hidden lg:block' onClick={async () => await handleClick()} />

                <p className="text-sm text-gray-500">{capacity} ظرفیت باقی مانده</p>
            </div>
        </div>
    );
};

export default TrainTravelSample;
