interface FloatingSelectProps {
    id: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function GendarSelectInput({ id, label, value, onChange }: FloatingSelectProps) {
    return (
        <div className="relative z-0 w-full group p-1">
            <select
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                className="block w-full text-gray-500 font-medium   
                      border border-gray-300
                     focus:outline-none  focus:border-gray-400 peer
                     px-2 rounded-md h-full"
            >
                <option value="M">مرد</option>
                <option value="F">زن</option>
            </select>
            <label
                htmlFor={id}
                className="absolute text-sm text-gray-500 -translate-y-3 px-2 scale-75 top-1 z-10 origin-[0] bg-white "
            >
                {label}
            </label>
        </div>
    );
}
