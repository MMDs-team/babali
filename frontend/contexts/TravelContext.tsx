'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

export type TravelType = 'bus' | 'train' | 'flight';


type TravelContextType = {
    travelType: TravelType | null;
    setTravelType: (type: TravelType) => void;

    travelDetails: any | null;
    setTravelDetails: (details: any) => void;
};

// Context
const TravelContext = createContext<TravelContextType | undefined>(undefined);

// Provider
export const TravelProvider = ({ children }: { children: ReactNode }) => {
    const [travelType, setTravelType] = useState<TravelType | null>(null);
    const [travelDetails, setTravelDetails] = useState<Object | null>(null);

    return (
        <TravelContext.Provider
            value={{
                travelType,
                setTravelType,
                travelDetails,
                setTravelDetails,
            }}
        >
            {children}
        </TravelContext.Provider>
    );
};

export const useTravel = (): TravelContextType => {
    const context = useContext(TravelContext);
    if (!context) throw new Error('useTravel must be used within TravelProvider');
    return context;
};
