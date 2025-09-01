'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProgressStepSection from '@/components/ProgressStepSection';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useTravel } from '@/contexts/TravelContext';

const HOST = process.env.NEXT_PUBLIC_API_HOST;
const PORT = process.env.NEXT_PUBLIC_API_PORT;

const TicketDetailsPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { busDetails, travelDetails } = useTravel();

    
    const serial = searchParams.get('serial');
    const [travelInfo, setTravelInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const dateTimeString = busDetails.date_time; 
    const dateObject = new Date(dateTimeString); 
    const time = dateObject.toLocaleTimeString();
    const date = dateObject.toDateString();
    const step = 4;

    useEffect(() => {
        console.log('hello')
        if (!serial) return;

        const fetchTicket = async () => {
            try {
                const res = await fetch(`http://${HOST}:${PORT}/api/bus/tickets/?serial=${serial}`);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const ticketSummary = await res.json();

                setTravelInfo(ticketSummary.travel_info);
            } catch (err) {
                console.error('Error fetching ticket details:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTicket();
    }, [serial]);

    const handleDownloadTicket = async () => {
        if (!serial) return;

        try {
            const formData = new FormData();
            formData.append('serial', serial);

            const res = await fetch(`http://${HOST}:${PORT}/api/bus/tickets/print/`, {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Failed to get PDF link');

            const data = await res.json();
            const pdfLink = data.tickets_pdf;

            // Trigger download
            const a = document.createElement('a');
            a.href = pdfLink;
            a.download = `ticket_serial_${serial}.pdf`;
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (err) {
            console.error('Error downloading ticket:', err);
            alert('Failed to download ticket.');
        }
    };

    // if (loading) return <div className="p-4">Loading ticket details...</div>;
    // if (!travelInfo) return <div className="p-4">No ticket details found.</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <ProgressStepSection step={step} />
            <div className='px-12 md:px-18 lg:px-26 xl:px-42 py-2 mt-4 bg-accent pt-20'>


                <div className="max-w-4xl mx-auto mt-6 p-6 bg-white shadow rounded-lg">
                    {/* Travel Details */}
                    <h1 className="text-2xl font-bold mb-4">Travel Details</h1>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <p><strong>مبداء:</strong> {busDetails.origin}</p>
                            <p><strong>ساعت حرکت:</strong>{time}</p>
                        </div>
                        <div>
                            <p><strong>مقصد:</strong> {busDetails.dest}</p>
                            <p><strong>تاریخ:</strong>{date}</p>
                        </div>
                        <div>
                            <p><strong>شماره اتوبوس:</strong>{busDetails.bus}</p>
                        </div>
                    </div>

                    {/* Passenger Table */}
                    <h2 className="text-xl font-semibold mb-2">مسافرین</h2>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>نام</TableHead>
                                <TableHead>شماره صندلی</TableHead>
                                <TableHead>شماره بلیط</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* {passengers.map((p, idx) => ( */}
                            {[1, 2, 3].map((p, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>p.name</TableCell>
                                    <TableCell>p.seat_number</TableCell>
                                    <TableCell>p.ticket_id</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <div className="flex gap-4 mt-6">
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={handleDownloadTicket}
                        >
                            Download Ticket
                        </button>
                        <button
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            onClick={() => router.push('/bus')}
                        >
                            Back to Bus List
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TicketDetailsPage;
