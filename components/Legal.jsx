"use client"
import Link from "next/link"

const Legal = () => {
    return (
        <>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li><Link href="/terms-and-conditions" className="text-blue-600 hover:underline">Terms and Conditions</Link></li>
                <li><Link href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link></li>
            </ul>
        </>
    )
}

export default Legal