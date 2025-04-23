import BusTicketView from "@/components/BusTicketView";
import ProgressStepSection from "@/components/ProgressStepSection";

export default function BusTicketPage() {

    return (
        <main className="mt-15 w-full">
            <div className="w-full">
                <ProgressStepSection step={2}/>
            <BusTicketView />
            </div>

        </main>
    );
}
