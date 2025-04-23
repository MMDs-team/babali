
'use client';
import { useState } from 'react';
import InputWithSuggestions from './InputWithSuggestioni';


function ChangeDirectonButton({ clickHandler }: { clickHandler: () => void; }) {
    return (
        <span
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"

        >
            <button type="button" className=" bg-white rounded-full border btn p-1 cursor-pointer"
                onClick={clickHandler}
            >
                <svg viewBox="0 0 24 24" width="1.5em" fill="currentColor">
                    <path d="m16.96 12.157.07.063 3.75 3.75a.757.757 0 0 1 .06.067l-.06-.067a.748.748 0 0 1 .22.53v.025a.728.728 0 0 1-.003.039L21 16.5a.747.747 0 0 1-.147.446l-.01.014-.008.01-.055.06-3.75 3.75a.75.75 0 0 1-1.123-.99l.063-.07 2.469-2.47H8.25a.75.75 0 0 1-.087-1.495l.087-.005h10.189l-2.47-2.47a.75.75 0 0 1-.062-.99l.063-.07a.75.75 0 0 1 .99-.063ZM8.03 3.22a.75.75 0 0 1 .063.99l-.063.07-2.47 2.47h10.19a.75.75 0 0 1 .088 1.495l-.088.005H5.56l2.47 2.47a.75.75 0 0 1 .063.99l-.063.07a.75.75 0 0 1-.99.063l-.07-.063-3.75-3.75-.055-.06a.644.644 0 0 1-.005-.007l.06.067A.756.756 0 0 1 3 7.5v-.014a.47.47 0 0 1 .003-.053L3 7.5a.756.756 0 0 1 .22-.53l3.75-3.75a.75.75 0 0 1 1.06 0Z">
                    </path>
                </svg>
            </button>
        </span>
    )
}

const iranianCities = [
    'تهران',
    'مشهد',
    'اصفهان',
    'شیراز',
    'تبریز',
    'اهواز',
    'کرج',
    'قم',
    'کرمان',
    'رشت',
];

export default function SourceTargetCity({className} : {className: String}) {
    const [sourceCity, setSourceCity] = useState('');
    const [targetCity, setTargetCity] = useState('');

    const changeDirection = () => {
        const temp = sourceCity;
        setSourceCity(targetCity);
        setTargetCity(temp);
    }

    return (
        <div className={`flex relative ${className}`}>
            <InputWithSuggestions
                label="مبداء"
                suggestions={iranianCities}
                value={sourceCity}
                onChange={setSourceCity}
                className='rounded-l-none'
            />

            <ChangeDirectonButton clickHandler={() => changeDirection()} />


            <InputWithSuggestions
                label="مقصد"
                suggestions={iranianCities}
                value={targetCity}
                onChange={setTargetCity}
                className='rounded-r-none'
            />
        </div>
    );
}
