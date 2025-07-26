'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import ProgressStepSection from '@/components/ProgressStepSection';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PencilIcon } from 'lucide-react'; 
import { useTravel } from '@/contexts/TravelContext';

interface Passenger {
    name: string;
    gender: string;
    dob: string;
    phone: string;
}

interface ConfirmPageProps {
    params: {
        order_id: string;
    };

    passengers: Passenger[]; 
}

export default function OrderConfirmationPage({ params, passengers }: ConfirmPageProps) {
    const { order_id } = useParams();

    const ticketInfo = [
        { label: "مبدا", value: "تهران پایانه بیهقی" },
        { label: "مقصد", value: "اصفهان پایانه کاوه" },
        { label: "تاریخ و ساعت حرکت", value: "یکشنبه 05 مرداد - 00:30" },
        { label: "شرکت مسافربری", value: "همسفر جاکسواران بیهقی" },
        { label: "نوع اتوبوس", value: "مان VIP (کاوه)" },
        { label: "تعداد صندلی", value: "1" },
        { label: "شماره صندلی(ها)", value: "14" },
        { label: "قیمت هر صندلی", value: "468,000 تومان" },
        { label: "مبلغ کل", value: "468,000 تومان" },
    ];

    const {travelDetails} = useTravel();

    return (
        <div>
            <ProgressStepSection step={2} />
            <div className="px-12 md:px-18 lg:px-26 xl:px-42 py-2 mt-4 bg-accent pt-20">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

                    <div className="md:col-span-2">
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                            <div className="flex items-center bg-gray-50 p-4 border-b border-gray-200">
                                <TicketIcon />
                                <h2 className="text-lg font-bold text-gray-800">اطلاعات بلیط</h2>
                            </div>
                            <div className="p-6 grid grid-cols-[1fr_3fr] text-sm">
                                {ticketInfo.map((item, index) => (
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



                        {/* Passenger Details Card */}
                        <Card className="w-full rounded-xl shadow-md px-2 mt-4">
                            <CardHeader className="bg-gray-white p-4 rounded-t-xl flex flex-row items-center justify-between">
                                <CardTitle className="text-right text-xl font-bold text-gray-800">
                                    مشخصات سرپرست مسافران
                                </CardTitle>
                                <Button variant="outline" className="flex items-center space-x-2 text-blue-600 border-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors duration-200">
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
                                            {travelDetails?.passengers.map((passenger:any, index:any) => (
                                                <TableRow key={index} className="hover:bg-gray-50">
                                                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                                                        {passenger.name}
                                                    </TableCell>
                                                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                                        {passenger.gender}
                                                    </TableCell>
                                                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                                        {passenger.dob}
                                                    </TableCell>
                                                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                                        {passenger.phone}
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
                            <span className="text-blue-600 text-xl font-bold whitespace-nowrap">468,000 تومان</span>
                        </div>
                        <button className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition-colors">
                            پرداخت آنلاین
                        </button>
                    </div>
                </div>


            </div>
        </div>
    );
}



const TicketIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ml-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-6h-3m-3 0h3m-2.25 0h.375a1.125 1.125 0 0 1 1.125 1.125v3.25c0 .621.504 1.125 1.125 1.125h9.75a1.125 1.125 0 0 0 1.125-1.125v-3.25c0-.621-.504-1.125-1.125-1.125H16.5m-15 0H5.25A2.25 2.25 0 0 0 7.5 12h9a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 16.5 4.5H5.25A2.25 2.25 0 0 0 3 6.75v4.5Zm0 0-1.426.356A2.25 2.25 0 0 0 1 11.125v4.25a2.25 2.25 0 0 0 2.25 2.25h1.353M15 15h3m-3 0h3m-3 0h3m-2.25 0h.375a1.125 1.125 0 0 1 1.125 1.125v3.25c0 .621.504 1.125 1.125 1.125h9.75a1.125 1.125 0 0 0 1.125-1.125v-3.25c0-.621-.504-1.125-1.125-1.125H16.5m-15 0H5.25A2.25 2.25 0 0 0 7.5 12h9a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 16.5 4.5H5.25A2.25 2.25 0 0 0 3 6.75v4.5Zm0 0-1.426.356A2.25 2.25 0 0 0 1 11.125v4.25a2.25 2.25 0 0 0 2.25 2.25h1.353" />
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
);

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14.25v4.875a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.125V12.75M10.5 10.5 5.25 5.25" />
    </svg>
);