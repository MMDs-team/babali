import React from 'react'

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const BirthDateInput = () => {
    return (
        <div className='flex h-full'>
            <Select>
                <SelectTrigger className="rounded-none">
                    <SelectValue placeholder="روز" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup className='h-50'>
                        <SelectLabel>روز</SelectLabel>
                        {Array.from({ length: 31 }, (_, idx) => (
                            <SelectItem key={idx} value={(idx + 1).toString()}>
                                {idx + 1}
                            </SelectItem>

                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>

            <Select>
                <SelectTrigger className="rounded-none">
                    <SelectValue placeholder="ماه" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup className='h-50'>
                        <SelectLabel>روز</SelectLabel>
                        {Array.from({ length: 12 }, (_, idx) => (
                            <SelectItem key={idx} value={(idx + 1).toString()}>
                                {idx + 1}
                            </SelectItem>

                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>

            <Select>
                <SelectTrigger className="rounded-none">
                    <SelectValue placeholder="سال" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup className='h-50'>
                        <SelectLabel>روز</SelectLabel>
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