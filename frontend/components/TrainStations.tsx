import React, { useEffect } from "react";


interface TrainStaionsProps {
    stations: string[];
}

const TrainStaions: React.FC<TrainStaionsProps> = ({ stations }) => {

    useEffect(() => {
        console.log(stations)
    }, [])
    return (
        <div className="relative w-full mt-10 flex items-center justify-between">
           
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-yellow-400 transform -translate-y-1/2"></div>

            {stations.map((station, index) => (
                <div key={index} className="relative flex flex-col items-center group">
                    
                    <div className="w-4 h-4 bg-white border-2 border-yellow-500 rounded-full cursor-pointer group-hover:bg-yellow-500 relative"></div>

                    <span className="absolute -top-8 text-sm text-black opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {station}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default TrainStaions;
