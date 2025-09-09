'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button"; // adjust path if needed
import { Loader2 } from "lucide-react";

interface SearchButtonProps {
    onSearch: () => Promise<void>;
}

const SearchButton: React.FC<SearchButtonProps> = ({ onSearch }) => {
    const [loading, setLoading] = useState<boolean>(false);

    const handleClick = async () => {
        if (!loading) {
            setLoading(true);
            try {
                await onSearch();
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Button
            className={`w-full lg:flex-1 h-auto bg-amber-400 text-black hover:bg-amber-500 ${loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
            onClick={handleClick}
            disabled={loading}
        >
            <div className="flex items-center justify-center gap-2 font-bold">
                جستجو
                {loading && <Loader2 className="animate-spin h-5 w-5" />}
            </div>
        </Button>
    );
};

export default SearchButton;
