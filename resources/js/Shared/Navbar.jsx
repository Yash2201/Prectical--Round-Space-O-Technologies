import { Link } from '@inertiajs/react';
import React from 'react';

const Navbar = () => {
    return (
        <>
            <nav className="bg-gray-800 p-4 mb-2">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex space-x-4">
                        <Link href={route('home')} className="text-white hover:text-gray-300">Home</Link>
                        <Link href='#' className="text-white hover:text-gray-300">About Us</Link>
                        <Link href='#' className="text-white hover:text-gray-300">Contact Us</Link>
                    </div>
                    <div>
                        <Link href='#' className="text-white hover:text-gray-300">Login</Link>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar
