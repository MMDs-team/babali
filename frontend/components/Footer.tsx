// components/Footer.tsx
import {
    Instagram,
    Linkedin,
    Youtube,
    Send, // for Telegram
    PlaySquare, // as Aparat replacement
} from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-white border-t text-gray-700 text-sm mt-14 pt-34 " dir="rtl">
            <div className="max-w-7xl mx-auto px-6 py-10">
                {/* Top Features */}
                <div className="grid md:grid-cols-3 gap-6 text-center md:text-right mb-10">
                    <div>
                        <h3 className="font-bold mb-1">رتبه یک سفر</h3>
                        <p>معتبرترین عرضه‌کننده محصولات گردشگری در ایران</p>
                    </div>
                    <div>
                        <h3 className="font-bold mb-1">همسفر هر سفر</h3>
                        <p>ارائه تمامی خدمات سفر (پرواز، اتوبوس، قطار، هتل و تور)</p>
                    </div>
                    <div>
                        <h3 className="font-bold mb-1">همسفر همه لحظات سفر</h3>
                        <p>پشتیبانی و همراهی ۲۴ ساعته در تمامی مراحل سفر</p>
                    </div>
                </div>

                <div className="border-t pt-8 grid md:grid-cols-4 gap-8">
                    {/* Logo & Contact */}
                    <div>
                        <div className="flex items-center mb-4">
                            <span className="text-2xl font-bold text-yellow-500">A</span>
                            <span className="text-xl font-bold ml-2">babali</span>
                        </div>
                        <p className="text-gray-600">تلفن پشتیبانی: 0210000000</p>
                    </div>

                    {/* AliBaba Section */}
                    <div>
                        <h4 className="font-bold mb-3">علی‌بابا</h4>
                        <ul className="space-y-2">
                            <li>درباره ما</li>
                            <li>تماس با ما</li>
                            <li>چرا علی‌بابا</li>
                            <li>علی بابا پلاس</li>
                            <li>بیمه مسافرتی</li>
                            <li>مجله علی‌بابا</li>
                        </ul>
                    </div>

                    {/* Customer Services */}
                    <div>
                        <h4 className="font-bold mb-3">خدمات مشتریان</h4>
                        <ul className="space-y-2">
                            <li>مرکز پشتیبانی آنلاین</li>
                            <li>راهنمای خرید</li>
                            <li>راهنمای استرداد</li>
                            <li>قوانین و مقررات</li>
                            <li>پرسش و پاسخ</li>
                        </ul>
                    </div>

                    {/* Extra Info */}
                    <div>
                        <h4 className="font-bold mb-3">اطلاعات تکمیلی</h4>
                        <ul className="space-y-2">
                            <li>فروش سازمانی</li>
                            <li>پنل آژانسی علی بابا</li>
                            <li>فرصت‌های شغلی</li>
                            <li>سنجش رضایتمندی</li>
                        </ul>
                    </div>
                </div>

                {/* Social Media */}
                <div className="mt-10 flex justify-center gap-6 text-gray-500">
                    <Linkedin className="w-6 h-6 hover:text-gray-800 cursor-pointer" />
                    <Instagram className="w-6 h-6 hover:text-gray-800 cursor-pointer" />
                    <PlaySquare className="w-6 h-6 hover:text-gray-800 cursor-pointer" /> {/* Aparat placeholder */}
                    <Youtube className="w-6 h-6 hover:text-gray-800 cursor-pointer" />
                    <Send className="w-6 h-6 hover:text-gray-800 cursor-pointer" /> {/* Telegram */}
                </div>

                {/* Bottom Text */}
                <div className="mt-8 text-center text-xs text-gray-500">
                    این وبسایت برای پرژه درس نرم‌افزار۲ توسط تیم MMDS ساخته شده است
                    &copy;
                </div>
            </div>
        </footer>
    );
}
