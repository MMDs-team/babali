import InputNav from "@/components/InputNav";
import TravelSample from "@/components/TravelSample";


export default function BusTicketPage() {
    return (
        <main className="mt-15 w-full">
            <InputNav />
            <div className="w-full bg-gray-100 p-4 pt-8 flex flex-col gap-3">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(each => (
                    <TravelSample
                        key={each}
                        price={520000}
                        origin="تهران"
                        destination="شیراز"
                        company="همسفر چابکسواران پایانه بیهقی"
                        remainingSeats={3}
                        departureTime='00:30'
                        originTerminal='پایانه بیهقی'
                        destinationTerminal='پایانه کاوه'
                        busType='Scania vip 2+1'
                    />

                ))}

            </div>

        </main>
    );
}
