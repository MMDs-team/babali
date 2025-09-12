'use client'
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import InputNav from "@/components/InputNav";
import TrainTravelSample from "@/components/TrainTravelSample";
import { useTravel } from "@/contexts/TravelContext";


const HOST = process.env.NEXT_PUBLIC_BACKEND_HOST;
const PORT = process.env.NEXT_PUBLIC_BACKEND_PORT;


export default function TrainTicketPage() {

    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [sourceCity, setSourceCity] = useState<string>("");
    const [targetCity, setTargetCity] = useState<string>("");
    const [travelDate, setTravelDate] = useState<string>("");
    const [passCnt, setPassCnt] = useState<number>(1);
    const [travels, setTravels] = useState<any[]>([]);

    const {setTravelDetails} = useTravel();


    useEffect(() => {
        if (!pathname) return;

        const match = pathname.match(/\/train\/([^/]+)-([^/]+)/);
        if (match) {
            setSourceCity(decodeURIComponent(match[1]));
            setTargetCity(decodeURIComponent(match[2]));
        }

        const dateParam = searchParams?.get("date");
        const passegnerCount = searchParams?.get("count");

        if (dateParam) setTravelDate(dateParam);
        if (passegnerCount) setPassCnt(Number(passegnerCount));
    }, [pathname, searchParams]);

    useEffect(() => {
        if (!sourceCity || !targetCity || !travelDate || !passCnt) return;

        const fetchTravels = async () => {
            try {
                const url = `http://${HOST}:${PORT}/api/train/travels/?origin=${encodeURIComponent(
                    sourceCity
                )}&destination=${encodeURIComponent(targetCity)}&date=${travelDate}`;

                const res = await fetch(url);
                if (!res.ok) throw new Error("Failed to fetch travels");

                const data = await res.json();
                console.log(data)
                setTravels(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchTravels();
        setTravelDetails({passCnt: passCnt});

    }, [sourceCity, targetCity, travelDate, passCnt]);

    return (
        <main className="m-0 lg:mt-15 w-full min-h-dvh">
            <InputNav />
            <div className="w-full bg-gray-100 p-4 pt-8 flex flex-col gap-3 min-h-dvh">

                {travels.length > 0 ? (
                    travels.map((each, index) => (
                        <TrainTravelSample
                            key={index}
                            travel={each}
                        />
                    ))
                ) : (

                    <div className="flex flex-col items-center justify-center mt-12 p-6 bg-gray-100 rounded-lg border border-gray-200">
                        <svg
                            className="w-12 h-full text-gray-400 mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6h6v6m-3-12a9 9 0 100 18 9 9 0 000-18z" />
                        </svg>
                        <p className="text-gray-500 text-lg font-medium">هیچ سفری پیدا نشد.</p>
                    </div>

                )}

            </div>

        </main>
    );
}
