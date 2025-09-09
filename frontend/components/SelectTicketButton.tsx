import { useState } from "react";
import { Loader2 } from "lucide-react";

interface SelectTicketButtonProps {
    className?: string,
    onClick: () => Promise<void>;
    secondaryLoading?: boolean; // optional second loader
}

const SelectTicketButton: React.FC<SelectTicketButtonProps> = ({
    className,
    onClick,
    secondaryLoading = false,
}) => {
    const [loading, setLoading] = useState<boolean>(false);

    const handleClick = async () => {
        if (!loading) {
            setLoading(true);
            try {
                await onClick();
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`${className} bg-blue-600 text-white rounded-md px-6 py-2 hover:bg-blue-700 transition flex items-center justify-center gap-2 ${loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
            disabled={loading}
        >
            {/* Primary loader */}
            {loading && <Loader2 className="animate-spin h-5 w-5" />}
            انتخاب بلیط
            {/* Secondary loader */}
            {secondaryLoading && <Loader2 className="animate-spin h-5 w-5 text-gray-300" />}
        </button>
    );
};

export default SelectTicketButton;
