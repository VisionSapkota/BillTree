'use client'
import Link from "next/link"

const GetStarted = () => {
    return (
        <div>
            <Link href="/login">
                <button className="px-6 py-3 bg-purple-600 text-white rounded-xl text-lg hover:bg-purple-700 transition cursor-pointer">
                    Go to Login
                </button>
            </Link>
        </div>
    )
}

export default GetStarted