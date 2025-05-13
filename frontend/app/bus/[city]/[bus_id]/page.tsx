'use client'
import BusSeatChose from "@/components/BusSeatChose";
import BusTicketView from "@/components/BusTicketView";
import CustomerDetails from "@/components/CustomerDetails";
import ProgressStepSection from "@/components/ProgressStepSection";
import { useState } from "react";

export default function BusTicketPage() {

    const [seats, setSeats] = useState<number[]>([]);
    
    const deleteHandler = (seatNmb: number | null) => {
        setSeats(prevSeats => prevSeats.filter(seat => seat !== seatNmb));
    };


    return (
        <main className="mt-15 w-full bg-gray-100 pb-14">
            <div className="w-full">
                <ProgressStepSection step={2} />
                <BusTicketView />
                <BusSeatChose selectedSeats={seats} setSelectedSeats={setSeats} />
                <div className="px-12 md:px-18 lg:px-26 xl:px-42 py-2">
                    <div className="bg-white px-8 border-1 shadow-xs">
                        <CustomerDetails seatNmb={seats.length > 0 ? seats[0] : null} deleteHandler={deleteHandler} isMain={true} />
                        {seats.slice(1).map((seatNumber, index) => (
                            <CustomerDetails
                                key={index}
                                seatNmb={seatNumber}
                                deleteHandler={deleteHandler}
                            />
                        ))}
                    </div>

                </div>
            </div>

        </main>
    );
}
