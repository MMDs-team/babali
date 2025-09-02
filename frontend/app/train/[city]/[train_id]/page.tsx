'use client'
import BusTicketView from "@/components/BusTicketView";
import CustomerDetails from "@/components/CustomerDetails";
import ProgressStepSection from "@/components/ProgressStepSection";
import TravelStars from "@/components/Stars";
import TrainTicketView from "@/components/TrainTicketView";
import { Button } from "@/components/ui/button";
import { useTravel } from "@/contexts/TravelContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type TrainPassengers = {
    firstName: string,
    lastNAme: string,
    SSN: string,
    gender: 'M' | 'F',
    birthDate: Date,
    phone: string | null
    seatNumber: number
}

export default function TrainTicketPage() {

    const router = useRouter();
    const pathname = usePathname();

    const [seats, setSeats] = useState<number[]>([1]);
    const [isPrivate, setIsPrivate] = useState(false);
    const { travelType, setTravelType, travelDetails, setTravelDetails, vehicleDetails } = useTravel();
    const [passengers, setPassengers] = useState<TrainPassengers[]>([]);

    const deleteHandler = (seatNumber: number | null) => {
        if (seatNumber === null) return;

        setPassengers(prevPassengers => {
            const newPassengers = prevPassengers.filter(p => p.seatNumber !== seatNumber);

            for (let i = 0; i < newPassengers.length; i++) {
                newPassengers[i] = { ...newPassengers[i], seatNumber: i + 1 };
            }
            return newPassengers;
        });

        setSeats(Array.from({ length: seats.length - 1 }, (_, i) => i + 1));
    };

    const addPassenger = (newPassenger: TrainPassengers, seatIndex: number) => {
        setPassengers(prev => {
            let updated = [...prev];
            updated[seatIndex] = { ...newPassenger, seatNumber: seats[seatIndex] };

            // Ensure the array has enough slots
            if (seats.length !== 0) {
                const newPassengers = updated.slice(0, seats.length);
                for (let i = 0; i < newPassengers.length; i++) {
                    newPassengers[i] = { ...newPassengers[i], seatNumber: i + 1 }
                }
                updated = newPassengers;
            }
            return updated;
        });
    };


    const increasePassengerCnt = () => {
        setSeats(prev => [...prev, prev.length + 1]);
    }


    const goToConfirm = () => {
        console.log('pass', passengers)
        router.push(`${pathname}/confirm`);
    };

    useEffect(() => {
        setTravelDetails((prev: any) => ({
            ...prev,
            passengers: passengers,
        }));
    }, [passengers, setTravelDetails, seats]);

    useEffect(() => {
        let pass = [1];
        let td = travelDetails['passCnt'];
        if (td) pass = Array.from({ length: td }, (_, i) => i + 1);
        setSeats(pass);
        if (travelType === 'train') return;
        setTravelType('train');
        setTravelDetails({ passCnt: 1 });
    }, []);


    return (
        <main className="mt-15 w-full bg-gray-100">
            <div className="w-full">
                <ProgressStepSection step={1} />

                <div className='px-12 md:px-18 lg:px-26 xl:px-42 pt-8'>
                    <div className="flex w-full border-1 shadow bg-white p-8 justify-between">

                        <div className="flex items-center space-x-3">

                            <button
                                type="button"
                                onClick={() => setIsPrivate(!isPrivate)}
                                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${isPrivate ? "bg-blue-500" : "bg-gray-300"
                                    }`}
                            >
                                <span
                                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${isPrivate ? "-translate-x-6" : "translate-x-0"
                                        }`}
                                />
                            </button>
                            <span className="text-gray-700 font-bold">کوپه دربست</span>
                        </div>

                        <div className='flex gap-x-4'>
                            <div className='pr-4 gap-x-2 flex'>
                                <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                                    {3} ستاره
                                </span>
                                <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                                    کوپه ۴ نفره
                                </span>
                            </div>
                            <TravelStars rating={3} size={20} />

                        </div>
                    </div>
                </div>

                <TrainTicketView train={vehicleDetails} seatsCount={seats.length} />

                <div className="px-12 md:px-18 lg:px-26 xl:px-42 py-2">
                    <div className="bg-white px-8 border-1 shadow-xs">
                        <CustomerDetails
                            passenger={passengers[0]}
                            seatNmb={1}
                            deleteHandler={deleteHandler}
                            isMain={true}
                            handler={addPassenger}
                            idx={0}
                        />
                        {seats.slice(1).map((seatNumber, index) => (
                            <CustomerDetails
                                key={index}
                                passenger={passengers[index + 1]}
                                seatNmb={seatNumber}
                                deleteHandler={deleteHandler}
                                handler={addPassenger}
                                idx={index + 1}
                            />
                        ))}
                    </div>

                    <Button
                        className="bg-white border-2 border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-600 rounded-sm mt-4"
                        onClick={() => increasePassengerCnt()}
                    >
                        + اضافه کردن مسافر جدید
                    </Button>


                </div>

                <div className="px-12 md:px-18 lg:px-26 xl:px-42 py-2 bg-white mt-4">
                    <div className="w-full flex justify-between items-center p-4 rounded-lg">


                        <span className="text-gray-800 font-medium">
                            با کلیک روی تایید و ادامه خرید با قوانین سایت و قوانین قطار موافقت کرده‌اید.
                        </span>
                        <button
                            className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            onClick={() => goToConfirm()}
                        >
                            تایید و ادامه خرید
                        </button>

                    </div>
                </div>
            </div>

        </main>
    );
}
