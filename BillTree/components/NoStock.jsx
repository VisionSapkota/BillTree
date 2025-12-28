"use client"
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";

const NoStock = () => {
    const [finalData, setFinalData] = useState([])
    const [msg, setMsg] = useState("")
    const router = useRouter();

    useEffect(() => {
        (async () => {
            try {
                const { data: { user }, error: userError } = await supabase.auth.getUser();
                if (userError) router.push("/login")

                const { data: [{ productDetails }], error } = await supabase.from("productList").select("productDetails").eq("id", user?.id);

                if (error && productDetails) {
                    setMsg(error.message)
                    return;
                }

                if (!productDetails) {
                    setMsg("No records found.");
                    return;
                }

                let zeroStock = productDetails.filter(val => val[0].stock === 0)

                setFinalData(zeroStock)
            } catch (error) {
                console.error(error);
                setMsg("Unexpected Error Occur. Please try again.", error)
            }
        })()
    }, [])

    return (
        <table className="w-full min-w-[800px] text-left border border-gray-200">
            <thead className="bg-gray-100">
                <tr>
                    <th className="p-2 border-b border-gray-200 whitespace-nowrap">S.N.</th>
                    <th className="p-2 border-b border-gray-200 whitespace-nowrap">Barcode</th>
                    <th className="p-2 border-b border-gray-200 whitespace-nowrap">Product Name</th>
                    <th className="p-2 border-b border-gray-200 whitespace-nowrap">CP</th>
                </tr>
            </thead>

            <tbody>
                {finalData.length > 0 ?
                    (finalData.map((value, index) => (
                        <tr key={index}>
                            <td className="p-2 border-b border-gray-200 whitespace-nowrap">{index + 1}</td>
                            <td className="p-2 border-b border-gray-200 whitespace-nowrap">{value?.[0]?.barcode}</td>
                            <td className="p-2 border-b border-gray-200 whitespace-nowrap">{value?.[0]?.productName}</td>
                            <td className="p-2 border-b border-gray-200 whitespace-nowrap">{value?.[0]?.cp}</td>
                        </tr>
                    ))) : (
                        <tr>
                            <td colSpan={4} className="text-center text-[#ff0000] font-bold text-2xl p-4 border-b border-gray-200">
                                {msg ? msg : "No records found."}
                            </td>
                        </tr>
                    )}
            </tbody>
        </table>
    )
}

export default NoStock