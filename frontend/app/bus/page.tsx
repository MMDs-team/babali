import { DatePicker } from "@/components/DatePicker";
import SourceTargetCity from "@/components/SourceTargetCity";
import TravelSample from "@/components/TravelSample";
import { Button } from "@/components/ui/button";


export default function BusTicketPage() {
    return (
        <main className="mt-15 w-full">
            <div className="w-full shadow-md">
                <div className="flex gap-2 border-1 border-t-0 px-12 md:px-18 lg:px-26 xl:px-42  py-8">
                    <SourceTargetCity className='flex-5' />
                    <DatePicker className='flex-3' />
                    <Button className="flex-1 h-auto bg-amber-400 text-black hover:bg-amber-500">
                        جستجو
                    </Button>
                </div>
            </div>
            <div className="h-200 w-full bg-gray-100 p-4 flex flex-col gap-3">
                <TravelSample
                    price={540000}
                    origin="تهران"
                    destination="شیراز"
                    company="همسفر چابکسواران پایانه بیهقی"
                    remainingSeats={3}
                    departureTime='00:30'
                    originTerminal='پایانه بیهقی'
                    destinationTerminal='پایانه کاوه'
                    busType='Scania vip 2+1'
                />

                <TravelSample
                    price={550000}
                    origin="تهران"
                    destination="شیراز"
                    company="همسفر چابکسواران پایانه بیهقی"
                    remainingSeats={12}
                    departureTime='00:30'
                    originTerminal='پایانه بیهقی'
                    destinationTerminal='پایانه کاوه'
                    busType='مان VIP (کاوه)'
                />

                <TravelSample
                    price={500000}
                    origin="تهران"
                    destination="شیراز"
                    company="همسفر چابکسواران پایانه بیهقی"
                    remainingSeats={19}
                    departureTime='00:30'
                    originTerminal='پایانه بیهقی'
                    destinationTerminal='پایانه کاوه'
                    busType='Scania vip 2+1'
                />
            </div>

        </main>
    );
}
