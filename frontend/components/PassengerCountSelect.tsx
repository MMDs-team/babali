"use client";

import { useEffect, useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export default function PassengerSelector({
    totalPassengerCount,
    setTotalPassengerCount,
}: {
    totalPassengerCount: number[];
    setTotalPassengerCount: (value: number[]) => void;
}) {
    const [adults, setAdults] = useState(totalPassengerCount[0]);
    const [children, setChildren] = useState(totalPassengerCount[1]);
    const [infants, setInfants] = useState(totalPassengerCount[2]);

    useEffect(() => {
        setTotalPassengerCount([adults, children, infants]);
    }, [adults, children, infants, setTotalPassengerCount]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full mb-5 lg:mb-0 lg:w-48 justify-between py-6"
                >
                    {totalPassengerCount[0] + totalPassengerCount[1] + totalPassengerCount[2]} مسافر
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-4 space-y-4">

                <div className="flex items-center justify-between">
                    <span className="text-sm">بزرگسال (۱۲ سال به بالا)</span>
                    <div className="flex items-center space-x-2">
                        <Button
                            size="icon"
                            variant="outline"
                            className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white active:bg-blue-700 active:text-white"
                            onClick={() => setAdults(adults + 1)}
                        >
                            +
                        </Button>
                        <span>{adults}</span>
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() => setAdults(Math.max(1, adults - 1))}
                            disabled={adults <= 1}
                        >
                            -
                        </Button>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm">کودک (۲ تا ۱۲ سال)</span>
                    <div className="flex items-center space-x-2">
                        <Button
                            size="icon"
                            variant="outline"
                            className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white active:bg-blue-700 active:text-white"
                            onClick={() => setChildren(children + 1)}
                        >
                            +
                        </Button>
                        <span>{children}</span>
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() => setChildren(Math.max(0, children - 1))}
                            disabled={children <= 0}
                        >
                            -
                        </Button>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm">نوزاد (۱۰ روز تا ۲ سال)</span>
                    <div className="flex items-center space-x-2">
                        <Button
                            size="icon"
                            variant="outline"
                            className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white active:bg-blue-700 active:text-white"
                            onClick={() => setInfants(infants + 1)}
                        >
                            +
                        </Button>
                        <span>{infants}</span>
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() => setInfants(Math.max(0, infants - 1))}
                            disabled={infants <= 0}
                        >
                            -
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
