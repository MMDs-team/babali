'use client';

import Link from 'next/link';
import Image from "next/image";
import { NavigationMenuDemo } from './NavbarLists';
import NavbarMainLeft from './NavbarMainLeft';

const Navbar: React.FC = () => {

    return (
        <header>
            <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50 hidden md:block">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="text-green-600 text-xl font-bold">
                            <Link href="/">
                                <Image
                                    className="dark:invert"
                                    src="/brand.svg"
                                    alt="alibaba logo"
                                    width={160}
                                    height={48}
                                    priority
                                />
                            </Link>
                        </div>

                        <div className="space-x-6 hidden lg:flex">
                            <NavigationMenuDemo />
                        </div>

                        <div className="space-x-6">
                            <NavbarMainLeft />
                        </div>

                    </div>
                </div>
            </nav>

            <nav className='md:hidden block w-full bg-amber-400 pb-18'>
                <Link href="/" className='flex justify-center py-7'>
                    <Image
                        className="dark:invert"
                        src="/brand-dark.svg"
                        alt="alibaba logo"
                        width={100}
                        height={20}
                        priority
                    />
                </Link>
            </nav>

        </header>
    );
};

export default Navbar;