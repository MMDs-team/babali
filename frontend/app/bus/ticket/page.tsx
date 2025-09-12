"use client";

import { Suspense } from "react";
import TicketDetailsPage from "./TicketDetailsPageClient";

export default function Page() {
    return (
        <Suspense fallback={<div className="p-6 text-center text-gray-500">در حال بارگذاری...</div>}>
            <TicketDetailsPage />
        </Suspense>
    );
}
