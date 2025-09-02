type TravelStarsProps = {
    rating: number;
    size?: number;
};

function StarFilled({ size = 24 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
        >
            <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.789 1.402 8.17L12 18.896l-7.336 3.863 1.402-8.17L.132 9.21l8.2-1.192z" />
        </svg>
    );
}

export default function TravelStars({ rating, size = 20 }: TravelStarsProps) {
    const stars = Array.from({ length: rating }, (_, i) => (
        <span key={i} className="text-green-500">
            <StarFilled size={size} />
        </span>
    ));

    return <div className="inline-flex space-x-1">{stars}</div>;
}
