import { DatePicker } from "@/components/DatePicker";
import SourceTargetCity from "@/components/SourceTargetCity";
import TravelSample from "@/components/TravelSample";
import { Button } from "@/components/ui/button";


export default function BusTicketPage() {
    return (
        <main className="mt-15 w-full">
            <div className="w-full">
                <div className="flex gap-2 border-1 border-t-0 px-12 md:px-18 lg:px-26 xl:px-42  py-8">
                    <div className="flex items-center flex-col">
                        <svg viewBox="0 0 24 24" width="26px" height="26px" fill="currentColor" className="a-steppers__icon text-success-400"><path d="m17.726 9.74-6.805 6.805a1.122 1.122 0 0 1-1.591 0l-3.75-3.75a1.124 1.124 0 1 1 1.59-1.59l2.955 2.954 6.01-6.01a1.124 1.124 0 1 1 1.591 1.59ZM12 1.5C6.21 1.5 1.5 6.21 1.5 12S6.21 22.5 12 22.5 22.5 17.79 22.5 12 17.79 1.5 12 1.5Z"></path></svg>
                        انتخاب اتوبوس
                    </div>
                </div>
            </div>
            
        </main>
    );
}
