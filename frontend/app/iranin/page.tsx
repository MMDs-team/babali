'use client'
import { DatePicker } from "@/components/DatePicker";
import FAQAccordion from "@/components/FAQAccordion";
import MobileDrawerPage from "@/components/MobileDrawerPage";
import PassengerSelector from "@/components/PassengerCountSelect";
import SearchButton from "@/components/SearchButton";
import SourceTargetCity from "@/components/SourceTargetCity";
import { flightFaq } from "@/constants/FAQData";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AirplainPage() {

    const router = useRouter();

    const [sourceCity, setSourceCity] = useState<string>('');
    const [targetCity, setTargetCity] = useState<string>('');
    const [totalPassengerCount, setTotalPassengerCount] = useState([1, 0, 0]);
    const [date, setDate] = useState<Date>(new Date());

    const formatCity = (city: string) => city.replace(/\s+/g, "_");

    function formatLocalDate(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    const searchTravel = async () => {
        if (!sourceCity || !targetCity || !date) return;

        const formattedDate = formatLocalDate(date);
        const totalCnt = totalPassengerCount[0] + totalPassengerCount[1] + totalPassengerCount[2];

        router.push(`/airplain-in/${formatCity(sourceCity)}-${formatCity(targetCity)}?date=${formattedDate}&count=${totalCnt}&pass=${totalPassengerCount[0]}-${totalPassengerCount[1]}-${totalPassengerCount[2]}`);
    };


    return (
        <main className="px-12 md:px-18 lg:px-26 xl:px-42 w-full">
            <div className="hidden lg:block w-full">
                <div className="flex gap-2 border-1 border-t-0 px-4 py-8">
                    <SourceTargetCity
                        className='flex-5'
                        sourceCity={sourceCity}
                        targetCity={targetCity}
                        setSourceCity={setSourceCity}
                        setTargetCity={setTargetCity}
                    />
                    <DatePicker className='flex-3' date={date} setDate={setDate} />
                    <PassengerSelector
                        totalPassengerCount={totalPassengerCount}
                        setTotalPassengerCount={setTotalPassengerCount}
                    />

                    <SearchButton onSearch={async () => await searchTravel()} />
                </div>
            </div>

            <FAQAccordion data={flightFaq} />

            <MobileDrawerPage>
                <SourceTargetCity
                    className='flex-5'
                    sourceCity={sourceCity}
                    targetCity={targetCity}
                    setSourceCity={setSourceCity}
                    setTargetCity={setTargetCity}
                />
                <DatePicker className='w-full my-4' date={date} setDate={setDate} />
                <PassengerSelector
                    totalPassengerCount={totalPassengerCount}
                    setTotalPassengerCount={setTotalPassengerCount}
                />

                <SearchButton onSearch={async () => await searchTravel()} />

                <FAQAccordion data={flightFaq} />
            </MobileDrawerPage>

        </main>
    );
}
