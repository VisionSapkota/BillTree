'use client'
import Link from "next/link"

const NewUser = () => {
    return (
        <>
            <Link href="/register">
                <button className="text-purple-600 hover:underline cursor-pointer">Register</button>
            </Link>
        </>
    )
}

export default NewUser