"use client"
import { supabase } from "@/lib/supabaseClient"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPrint, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";

const ReceiptTable = () => {

    const [finalData, setFinalData] = useState([])

    useEffect(() => {
        (
            async () => {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) console.log("User not Found.");

                const { data, error } = await supabase.from("receipts").select("details").eq('id', user.id).single();
                if (error) console.log(error.message);

                setFinalData(data?.details || []);
            }
        )()
    }, [])

    useEffect(() => {
        console.log(finalData);
        finalData.map((value, index) => {
            console.log(index, value);
            console.log(value.length);
        })
    }, [finalData])


    return (
        <table className="w-full text-left border border-gray-200 whitespace-nowrap">
            <thead className="bg-gray-100">
                <tr>
                    <th className="p-2 border-b border-gray-200">S.N.</th>
                    <th className="p-2 border-b border-gray-200">Bill No.</th>
                    <th className="p-2 border-b border-gray-200">Date</th>
                    <th className="p-2 border-b border-gray-200">Total Items</th>
                    <th className="p-2 border-b border-gray-200">Total Amount</th>
                    <th className="p-2 border-b border-gray-200">Actions</th>
                </tr>
            </thead>
            <tbody>
                {finalData.map((value, index) => (
                    <tr key={index}>
                        <td className="p-2 border-b border-gray-200">{index + 1}</td>
                        <td className="p-2 border-b border-gray-200">#{(index + 1).toString().padStart(3, "0")}</td>
                        <td className="p-2 border-b border-gray-200">{value[value.length - 1][0].fullDate}</td>
                        <td className="p-2 border-b border-gray-200">{value.length - 1}</td>
                        <td className="p-2 border-b border-gray-200">${value[value.length - 1][0].granddTotal}</td>
                        <td className="p-2 border-b border-gray-200 flex gap-2">
                            <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-sm cursor-pointer">
                                <FontAwesomeIcon icon={faEye} />
                            </button>
                            <button
                                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-sm cursor-pointer">
                                <FontAwesomeIcon icon={faPrint} />
                            </button>
                            <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm cursor-pointer">
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default ReceiptTable