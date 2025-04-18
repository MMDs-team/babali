'use client'
import Image from "next/image";
import { usePathname } from "next/navigation";
import Menu from "./Menu";

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
        <div className="w-full mt-15 relative hidden md:block transition-all duration-500 ease-in-out">
            <Image 
                src={`/hero-${routes[pathname]}.jpg`}
                alt='hero image'
                width={1200} 
                height={320}
                objectFit="cover"
                quality={100}
            />
            <Menu />
        </div>
    );
};

export default Hero;
