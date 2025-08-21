"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

type DatePickerProps = {
    className?: string;
    date: Date;
    setDate: React.Dispatch<React.SetStateAction<Date>>;
};

export function DatePicker({ className, date, setDate }: DatePickerProps) {

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        `w-[240px] justify-start text-left font-normal py-6 ${className}`,
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon />
                    {date ? format(date, "PPP") : <span>تاریخ حرکت</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="start"
                className="flex w-auto flex-col space-y-2 p-2"
            >
                <div className="flex justify-between">
                    <Button className="block bg-white hover:bg-blue-50 text-blue-500 shadow-none"
                        onClick={(value) =>
                            setDate(addDays(new Date(), parseInt('0')))
                        }
                    >
                        برو به امروز
                    </Button>
                    <Button className="flex bg-white hover:bg-blue-50 text-blue-500 shadow-none">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="align-middle"><path d="M15.75 3a.75.75 0 0 1 .75.75v.75h2.25c1.196 0 2.178.939 2.246 2.118L21 6.75v12a2.253 2.253 0 0 1-2.118 2.246L18.75 21H5.25a2.253 2.253 0 0 1-2.246-2.118L3 18.75v-12c0-1.196.939-2.178 2.118-2.246L5.25 4.5H7.5v-.75a.75.75 0 1 1 1.5 0v.75h6v-.75a.75.75 0 0 1 .75-.75Zm-3 12a.75.75 0 0 0-.745.662L12 15.75v.75a.75.75 0 0 0 1.495.088l.005-.088v-.75a.75.75 0 0 0-.75-.75Zm-3 0a.75.75 0 0 0-.745.662L9 15.75v.75a.75.75 0 0 0 1.495.088l.005-.088v-.75a.75.75 0 0 0-.75-.75Zm-3 0a.75.75 0 0 0-.745.662L6 15.75v.75a.75.75 0 0 0 1.495.088L7.5 16.5v-.75a.75.75 0 0 0-.75-.75Zm9-3.75a.75.75 0 0 0-.745.662L15 12v.75a.75.75 0 0 0 1.495.088l.005-.088V12a.75.75 0 0 0-.75-.75Zm-3 0a.75.75 0 0 0-.745.662L12 12v.75a.75.75 0 0 0 1.495.088l.005-.088V12a.75.75 0 0 0-.75-.75Zm-3 0a.75.75 0 0 0-.745.662L9 12v.75a.75.75 0 0 0 1.495.088l.005-.088V12a.75.75 0 0 0-.75-.75Zm-3 0a.75.75 0 0 0-.745.662L6 12v.75a.75.75 0 0 0 1.495.088l.005-.088V12a.75.75 0 0 0-.75-.75Zm12-5.25H16.5v.75a.75.75 0 1 1-1.5 0V6H9v.75a.75.75 0 1 1-1.5 0V6H5.25a.75.75 0 0 0-.745.663L4.5 6.75v1.5h15v-1.5a.75.75 0 0 0-.75-.75Z"></path></svg>
                        تقویم شمسی
                    </Button>
                </div>
                <div className="rounded-md border">
                    <Calendar mode="single"
                        dir="ltr"
                        selected={date}
                        onSelect={(selected) => {
                            if (selected) {
                                setDate(selected);}
                        }}
                        numberOfMonths={1}
                    />
                </div>
            </PopoverContent>
        </Popover>
    )
}
