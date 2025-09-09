"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

type FAQItem = {
    question: string;
    answer: string;
};

export default function FAQAccordion({ className, data, main }: { className?:string, data: FAQItem[], main?:boolean }) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className={`${className} mt-8 lg:mt-2  max-w-5xl mx-auto p-6 ${main&&'pt-65 lg:pt-8'}`} dir="rtl">
            <h2 className="text-xl font-bold mb-6">پرسش‌های شما</h2>
            <div className={`h-100 overflow-y-auto lg:h-auto lg:overflow-y-visible ${main&&'h-auto overflow-visible'}`}>
                {data.map((faq, idx) => (
                    <AccordionItem
                        key={idx}
                        faq={faq}
                        isOpen={openIndex === idx}
                        onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                    />
                ))}
            </div>
        </section>
    );
}

function AccordionItem({
    faq,
    isOpen,
    onClick,
}: {
    faq: FAQItem;
    isOpen: boolean;
    onClick: () => void;
}) {
    const contentRef = useRef<HTMLDivElement>(null);
    const [maxHeight, setMaxHeight] = useState("0px");

    useEffect(() => {
        if (isOpen && contentRef.current) {
            setMaxHeight(`${contentRef.current.scrollHeight}px`);
        } else {
            setMaxHeight("0px");
        }
    }, [isOpen]);

    return (
        <div className="border">
            <button
                onClick={onClick}
                className="flex justify-between items-center w-full px-4 py-5 text-right font-bold text-gray-700 cursor-pointer"
            >
                <div className="flex items-center gap-2">
                    <HelpCircle className="w-6 h-6 text-blue-400" />
                    {faq.question}
                </div>
                <ChevronDown
                    className={`h-5 w-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </button>

            <div
                ref={contentRef}
                style={{ maxHeight }}
                className="overflow-hidden transition-all duration-500 ease-in-out"
            >
                <div className="px-4 pb-6 pt-2 text-sm text-gray-500">{faq.answer}</div>
            </div>
        </div>
    );
}
