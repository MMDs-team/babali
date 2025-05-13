import { cn } from "@/lib/utils";

interface FloatingInputProps {
    id: string;
    label: string;
    value: string;
    type?: string;
    patern? : string;
    className? : string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FloatingInput({ id, label, value, type='text', patern, className, onChange }: FloatingInputProps) {
    return (
        <div className={cn(`relative z-0 w-full group p-1`, className)}>
            <input
                type={type}
                name={id}
                id={id}
                className="block py-2.5 w-full text-sm text-gray-900 
                    bg-transparent border-1 border-gray-300 appearance-none 
                    focus:outline-none focus:ring-0 focus:border-gray-400 peer
                    px-2 rounded-md"
                placeholder=" "
                value={value}
                pattern={patern}
                onChange={onChange}
            />
            <label
                htmlFor={id}
                className="absolute text-sm text-gray-500 duration-300 
                        transform -translate-y-6 scale-75 top-1 z-10 origin-[0] 
                        peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1/2 
                        peer-focus:scale-75 peer-focus:-translate-y-3 mr-3 bg-white peer-focus:px-4 peer-focus:mr-0
                        peer-placeholder-shown::scale-75 peer-placeholder-shown::-translate-y-3 peer-placeholder-shown::px-4 peer-placeholder-shown::mr-0"

            >
                {label}
            </label>
        </div>
    );
}
