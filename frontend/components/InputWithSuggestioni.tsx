'use client';

import { useState, useRef, useEffect, useId } from 'react';

interface InputWithSuggestionsProps {
    label: string;
    suggestions: string[];
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

const InputWithSuggestions: React.FC<InputWithSuggestionsProps> = ({
    label,
    suggestions,
    value,
    onChange,
    className = '',
}) => {
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputId = useId();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        onChange(input);
        if (input.length > 0) {
            const filtered = suggestions.filter((item) =>
                item.includes(input)
            );
            setFilteredSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        onChange(suggestion);
        setShowSuggestions(false);
    };

    const isFloating = value.length > 0;

    return (
        <div className={`relative w-full border rounded-lg ${className}`} dir="rtl" ref={wrapperRef}>
            <input
                id={inputId}
                value={value}
                onChange={handleChange}
                onFocus={() => {
                    if (value.length > 0) setShowSuggestions(true);
                }}
                className="peer h-12 w-full px-5 text-right bg-transparent text-gray-800 placeholder-transparent focus:outline-none focus:border-gray-700"
                placeholder={label}
            />
            <label
                htmlFor={inputId}
                className={`absolute right-0 transition-all px-5 text-sm text-gray-500
                    ${isFloating
                        ? 'top-[-10px] bg-white text-xs text-gray-500'
                        : 'top-3 text-base text-gray-400 peer-focus:top-[-10px] px-2 peer-focus:text-xs bg-white rounded peer-focus:text-gray-500'
                    }`}
            >
                {label}
            </label>

            {showSuggestions && filteredSuggestions.length > 0 && (
                <ul className="absolute right-0 z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-md max-h-60 overflow-auto">
                    {filteredSuggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-4 py-2 cursor-pointer hover:bg-blue-100 text-right"
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default InputWithSuggestions;
