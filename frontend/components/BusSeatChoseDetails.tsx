import React from 'react'

const BusSeatChoseDetails = ({selectedCnt} : {selectedCnt: number}) => {
    return (
        <div className="flex flex-col mb-6 md:mb-0">
            <span className="flex gap-2 mb-4 leading-relaxed sm:text-4 text-2 text-gray-500" >
                <svg viewBox="0 0 24 24" width="1.5em" height="1.5em" fill="currentColor" className="align-top ml-2 shrink-0" data-v-4c79b6d3="">
                    <path d="M12 1.5c5.799 0 10.5 4.701 10.5 10.5S17.799 22.5 12 22.5 1.5 17.799 1.5 12 6.201 1.5 12 1.5ZM12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 6a.75.75 0 0 1 .745.663l.005.087v7.5a.75.75 0 0 1-1.495.087l-.005-.087v-7.5A.75.75 0 0 1 12 9Zm0-3a.75.75 0 0 1 .745.663l.005.087v.75a.75.75 0 0 1-1.495.087L11.25 7.5v-.75A.75.75 0 0 1 12 6Z">
                    </path>
                </svg>
                صندلی‌های موردنظر خود را انتخاب نمایید. <br /> صندلی‌ها با اولین کلیک انتخاب و با کلیک<br /> بعدی از انتخاب خارج می‌شوند.
            </span>
            <div className="flex flex-col items-center mt-auto md:block">
                <button type="button" className="px-4 mb-4 text-2 bg-grays-150">
                    <span className="ml-1 last:ml-0 py-1 text-gray-600 bg-gray-200 p-3 text-sm rounded-2xl">
                        {selectedCnt === 0 ? 
                        'صندلی انتخاب نشده'
                        : `${selectedCnt} صندلی انتخاب شده`
                        }
                    </span>
                </button>
                <div className="flex items-center text-2  text-xs">
                    <div className="w-5 h-5 bg-green-300 border border-green-400">

                    </div>
                    <strong className="mr-1 ml-4 text-gray-400">انتخاب شما</strong>

                    <div className="w-5 h-5 bg-gray-100 border border-gray-300"></div>
                    <strong className="mr-1 ml-4 text-gray-400">قابل انتخاب</strong>

                    <div className="w-5 h-5 bg-blue-200 border border-blue-400"></div>
                    <strong className="mr-1 ml-4 text-gray-400">رزرو شده آقا</strong>

                    <div className="w-5 h-5 bg-red-200 border border-red-500"></div>
                    <strong className="mr-1 ml-4 text-gray-400">رزرو شده خانم</strong>
                </div>
            </div>
        </div>
    )
}

export default BusSeatChoseDetails