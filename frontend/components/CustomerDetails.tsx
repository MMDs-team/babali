'use client'
import React, { useEffect, useState } from 'react'
import FloatingInput from './FloatingInput'
import GendarSelectInput from './GendarSelectInput';
import BirthDateInput from './BirthDateInput';

type CustomerDetailsProps = {
    isMain?: boolean;
    seatNmb: number | null;
    deleteHandler: (seatNmb: number | null) => void;
    handler: (newPassenger: any) => void;
};

const CustomerDetails: React.FC<CustomerDetailsProps> = ({
    isMain = false,
    seatNmb,
    deleteHandler,
    handler
}) => {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [gender, setGender] = useState("M");
    const [SSR, setSSR] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [phone, setPhone] = useState('');

    const handleSSR = (e: React.ChangeEvent<HTMLInputElement>) => {
        let inputValue = e.target.value;
        const filteredValue = inputValue.replace(/\D/g, '');
        const limitedValue = filteredValue.substring(0, 10);
        setSSR(limitedValue);
    };

    const handlePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        let inputValue = e.target.value;
        const filteredValue = inputValue.replace(/\D/g, '');
        const limitedValue = filteredValue.substring(0, 12);
        setPhone(limitedValue);
    };

    useEffect(() => {
        handler({ firstName, lastName, gender, SSR, birthDate, phone, seatNumber: seatNmb });
    }, [firstName, lastName, gender, SSR, birthDate, phone])

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
            <div className="flex gap-2">
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
            <div className='flex pt-4 gap-2 items-center'>
                <BirthDateInput />

                {isMain && <FloatingInput
                    id="phone"
                    label="تلفن همراه"
                    value={phone}
                    patern="^0?9\d{9}$"
                    className='w-70'
                    onChange={handlePhone}
                />}
            </div>
        </div>
    )
}

export default CustomerDetails