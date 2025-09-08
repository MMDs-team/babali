'use client'
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Menu from "./Menu";

const Hero = () => {
    const pathname = usePathname();
    const [allImagesLoaded, setAllImagesLoaded] = useState(false);

    const routes: Record<string, string> = {
        '/': 'plain-in',
        '/iranin': 'plain-in',
        '/bus-ticket': 'bus',
        '/train-ticket': 'train',
        '/iranout': 'plain-out',
        '/hotel': 'hotel',
        '/tour': 'tour',
        '/accommodation': 'vila',
    }

    const showHeroImage = pathname in routes;

    const currentImageSrc = `/hero-${routes[pathname]}.jpg`;

    useEffect(() => {
        const imagePromises = Object.values(routes).map((routeSuffix) => {
            return new Promise((resolve) => {
                const img = new (window as any).Image(); // Using window.Image for preloading
                img.src = `/hero-${routeSuffix}.jpg`;
                img.onload = () => resolve(true);
                img.onerror = () => resolve(false); // Resolve even if there's an error to not block
            });
        });

        Promise.all(imagePromises).then(() => {
            setAllImagesLoaded(true);
        });
    }, []);

    if (!showHeroImage) return null;

    return (
        <div className="w-full mt-15 relative transition-all duration-500 ease-in-out">
            {/* Display the current image */}
            <Image
                src={currentImageSrc}
                alt='hero image'
                width={1200}
                height={320}
                style={{ objectFit: "cover" }}
                quality={100}
                className="hidden lg:block"
                priority={true} // Mark the current image as high priority
            />

            <Menu />

            {/* {Object.entries(routes).map(([route, suffix]) => {
                if (`/hero-${suffix}.jpg` !== currentImageSrc) {
                    return (
                        <div key={route} style={{ display: 'none', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                            <Image
                                src={`/hero-${suffix}.jpg`}
                                alt={`preload image for ${route}`}
                                width={1200}
                                height={320}
                                style={{ objectFit: "cover" }}
                                quality={75} // You might use a slightly lower quality for preloaded images if bandwidth is a concern
                            />
                        </div>
                    );
                }
                return null;
            })} */}

        </div>
    );
};

export default Hero;
