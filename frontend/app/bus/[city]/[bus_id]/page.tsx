'use client'
import BusSeatChose from "@/components/BusSeatChose";
import BusTicketView from "@/components/BusTicketView";
import CustomerDetails from "@/components/CustomerDetails";
import ProgressStepSection from "@/components/ProgressStepSection";
import { useTravel } from "@/contexts/TravelContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type BusPassenger = {
    firstName: string,
    lastNAme: string,
    gender: 'M' | 'F',
    SSR: string,
    birthDate: Date,
    phone: string | null
    seatNumber: number
}

export default function BusTicketPage() {

    const router = useRouter();
    const pathname = usePathname();

    const [seats, setSeats] = useState<number[]>([]);
    const { travelType, setTravelType, setTravelDetails } = useTravel();
    const [passengers, setPassengers] = useState<BusPassenger[]>([])

    const deleteHandler = (seatNumber: number | null) => {
        if (seatNumber === null) return;
        setSeats(prev => prev.filter(seat => seat !== seatNumber));
        setPassengers(prev => prev.filter(p => p.seatNumber !== seatNumber));
    };

    const addPassenger = (newPassenger: BusPassenger) => {
        setPassengers(prev => {
            const updated = prev.some(p => p.seatNumber === newPassenger.seatNumber)
                ? prev.map(p =>
                    p.seatNumber === newPassenger.seatNumber ? newPassenger : p
                )
                : [...prev, newPassenger];

            return updated;
        });
    };



    const goToConfirm = () => {
        router.push(`${pathname}/confirm`);
    };

    useEffect(() => {
        setTravelDetails((prev: any) => ({
            ...prev,
            passengers: passengers,
        }));
    }, [passengers, setTravelDetails]);



    useEffect(() => {
        if (travelType === 'bus') return;
        setTravelType('bus');
        setTravelDetails({})
    }, []);

    return (
        <main className="mt-15 w-full bg-gray-100">
            <div className="w-full">
                <ProgressStepSection step={1} />
                <BusTicketView />
                <BusSeatChose selectedSeats={seats} setSelectedSeats={setSeats} />
                <div className="px-12 md:px-18 lg:px-26 xl:px-42 py-2">
                    <div className="bg-white px-8 border-1 shadow-xs">
                        <CustomerDetails
                            seatNmb={seats.length > 0 ? seats[0] : null}
                            deleteHandler={deleteHandler}
                            isMain={true}
                            handler={addPassenger}
                        />
                        {seats.slice(1).map((seatNumber, index) => (
                            <CustomerDetails
                                key={index}
                                seatNmb={seatNumber}
                                deleteHandler={deleteHandler}
                                handler={addPassenger}
                            />
                        ))}
                    </div>

                </div>

                <div className="px-12 md:px-18 lg:px-26 xl:px-42 py-2 bg-white mt-4">
                    <div className="w-full flex justify-between items-center p-4 rounded-lg">


                        <span className="text-gray-800 font-medium">
                            با کلیک روی تایید و ادامه خرید با قوانین سایت و قوانین اتوبوسرانی موافقت کرده‌اید.
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
