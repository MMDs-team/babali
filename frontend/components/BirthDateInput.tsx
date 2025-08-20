import React, { useState, useEffect } from 'react'

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const BirthDateInput = ({ onChange }: { onChange: (value: { day: string; month: string; year: string }) => void }) => {

    const [day, setDay] = useState<string>('');
    const [month, setMonth] = useState<string>('');
    const [year, setYear] = useState<string>('');

    // Call onChange when all parts are selected
    useEffect(() => {
        if (day && month && year) {
            onChange({ day, month, year });
        }
    }, [day, month, year]);

    return (
        <div className='flex h-full space-x-2'>
            {/* Day Select */}
            <Select onValueChange={(val) => setDay(val)}>
                <SelectTrigger className="rounded-none w-20">
                    <SelectValue placeholder="روز" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>روز</SelectLabel>
                        {Array.from({ length: 31 }, (_, idx) => (
                            <SelectItem key={idx} value={(idx + 1).toString()}>
                                {idx + 1}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>

            {/* Month Select */}
            <Select onValueChange={(val) => setMonth(val)}>
                <SelectTrigger className="rounded-none w-20">
                    <SelectValue placeholder="ماه" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>ماه</SelectLabel>
                        {Array.from({ length: 12 }, (_, idx) => (
                            <SelectItem key={idx} value={(idx + 1).toString()}>
                                {idx + 1}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>

            {/* Year Select */}
            <Select onValueChange={(val) => setYear(val)}>
                <SelectTrigger className="rounded-none w-24">
                    <SelectValue placeholder="سال" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>سال</SelectLabel>
                        {Array.from({ length: 104 }, (_, idx) => idx + 1301)
                            .reverse()
                            .map((value) => (
                                <SelectItem key={value} value={value.toString()}>
                                    {value}
                                </SelectItem>
                            ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}

export default BirthDateInput
