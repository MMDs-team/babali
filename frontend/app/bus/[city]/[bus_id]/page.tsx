'use client'
import BusSeatChose from "@/components/BusSeatChose";
import BusTicketView from "@/components/BusTicketView";
import CustomerDetails from "@/components/CustomerDetails";
import ProgressStepSection from "@/components/ProgressStepSection";
import { useTravel } from "@/contexts/TravelContext";
import { useParams, usePathname, useRouter } from "next/navigation";
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

const HOST = process.env.NEXT_PUBLIC_BACKEND_HOST;
const PORT = process.env.NEXT_PUBLIC_BACKEND_PORT;

export default function BusTicketPage() {

    const router = useRouter();
    const pathname = usePathname();

    const params = useParams();
    const busID = params.bus_id;

    const [seats, setSeats] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const { travelType, setTravelType, setTravelDetails, vehicleDetails, setVehicleDetails } = useTravel();
    const [passengers, setPassengers] = useState<BusPassenger[]>([]);

    const deleteHandler = (seatNumber: number | null) => {
        if (seatNumber === null) return;

        setSeats(prev => {
            const updatedSeats = prev.filter(seat => seat !== seatNumber);

            // Reassign passengers to remaining seats
            setPassengers(prevPassengers => {
                if (updatedSeats.length === 0) return prevPassengers; // keep passengers if no seats
                // Remove passenger for the deleted seat
                const newPassengers = prevPassengers.filter(p => p.seatNumber !== seatNumber);

                // Reassign seat numbers based on updatedSeats
                for (let i = 0; i < newPassengers.length; i++) {
                    newPassengers[i] = { ...newPassengers[i], seatNumber: updatedSeats[i] };
                }
                return newPassengers;
            });

            return updatedSeats;
        });
    };

    const addPassenger = (newPassenger: BusPassenger, seatIndex: number) => {
        setPassengers(prev => {
            let updated = [...prev];
            updated[seatIndex] = { ...newPassenger, seatNumber: seats[seatIndex] };

            // Ensure the array has enough slots
            if (seats.length !== 0) {
                const newPassengers = updated.slice(0, seats.length);
                for (let i = 0; i < newPassengers.length; i++) {
                    newPassengers[i] = { ...newPassengers[i], seatNumber: seats[i] }
                }
                updated = newPassengers;
            }
            return updated;
        });
    };

    const sendRequest = async () => {
        try {
            setIsLoading(true);
            const API_URL = `http://${HOST}:${PORT}/api/bus/travels/?id=${busID}`;

            const res = await fetch(API_URL, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                throw new Error("Failed to get bus");
            }

            const data = await res.json();

            console.log('data', data[0])
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
    }, [passengers, setTravelDetails]);

    useEffect(() => {
        if (busID && !vehicleDetails) sendRequest();
        if (travelType === 'bus') return;
        setTravelType('bus');
        setTravelDetails({});
    }, []);

    return (
        <main className="lg:mt-15 w-full bg-gray-100">
            <div className="w-full">
                <ProgressStepSection step={1} />
                {vehicleDetails &&
                    <>
                        <BusTicketView bus={vehicleDetails} seatsCount={seats.length} />
                        <BusSeatChose
                            selectedSeats={seats}
                            setSelectedSeats={setSeats}
                            busSeat={vehicleDetails.seat_stat}
                        />
                        <div className="px-4 lg:px-26 xl:px-42 py-2">
                            <div className="bg-white px-8 border-1 shadow-xs">
                                <CustomerDetails
                                    passenger={passengers.length !== 0 ? passengers[0] : null}
                                    seatNmb={seats.length > 0 ? seats[0] : null}
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

                        </div>
                    </>
                }

                <div className="px-4 font-sm lg:px-26 xl:px-42 py-2 bg-white mt-4">
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
