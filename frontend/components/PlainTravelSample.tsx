import { useTravel } from '@/contexts/TravelContext';
import Image from 'next/image';
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from 'react';

type PlainTravelSampleProps = {
    travel: any
};

const PlainTravelSample: React.FC<PlainTravelSampleProps> = ({ travel }) => {

    const [stationsVisable, setStaionVisable] = useState(false);

    const { vehicleDetails, setVehicleDetails } = useTravel();
    const router = useRouter();
    const pathname = usePathname();

    const travelID = travel.travel_id;
    const price = travel.price || 0;
    const origin = travel.origin;
    const destination = travel.dest;
    const company = travel.flight_agency || "ـ";
    const capacity = travel.capacity;
    const date_time = travel.date_time;
    const airport = travel.airport;
    const airplan = travel.airplan;
    const flight_type = travel.flight_type;
    const flight_class = travel.flight_class;
    const max_loggage_weight = travel.max_loggage_weight;

    const currency = 'تومان'

    const formatTime = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toISOString().substring(11, 16);
    }

    const handleClick = () => {
        setVehicleDetails(travel)

        router.push(`${pathname}/${travelID}`);
    };


    useEffect(() => {
        console.log('whyy', travel)
    }, [])


    return (
        <div className="flex flex-col md:flex-row border rounded-xl shadow-sm overflow-hidden bg-white w-full max-w-5xl mx-auto text-right">

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
                        <h2 className="pr-4 text-sm text-gray-800 font-semibold">شرکت {company}</h2>
                        <div className='pr-4 gap-x-2 flex'>
                            <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                                {flight_type}
                            </span>
                            <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                                {flight_class}
                            </span>
                        </div>
                    </div>
                </div>


                <div className="flex px-14 py-4">
                    <p className="font-extrabold px-4">{formatTime(date_time)}</p>
                    <div className="flex flex-col md:flex-row md:justify-between items-center gap-2 md:gap-0">

                        <div className="text-center">
                            <p className="text-sm text-gray-600">{origin}</p>

                        </div>

                        <div className="flex items-center justify-center my-2 md:my-0">
                            <span className="w-16 h-px bg-gray-300 mx-2" />
                            <span role="img" aria-label="train">✈️</span>
                            <span className="w-16 h-px bg-gray-300 mx-2" />
                        </div>

                        <div className="text-center">
                            <p className="text-sm text-gray-600">{destination}</p>
                        </div>
                    </div>

                </div>

                <div className="flex text-sm text-blue-600 mt-4 gap-12">
                    <div
                        className='cursor-pointer '>اطلاعات پرواز</div>
                    <div
                        className='cursor-pointer '
                    >قوانین استرداد</div>
                </div>
            </div>

            <div className="md:w-1/4 w-full p-4 flex flex-col items-center justify-center border-r space-y-3">
                <p className="text-xl font-bold text-blue-600">
                    {price.toLocaleString()} {currency}
                </p>
                <button onClick={() => handleClick()} className="bg-blue-600 text-white rounded-md px-6 py-2 hover:bg-blue-700 transition">
                    انتخاب بلیط
                </button>
                <p className="text-sm text-gray-500">{capacity} ظرفیت باقی مانده</p>
            </div>
        </div>
    );
};

export default PlainTravelSample;
