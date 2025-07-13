"use client"
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Receipt from "@/components/Receipt";
import GenerateReceipt from "@/components/GenerateReceipt";

const page = () => {
    const [data, setData] = useState([])

    const handleReceive = (receipt) => {
        setData(receipt)
    }

    return (
        <div className="bg-gray-100 min-h-screen md:flex">
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 p-6 mt-4 md:ml-70 md:mt-0">
                <div>
                    <h1 className="text-3xl font-bold mb-4 text-black">New transaction</h1>
                    <div className="bg-white p-6 rounded shadow max-w-2xl">
                        <GenerateReceipt dataReceipt={handleReceive} />
                    </div>
                    <Receipt info={data} clearInfo={() => setData([])} />
                </div>
            </main>
        </div>
    )
}

export default page