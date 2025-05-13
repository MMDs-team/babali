'use client'
import React, { useState } from 'react'
import BusSeatChoseDetails from './BusSeatChoseDetails'

type SeatType = 'M' | 'F' | 'E' | 'S';
type Seat = { id: number; type: SeatType } | { id: null };

type BusSeatChoseProps = {
    selectedSeats: number[];
    setSelectedSeats: React.Dispatch<React.SetStateAction<number[]>>;
};


const BusSeatChose: React.FC<BusSeatChoseProps> = ({ selectedSeats, setSelectedSeats }) => {

    const BUS_MAP: Seat[][] =
        [
            [
                { id: 1, type: 'M' },
                { id: 2, type: 'M' },
                { id: 3, type: 'E' },
                { id: 4, type: 'E' },
                { id: null },
                { id: 5, type: 'F' },
                { id: 6, type: 'E' },
                { id: 7, type: 'E' },
                { id: 8, type: 'E' }
            ],
            [
                { id: 9, type: 'M' },
                { id: 10, type: 'M' },
                { id: 11, type: 'E' },
                { id: 12, type: 'E' },
                { id: null },
                { id: 13, type: 'F' },
                { id: 14, type: 'E' },
                { id: 15, type: 'E' },
                { id: 16, type: 'E' }
            ],
            [
                { id: null },
            ],
            [
                { id: 17, type: 'M' },
                { id: 18, type: 'M' },
                { id: 19, type: 'M' },
                { id: 20, type: 'E' },
                { id: 21, type: 'E' },
                { id: 22, type: 'E' },
                { id: 23, type: 'E' },
                { id: 24, type: 'E' },
                { id: 25, type: 'E' }
            ]
        ]

    const selectSeatHandler = (place: Seat) => {
        if (place.id === null) return;
        if (place.type === 'F' || place.type === 'M') return;
        setSelectedSeats(prev =>
            prev.includes(place.id) ?
                prev.filter(item => item !== place.id)
                : [...prev, place.id]
        );
    }



    return (
        <div className='px-12 md:px-18 lg:px-26 xl:px-42 py-6'>
            <div className='w-full border-1 shadow-xs p-4 md:px-6 px-4 bg-white'>

                <div className="flex items-center">
                    <svg viewBox="0 0 24 24" width="2em" height="2em" fill="currentColor" className="text-gray-600">
                        <path d="M14.277 6.75c.916 0 1.76.417 2.319 1.143a2.91 2.91 0 0 1 .508 2.535l-1.321 4.959a1.503 1.503 0 0 1-1.45 1.113H9.956a.752.752 0 0 0-.725.558l-1.014 3.809A2.204 2.204 0 0 1 6.093 22.5a2.185 2.185 0 0 1-1.744-.86 2.182 2.182 0 0 1-.38-1.906L5.14 15.34A4.505 4.505 0 0 1 9.487 12h.565c.34 0 .638-.23.725-.557l.675-2.523a2.928 2.928 0 0 1 2.825-2.17Zm5.274 3.025a.75.75 0 0 1 .53.918l-1.606 6.023a3.753 3.753 0 0 1-3.623 2.784h-3.745a.75.75 0 1 1 0-1.5h3.745a2.253 2.253 0 0 0 2.174-1.671l1.607-6.023c.107-.4.52-.636.918-.53ZM15.232 1.5a2.628 2.628 0 0 1 2.625 2.625 2.628 2.628 0 0 1-2.625 2.625 2.628 2.628 0 0 1-2.625-2.625A2.628 2.628 0 0 1 15.232 1.5Z" fillRule="evenodd">
                        </path>
                    </svg>
                    <span className="ml-auto text-gray-600 font-bold">انتخاب صندلی</span>
                    <div className="flex items-center justify-between font-medium text-grays-600 text-4">
                        <span className="ml-2 text-gray-800"> زمان باقیمانده: </span>
                        <strong className="text-red-600">08:55</strong>
                    </div>
                </div>
                <div className="flex-1 flex w-full justify-between flex-wrap px-4 py-5 md:px-0">
                    <BusSeatChoseDetails selectedCnt={selectedSeats.length} />

                    <div className="flex-1 border-1">
                        <div className="flex flex-col md:flex-row-reverse rounded-xl p-1 max-w-[44rem]">
                            <strong className="flex items-center justify-center pl-4 border-l text-sm text-gray-600 [writing-mode:vertical-lr] rotate-180">جلوی اتوبوس</strong>
                            <div className="flex-1 pl-2">
                                {BUS_MAP.map((row, idx) => (
                                    <div className='flex' key={idx}>
                                        {row.map((place, index) => (
                                            <div className="flex-1 flex justify-center p-1" key={index}>
                                                {place.id === null ? <div className="py-2"></div>
                                                    :
                                                    <strong
                                                        className={`w-full border-1
                                                            aspect-square flex items-center justify-center
                                                            ${place.type === 'M' && 'bg-blue-100 border-blue-200 text-gray-400 cursor-not-allowed'}           
                                                            ${place.type === 'F' && 'bg-red-100 border-red-200 text-gray-400 cursor-not-allowed'}           
                                                            ${selectedSeats.includes(place.id) ?
                                                                'bg-green-300 border-green-500 text-gray-700 cursor-pointer hover:border-green-700'
                                                                : place.type === 'E' && 'bg-gray-100 border-gray-200 text-gray-700 cursor-pointer hover:bg-gray-200 hover:border-gray-300'
                                                            }
                                                        `}
                                                        onClick={() => selectSeatHandler(place)}
                                                    >
                                                        {place.id}
                                                    </strong>
                                                }
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BusSeatChose