'use client'
import Link from "next/link"

const OldUser = () => {
    return (
        <>
            <Link href="/login">
                <button className="text-purple-600 hover:underline cursor-pointer">Login</button>
            </Link>
        </>
    )
}

export default OldUser