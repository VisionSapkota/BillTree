"use client"
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { supabase } from '@/lib/supabaseClient'
import Link from "next/link"

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isUser, setIsUser] = useState(false)

    useEffect(() => {
        (async () => {
            const { data: { user } } = await supabase.auth.getUser();

            user ? setIsUser(true) : setIsUser(false)
        })()
    }, [])

    return (
        <>
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex-shrink-0 text-2xl font-bold text-indigo-600">
                            BillTree
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex space-x-4 items-center">
                            <Link href="/" className="text-gray-600 hover:text-indigo-600 font-medium">
                                Home
                            </Link>

                            <Link href="/terms-and-conditions" className="text-gray-600 hover:text-indigo-600 font-medium">
                                Terms & Conditions
                            </Link>

                            <Link href="/privacy-policy" className="text-gray-600 hover:text-indigo-600 font-medium">
                                Privacy Policy
                            </Link>

                            {isUser ? (
                                <Link href="/dashboard" className="text-gray-600 hover:text-indigo-600 font-medium">
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login" className="px-4 py-2 rounded-md border border-indigo 600 text-indigo-600 font-semibold hover:bg-indigo-50 transition duration-300">
                                        Login
                                    </Link>

                                    <Link href="/register" className="px-4 py-2 rounded-md text-white font-semibold bg-indigo-600 hover:bg-indigo-700 transition duration-300 shadow-md">
                                        Join
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-600 focus:outline-none"><FontAwesomeIcon icon={faBars} /></button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="md:hidden px-2 pt-2 pb-3 space-y-2">
                        <Link href="/" className="block text-gray-600 hover:text-indigo-600 font-medium">
                            Home
                        </Link>

                        <Link href="/terms-and-conditions" className="block text-gray-600 hover:text-indigo-600 font-medium">
                            Terms & Conditions
                        </Link>

                        <Link href="/privacy-policy" className="block text-gray-600 hover:text-indigo-600 font-medium">
                            Privacy Policy
                        </Link>

                        {isUser ? (
                            <Link href="/dashboard" className="text-gray-600 hover:text-indigo-600 font-medium">
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href="/login" className="block text-center px-4 py-2 rounded-md border border-indigo-600 text-indigo-600 font-semibold hover:bg-indigo-50 transition duration-300">
                                    Login
                                </Link>

                                <Link href="/register" className="block text-center px-4 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition duration-300 shadow-md">
                                    Join
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </nav>
        </>
    )
}

export default Navbar