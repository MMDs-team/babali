'use client'
import CustomerDetails from "@/components/CustomerDetails";
import PlainTicketView from "@/components/PlainTicketView";
import ProgressStepSection from "@/components/ProgressStepSection";
import { Button } from "@/components/ui/button";
import { useTravel } from "@/contexts/TravelContext";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type PlainPassengers = {
    firstName: string,
    lastNAme: string,
    SSN: string,
    gender: 'M' | 'F',
    birthDate: Date,
    phone: string | null
    seatNumber: number
}
const API_URL_BACKEND = process.env.NEXT_PUBLIC_API_URL;

export default function PlainTicketPage() {

    const router = useRouter();
    const pathname = usePathname();

    const params = useParams();
    const flightID = params.plain_id;

    const [seats, setSeats] = useState<number[]>([1]);
    const [isLoading, setIsLoading] = useState(false);
    const [isPrivate, setIsPrivate] = useState(false);
    const { travelType, setTravelType, travelDetails, setTravelDetails, vehicleDetails, setVehicleDetails } = useTravel();
    const [passengers, setPassengers] = useState<PlainPassengers[]>([]);

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

    const addPassenger = (newPassenger: PlainPassengers, seatIndex: number) => {
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

    const sendRequest = async () => {
        try {
            setIsLoading(true);
            const API_URL = `${API_URL_BACKEND}/flight/travels/?id=${flightID}`;

            const res = await fetch(API_URL, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                throw new Error("Failed to get flight");
            }

            const data = await res.json();

            setVehicleDetails(data[0])

        } catch (error) {
            console.error("Error:", error);

        } finally {
            setIsLoading(false); // stop loading
        }
    }

    const goToConfirm = () => {
        router.push(`${pathname}/confirm`);
    };

    useEffect(() => {
        setTravelDetails((prev: any) => ({
            ...prev,
            passengers: passengers,
        }));
    }, [passengers, setTravelDetails, seats]);

    useEffect(() => {
        if (flightID && !vehicleDetails) sendRequest();
        if (travelDetails) setSeats(Array.from({ length: travelDetails['passCnt'] }, (_, i) => i + 1));

        if (travelType === 'airplain-in') return;
        setTravelType('airplain-in');
        setTravelDetails({ passCnt: 1 });
    }, []);


    return (
        <main className="lg:mt-15 w-full bg-gray-100">
            <div className="w-full">
                <ProgressStepSection step={1} />
                
                {vehicleDetails && <PlainTicketView plain={vehicleDetails} seatsCount={seats.length} />}


                <div className="px-4 lg:px-26 xl:px-42 py-2">
                    <div className="bg-white px-8 border-1 shadow-xs">
                        {vehicleDetails && <>
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
                        </>}
                    </div>

                    <Button
                        className="bg-white border-2 border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-600 rounded-sm mt-4"
                        onClick={() => increasePassengerCnt()}
                    >
                        + اضافه کردن مسافر جدید
                    </Button>


                </div>

                <div className="px-4 lg:px-26 xl:px-42 py-2 bg-white mt-4">
                    <div className="w-full flex justify-between items-center p-4 rounded-lg">


                        <span className="text-gray-800 font-medium">
                            با کلیک روی تایید و ادامه خرید با قوانین سایت و قوانین پرواز موافقت کرده‌اید.
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
