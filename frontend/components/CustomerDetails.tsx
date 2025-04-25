'use client'
import React, { useState } from 'react'
import FloatingInput from './FloatingInput'
import GendarSelectInput from './GendarSelectInput';
import BirthDateInput from './BirthDateInput';

const CustomerDetails = () => {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [gender, setGender] = useState("M");
    const [SSR, setSSR] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [phone, setPhone] = useState('');

    return (
        <div className='px-12 md:px-18 lg:px-26 xl:px-42 py-8'>
            <div className='w-full border-1 shadow-xs p-4 md:px-6 px-4 bg-white'>
                <form className="flex gap-2">
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
                        patern="^\d{10}$"
                        onChange={(e) => setSSR(e.target.value)}
                    />
                </form>
                <form className='flex pt-4'>
                    <BirthDateInput />
                    <FloatingInput
                        id="ssr"
                        label="کدملی"
                        value={phone}
                        patern="^\d{10}$"
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </form>
            </div>
        </div>
    )
}

export default CustomerDetails