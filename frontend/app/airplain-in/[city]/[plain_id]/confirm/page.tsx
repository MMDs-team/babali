'use client';
import React, { useEffect, useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import ProgressStepSection from '@/components/ProgressStepSection';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, PencilIcon } from 'lucide-react';
import { useTravel } from '@/contexts/TravelContext';
import PaymentModal from '@/components/PaymentModal';


const HOST = process.env.NEXT_PUBLIC_API_HOST;
const PORT = process.env.NEXT_PUBLIC_API_PORT;

export default function OrderConfirmationPage() {

    const router = useRouter();
    const pathname = usePathname()

    const params = useParams();
    const busID = params.bus_id;

    const { travelType, travelDetails, vehicleDetails } = useTravel();

    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [step, setStep] = useState(2);
    const [ReserveData, setReserveData] = useState<any>({});


    const persianDate = (date_time: string) => {
        const date = new Date(date_time);
        return date.toLocaleDateString("fa-IR", {
            weekday: "long",
            day: "numeric",
            month: "long",
        });
    }

    const totalPrice = () => vehicleDetails.price * travelDetails.passengers.length;

    const ticketInfo = () => [
        { label: "مبدا", value: vehicleDetails.origin },
        { label: "مقصد", value: vehicleDetails.dest },
        { label: "تاریخ و ساعت حرکت", value: `${persianDate(vehicleDetails.date_time)} ${vehicleDetails.date_time.split("T")[1].substring(0, 5)}` },
        { label: "شرکت ریلی	", value: vehicleDetails.flight_agency },
        { label: "نوع پرواز", value: vehicleDetails.flight_type },
        { label: "کلاس پرواز", value: vehicleDetails.flight_class },
        { label: "قیمت هر صندلی", value: `${vehicleDetails.price} تومان` },
        { label: "مبلغ کل", value: `${totalPrice} تومان` },
    ];

    const editPassengers = () => {
        const newPath = pathname.slice(0, -"/confirm".length);
        router.push(newPath);
    }

    const formatBirthDate = (birthDate: { day: string; month: string; year: string }): string => {
        return `${birthDate.year}-${birthDate.month.padStart(2, "0")}-${birthDate.day.padStart(2, "0")}`;
    }

    const sendRequest = async () => {
        try {
            setIsLoading(true);
            const API_URL = `http://${HOST}:${PORT}/api/flight/tickets/bulk_create/`;

            const passengers: any = travelDetails.passengers.map((p: any) => ({
                user: travelDetails.passengers[0].phone,
                travel: vehicleDetails.travel_id,
                first_name: p.firstName,
                last_name: p.lastName,
                gender: p.gender === "M" ? 1 : 0,
                birth_date: formatBirthDate(p.birthDate),
                ssn: p.SSN
            }));

            const res = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(passengers),
            });

            if (!res.ok) {
                throw new Error("Failed to reserve tickets");
            }

            const data = await res.json();
            setReserveData(data);
            console.log("Tickets reserved:", data);
            setIsModalOpen(true);
            setStep(3);

        } catch (error) {
            console.error("Error:", error);

            // go back
            if (pathname.endsWith("/confirm")) {
                router.replace(pathname.replace("/confirm", ""));
            }
        } finally {
            setIsLoading(false); // stop loading
        }
    };

    const handlePay = async () => {
        try {
            const API_URL = `http://${HOST}:${PORT}/api/flight/tickets/verify/?serial=${ReserveData[0].serial}&status=OK`;

            const response = await fetch(API_URL, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Payment verification result:', data);

            // Close the modal
            setIsModalOpen(false);

            // Optionally show a success message
            alert("Payment verified successfully!");
            router.push(`/airplain-in/ticket?serial=${ReserveData[0].serial}`)
        } catch (error) {
            console.error('Error verifying payment:', error);
            alert("Payment verification failed!");
        }
    };



    useEffect(() => {
        if (!vehicleDetails && busID) {
            const segments = pathname.split('/');
            segments.pop(); // remove "confirm"
            const parentPath = segments.join('/') || '/';
            router.push(parentPath);
        }
        if (travelType !== 'airplain-in') {
            router.push(`/`);
        }
    }, [])

    return (
        <div>
            <ProgressStepSection step={step} />
            <div className="px-12 md:px-18 lg:px-26 xl:px-42 py-2 mt-4 bg-accent pt-20">
                {vehicleDetails &&
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

                        <div className="md:col-span-2">
                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                                <div className="flex items-center bg-gray-50 p-4 border-b border-gray-200">
                                    <TicketIcon />
                                    <h2 className="text-lg font-bold text-gray-800">اطلاعات بلیط</h2>
                                </div>
                                <div className="p-6 grid grid-cols-[1fr_3fr] text-sm">
                                    {ticketInfo().map((item, index) => (
                                        <React.Fragment key={index}>
                                            <div className="bg-secondary text-gray-600 text-right p-2 border border-gray-200 ">
                                                {item.label}
                                            </div>
                                            <div className="text-gray-800 font-medium text-center p-2  border border-gray-200">
                                                {item.value}
                                            </div>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>

                            <PaymentModal
                                isOpen={isModalOpen}
                                onClose={() => {
                                    setIsModalOpen(false);
                                    setStep(2);
                                }}
                                onPay={handlePay}
                            />



                            {/* Passenger Details Card */}
                            <Card className="w-full rounded-xl shadow-md px-2 mt-4">
                                <CardHeader className="bg-gray-white p-4 rounded-t-xl flex flex-row items-center justify-between">
                                    <CardTitle className="text-right text-xl font-bold text-gray-800">
                                        مشخصات سرپرست مسافران
                                    </CardTitle>
                                    <Button
                                        variant="outline"
                                        className="flex items-center space-x-2 text-blue-600 border-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors duration-200"
                                        onClick={() => editPassengers()}
                                    >
                                        <PencilIcon className="h-4 w-4" />
                                        <span>ویرایش مسافران</span>
                                    </Button>
                                </CardHeader>
                                <CardContent className="px-4">
                                    <div className="overflow-x-auto">
                                        <Table className="min-w-full divide-y divide-gray-200">
                                            <TableHeader>
                                                <TableRow className="bg-gray-50">
                                                    <TableHead className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        نام و نام خانوادگی
                                                    </TableHead>
                                                    <TableHead className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        جنسیت
                                                    </TableHead>
                                                    <TableHead className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        تاریخ تولد
                                                    </TableHead>
                                                    <TableHead className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        شماره همراه
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody className="bg-white divide-y divide-gray-200">
                                                {travelDetails?.passengers.map((passenger: any, index: any) => (
                                                    <TableRow key={index} className="hover:bg-gray-50">
                                                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                                                            {`${passenger.firstName} ${passenger.lastName}`}
                                                        </TableCell>
                                                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                                            {passenger.gender === 'M' ? 'مرد' : 'زن'}
                                                        </TableCell>
                                                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                                            {passenger.birthDate.year}-{passenger.birthDate.month}-{passenger.birthDate.day}
                                                        </TableCell>
                                                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                                            {passenger.phone ? passenger.phone : '-'}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>

                        </div>
                        <div className="md:col-span-1 bg-white border border-gray-200 rounded-lg p-6 shadow-sm fixed left-20">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-600 text-sm">مبلغ قابل پرداخت</span>
                                <span className="text-blue-600 text-xl font-bold whitespace-nowrap">{totalPrice} تومان</span>
                            </div>
                            <Button
                                className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition-colors"
                                onClick={() => sendRequest()}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        انتقال به سایت پرداخت
                                    </>
                                ) : (
                                    "پرداخت آنلاین"
                                )}
                            </Button>
                        </div>
                    </div>
                }

            </div>
        </div>
    );
}



const TicketIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ml-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-6h-3m-3 0h3m-2.25 0h.375a1.125 1.125 0 0 1 1.125 1.125v3.25c0 .621.504 1.125 1.125 1.125h9.75a1.125 1.125 0 0 0 1.125-1.125v-3.25c0-.621-.504-1.125-1.125-1.125H16.5m-15 0H5.25A2.25 2.25 0 0 0 7.5 12h9a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 16.5 4.5H5.25A2.25 2.25 0 0 0 3 6.75v4.5Zm0 0-1.426.356A2.25 2.25 0 0 0 1 11.125v4.25a2.25 2.25 0 0 0 2.25 2.25h1.353M15 15h3m-3 0h3m-3 0h3m-2.25 0h.375a1.125 1.125 0 0 1 1.125 1.125v3.25c0 .621.504 1.125 1.125 1.125h9.75a1.125 1.125 0 0 0 1.125-1.125v-3.25c0-.621-.504-1.125-1.125-1.125H16.5m-15 0H5.25A2.25 2.25 0 0 0 7.5 12h9a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 16.5 4.5H5.25A2.25 2.25 0 0 0 3 6.75v4.5Zm0 0-1.426.356A2.25 2.25 0 0 0 1 11.125v4.25a2.25 2.25 0 0 0 2.25 2.25h1.353" />
    </svg>
);
