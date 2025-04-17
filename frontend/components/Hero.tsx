'use client'
import { usePathname } from "next/navigation";

const Hero = () => {
    // Get the current path
    const pathname = usePathname();

    const routes : Record<string, string> = {
        '/': 'plain-in',
        '/bus-ticket': 'bus',
        '/train-ticket': 'train',
        '/iranout': 'plain-out',
        '/hotel': 'hotel',
        '/tour': 'tour',
        '/accommodation': 'vila',
    }

    const showHeroImage = pathname in routes;
    if (!showHeroImage) return null;

    return (
        <div className="mt-15 hidden md:block transition-all duration-500 ease-in-out"
            style={{
                backgroundImage: `url('/hero-${routes[pathname]}.jpg')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "300px",
            }}
        >

        </div>
    );
};

export default Hero;
