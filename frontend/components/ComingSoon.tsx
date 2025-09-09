// components/ComingSoonClassic.js
import { Hourglass } from "lucide-react";

export default function ComingSoon() {
    return (
        <div className="w-full bg-white text-gray-800 py-16 px-6 flex justify-center">
            <div className="border border-gray-300  shadow-xl p-12 max-w-3xl text-center">
                <Hourglass className="text-gray-500 mx-auto mb-6" size={64} />
                <h1 className="text-3xl font-serif font-bold mb-4">به‌زودی</h1>
                <p className="text-lg font-serif">
                    این ویژگی در حال توسعه است و به زودی در دسترس شما قرار خواهد گرفت.
                </p>
            </div>
        </div>
    );
}
