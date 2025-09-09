'use client'
import React, { useEffect, useState } from 'react'
import FloatingInput from './FloatingInput'
import GendarSelectInput from './GendarSelectInput';
import BirthDateInput from './BirthDateInput';

type CustomerDetailsProps = {
    isMain?: boolean;
    seatNmb: number | null;
    passenger: any;
    deleteHandler: (seatNmb: number | null) => void;
    handler: (newPassenger: any, index: number) => void;
    idx: number
};

const CustomerDetails: React.FC<CustomerDetailsProps> = ({
    isMain = false,
    seatNmb,
    passenger,
    deleteHandler,
    handler,
    idx
}) => {

    const [firstName, setFirstName] = useState(passenger?.firstName ?? "");
    const [lastName, setLastName] = useState(passenger?.lastNAme ?? "");
    const [gender, setGender] = useState(passenger?.gender ?? 'M');
    const [SSR, setSSR] = useState(passenger?.SSR ?? "");
    const [birthDate, setBirthDate] = useState(passenger?.birthDate ?? {});
    const [phone, setPhone] = useState(passenger?.phone ?? "");

    const handleSSR = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        // Convert Persian digits to English
        value = convertPersianToEnglishDigits(value);

        // Optional: enforce pattern (only digits, max 10)
        value = value.replace(/\D/g, "").slice(0, 10);

        setSSR(value); // store in state as English digits
    };


    const handlePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        value = convertPersianToEnglishDigits(value);
        value = value.replace(/\D/g, "").slice(0, 11);
        setPhone(value);
    };

    const handleBirth = (date: { day: string; month: string; year: string }) => {
        setBirthDate(date);
    }

    const convertPersianToEnglishDigits = (str: string) => {
        return str.replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776));
    };


    useEffect(() => {
        handler({ firstName, lastName, gender, SSR, birthDate, phone, seatNumber: seatNmb }, idx);
    }, [firstName, lastName, gender, SSR, birthDate, phone])

    useEffect(() => {
        if (!passenger) return;
        setFirstName(passenger.firstName);
        setLastName(passenger.lastName)
        setGender(passenger.gender)
        setSSR(passenger.SSR)
        setBirthDate(passenger.birthDate)
        setPhone(passenger.phone)
    }, [passenger])

    return (
        <div className='w-full border-1 p-4 px-2 bg-white border-x-0 border-gray-200'>
            <div className='flex justify-between'>
                {seatNmb &&
                    <div className='border-1 rounded-2xl w-20 text-sm text-gray-400 border-gray-300 px-2 mb-4 bg-gray-50'>
                        صندلی
                        {' '}
                        {seatNmb}
                    </div>
                }
                {!isMain &&
                    <div className="flex text-red-400 items-start cursor-pointer" onClick={() => deleteHandler(seatNmb)}>
                        <div className='flex items-center'>

                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                <path d="M15.75 2.25a.75.75 0 0 1 .75.75v1.5h2.25a2.25 2.25 0 0 1 2.246 2.118L21 6.75c0 1-.652 1.848-1.555 2.14l-1.034 11.398c-.06 1.19-1.009 2.145-2.241 2.212l-8.378-.001c-1.195-.06-2.15-1.016-2.209-2.182L4.555 8.89A2.251 2.251 0 0 1 5.25 4.5H7.5V3a.75.75 0 0 1 .663-.745l.087-.005h7.5ZM17.929 9H6.069l1.01 11.212c.02.396.316.718.669.779L7.83 21l8.298.001c.425-.024.764-.364.788-.819L17.929 9Zm-3.679 2.25a.75.75 0 0 1 .745.662L15 12v6a.75.75 0 0 1-1.495.087L13.5 18v-6a.75.75 0 0 1 .75-.75Zm-4.5 0a.75.75 0 0 1 .745.662L10.5 12v6a.75.75 0 0 1-1.495.087L9 18v-6a.75.75 0 0 1 .75-.75Zm9-5.25H5.25a.75.75 0 0 0 0 1.5h13.5a.75.75 0 0 0 0-1.5ZM15 3.75H9v.75h6v-.75Z"></path>
                            </svg>
                            <span> حذف </span>
                        </div>
                    </div>
                }
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                <FloatingInput
                    id="firstName"
                    label="نام"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                <FloatingInput
                    id="lastName"
                    label="نام خانوادگی"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
                <GendarSelectInput
                    id="gender"
                    label="جنسیت"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                />
                <FloatingInput
                    id="ssr"
                    label="کدملی"
                    value={SSR}
                    patern='^\d{0,10}$'
                    onChange={handleSSR}
                />
            </div>
            <div className='flex flex-col lg:flex-row pt-4 gap-2 items-center'>
                <BirthDateInput className='w-full flex justify-center lg:w-auto' onChange={handleBirth} />

                {isMain && <FloatingInput
                    id="phone"
                    label="تلفن همراه"
                    value={phone}
                    patern="^0?9\d{9}$"
                    className='w-full lg:w-70'
                    onChange={handlePhone}
                />}
            </div>
        </div>
    )
}

export default CustomerDetails