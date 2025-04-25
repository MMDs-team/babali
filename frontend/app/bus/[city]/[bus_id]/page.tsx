import BusSeatChose from "@/components/BusSeatChose";
import BusTicketView from "@/components/BusTicketView";
import CustomerDetails from "@/components/CustomerDetails";
import ProgressStepSection from "@/components/ProgressStepSection";

export default function BusTicketPage() {

    return (
        <main className="mt-15 w-full bg-gray-100">
            <div className="w-full">
                <ProgressStepSection step={2} />
                <BusTicketView />
                <BusSeatChose />
                <CustomerDetails />
            </div>

        </main>
    );
}
