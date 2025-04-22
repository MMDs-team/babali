import Image from 'next/image';
import React from 'react';

type TravelSampleProps = {
    price: number;
    currency?: string;
    remainingSeats: number;
    departureTime: string;
    origin: string;
    originTerminal: string;
    destination: string;
    destinationTerminal: string;
    company: string;
    busType: string;
};

const TravelSample: React.FC<TravelSampleProps> = ({
    price,
    currency = 'تومان',
    remainingSeats,
    departureTime,
    origin,
    originTerminal,
    destination,
    destinationTerminal,
    company,
    busType,
}) => {
    return (
        <div className="flex flex-col md:flex-row border rounded-xl shadow-sm overflow-hidden bg-white w-full max-w-5xl mx-auto text-right">

            <div className="md:w-3/4 w-full p-4" >
                <div className="flex items-center justify-between mb-3">
                    <div className='flex items-center'>
                        <Image
                            src={`/HMSFR.jpg`}
                            alt='hero image'
                            width={50}
                            height={50}
                            objectFit="cover"
                            quality={100}
                        />
                        <h2 className="pr-4 text-sm text-gray-800 font-semibold">{company}</h2>
                    </div>
                    <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                        {busType}
                    </span>
                </div>


                <div className="flex px-14 py-4">
                    <p className="text-xl font-extrabold px-4">{departureTime}</p>
                    <div className="flex flex-col md:flex-row md:justify-between items-center gap-2 md:gap-0">

                        <div className="text-center">
                            <p className="text-sm text-gray-600">{origin}</p>
                            <p className="text-xs text-gray-400">{originTerminal}</p>
                        </div>

                        <div className="flex items-center justify-center my-2 md:my-0">
                            <span className="w-16 h-px bg-gray-300 mx-2" />
                            <span role="img" aria-label="bus">🚌</span>
                            <span className="w-16 h-px bg-gray-300 mx-2" />
                        </div>

                        <div className="text-center">
                            <p className="text-sm text-gray-600">{destination}</p>
                            <p className="text-xs text-gray-400">{destinationTerminal}</p>
                        </div>
                    </div>
                </div>

                <div className="flex text-sm text-blue-600 mt-4 gap-6">
                    <a href="#">نقشه صندلی‌ها</a>
                    <a href="#">اطلاعات اتوبوس و سفر</a>
                    <a href="#">قوانین جریمه و استرداد</a>
                </div>
            </div>

            <div className="md:w-1/4 w-full p-4 flex flex-col items-center justify-center border-r space-y-3">
                <p className="text-xl font-bold text-blue-600">
                    {price.toLocaleString()} {currency}
                </p>
                <button className="bg-blue-600 text-white rounded-md px-6 py-2 hover:bg-blue-700 transition">
                    انتخاب بلیط
                </button>
                <p className="text-sm text-gray-500">{remainingSeats} صندلی باقی مانده</p>
            </div>
        </div>
    );
};

export default TravelSample;
