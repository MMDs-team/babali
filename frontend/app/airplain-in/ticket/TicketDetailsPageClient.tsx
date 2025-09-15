"use client";

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

const BACKEND_HOST = process.env.NEXT_PUBLIC_BACKEND_HOST || 'localhost';
const BACKEND_PORT = process.env.NEXT_PUBLIC_BACKEND_PORT || '8000';

const PRINTER_HOST = process.env.NEXT_PUBLIC_PRINTER_HOST || 'localhost';
const PRINTER_PORT = process.env.NEXT_PUBLIC_PRINTER_PORT || '9000';

export default function TicketDetailsPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const serial = searchParams.get('serial');
    const [travelInfo, setTravelInfo] = useState<any>([]);
    const [vehicle, setVehicle] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const step = 4;

    function splitDateTime(dateTimeStr: string): [string, string] {
        const dateObj = new Date(dateTimeStr);
        const date = dateObj.toLocaleDateString('fa-IR');
        const time = dateObj.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
        return [date, time];
    }

    useEffect(() => {
        if (!serial) return;

        const fetchTicket = async () => {
            try {
                const res = await fetch(`http://${BACKEND_HOST}:${BACKEND_PORT}/api/flight/tickets/?serial=${serial}`);
                const vehicleRes = await fetch(`http://${BACKEND_HOST}:${BACKEND_PORT}/api/flight/travels/?serial=${serial}`);
                if (!res.ok || !vehicleRes.ok) throw new Error(`HTTP error!`);

                const ticketSummary = await res.json();
                const vehicleSummary = await vehicleRes.json();

                setTravelInfo(ticketSummary);
                setVehicle(vehicleSummary[0]);
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

            const pdfPath = await fetch(`http://${BACKEND_HOST}:${BACKEND_PORT}/api/flight/tickets/print/`, {
                method: 'POST',
                body: formData,
            });

            if (!pdfPath.ok) throw new Error('Failed to get file path');

            const data = await pdfPath.json(); 
            const filePath = data.path;
            
            const fileResponse = await fetch(`http://${PRINTER_HOST}:${PRINTER_PORT}/api/download_ticket?path=${encodeURIComponent(filePath)}`);
            if (!fileResponse.ok) throw new Error('Failed to fetch the ticket file');

            const blob = await fileResponse.blob(); 
            const downloadUrl = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = 'ticket.pdf'; 
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(downloadUrl);

        } catch (err) {
            console.error('Error downloading ticket:', err);
            alert('دانلود بلیط انجام نشد.');
        }
    };

    if (loading) return <div className="p-6 text-center text-gray-500">در حال بارگذاری اطلاعات بلیط...</div>;
    if (!vehicle) return <div className="p-6 text-center text-red-500">اطلاعاتی یافت نشد.</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <ProgressStepSection step={step} />
            <div className='px-4 lg:px-26 xl:px-42 py-2 mt-4 bg-accent pt-20'>
                <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xs p-6">
                    <h1 className="text-xl font-bold mb-6 text-center text-gray-400">جزئیات بلیط</h1>
                    <p className="font-bold mb-6 text-center">کد پیگیری {serial}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="p-4 bg-amber-50 rounded-xs shadow-sm">
                            <p className="text-gray-600"><strong>مبداء:</strong> {vehicle.origin}</p>
                            <p className="text-gray-600"><strong>ساعت حرکت:</strong> {splitDateTime(vehicle.date_time)[1]}</p>
                        </div>
                        <div className="p-4 bg-amber-50 rounded-xs shadow-sm">
                            <p className="text-gray-600"><strong>مقصد:</strong> {vehicle.dest}</p>
                            <p className="text-gray-600"><strong>تاریخ:</strong> {splitDateTime(vehicle.date_time)[0]}</p>
                        </div>
                    </div>

                    <h2 className="text-xl font-semibold mb-4 text-gray-700">مسافرین</h2>
                    <div className="overflow-x-auto border rounded-xs shadow-sm">
                        <Table className="">
                            <TableHeader className="bg-amber-100">
                                <TableRow>
                                    <TableHead className="text-right">نام و نام خانوادگی</TableHead>
                                    <TableHead className="text-center">شماره صندلی</TableHead>
                                    <TableHead className="text-center">شماره بلیط</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {travelInfo.map((p: any, idx: number) => (
                                    <TableRow key={idx} className="hover:bg-amber-50">
                                        <TableCell className="text-right">{p.first_name} {p.last_name}</TableCell>
                                        <TableCell className="text-center">{p.seat_no}</TableCell>
                                        <TableCell className="text-center">{p.ticket_id}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex justify-center gap-4 mt-6">
                        <button
                            className="px-6 py-2 bg-blue-500 text-white rounded-xs hover:bg-blue-600 transition"
                            onClick={handleDownloadTicket}
                        >
                            دانلود بلیط
                        </button>
                        <button
                            className="px-6 py-2 bg-gray-400 text-white rounded-xs hover:bg-gray-500 transition"
                            onClick={() => router.push('/fligt-ticket')}
                        >
                            بازگشت
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}