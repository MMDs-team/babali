import { DatePicker } from "@/components/DatePicker";
import SourceTargetCity from "@/components/SourceTargetCity";
import { Button } from "@/components/ui/button";


export default function BusTicketPage() {
    return (
        <main className="px-12 md:px-18 lg:px-26 xl:px-42 w-full">
            <div className="w-full">
                <div className="flex gap-2 border-1 border-t-0 px-4 py-8">
                    <SourceTargetCity className='flex-5'/>
                    <DatePicker className='flex-3' />
                    <Button className="flex-1 h-auto bg-amber-400 text-black hover:bg-amber-500">
                        جستجو
                    </Button>
                </div>
            </div>

        </main>
    );
}
