"use client"
import { supabase } from "@/lib/supabaseClient"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPrint, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";

const ReceiptTable = () => {

    const [isDelete, setIsDelete] = useState(false)
    const [finalData, setFinalData] = useState([])

    useEffect(() => {
        list()
    }, [])


    const list = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) alert("User not Found.");

        const { data, error } = await supabase.from("receipts").select("details").eq('id', user.id).single();
        if (error) alert(error.message);

        setFinalData(data?.details || []);
    }

    const deleteHandler = async (index) => {
        setIsDelete(true)

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) {
            alert("User Not Found.", userError);
            return
        }

        const { error: fetchError } = await supabase.from("receipts").select("details").eq("id", user.id)

        if (fetchError) {
            alert(fetchError.message)
            return;
        }

        finalData.splice(index, 1)
        const { error: error } = await supabase.from("receipts").upsert([
            {
                id: user.id,
                details: finalData
            }
        ], { onConflict: ['id'] })

        if (error) alert(error.message)
        list()
        setIsDelete(false)
    }

    return (
        <table className="w-full text-left border border-gray-200 whitespace-nowrap">
            <thead className="bg-gray-100">
                <tr>
                    <th className="p-2 border-b border-gray-200">S.N.</th>
                    <th className="p-2 border-b border-gray-200">Bill No.</th>
                    <th className="p-2 border-b border-gray-200">Date</th>
                    <th className="p-2 border-b border-gray-200">Total Products</th>
                    <th className="p-2 border-b border-gray-200">Total Amount</th>
                    <th className="p-2 border-b border-gray-200">Actions</th>
                </tr>
            </thead>
            <tbody>
                {finalData.map((value, index) => (
                    <tr key={index}>
                        <td className="p-2 border-b border-gray-200">{index + 1}</td>
                        <td className="p-2 border-b border-gray-200">#{(value[value.length - 1][0].receiptNum).toString().padStart(3, "0")}</td>
                        <td className="p-2 border-b border-gray-200">{value[value.length - 1][0].date}</td>
                        <td className="p-2 border-b border-gray-200">{value.length - 1}</td>
                        <td className="p-2 border-b border-gray-200">${value[value.length - 1][0].grandTotal}</td>
                        <td className="p-2 border-b border-gray-200 flex gap-2">
                            <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-sm cursor-pointer">
                                <FontAwesomeIcon icon={faEye} />
                            </button>
                            <button
                                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-sm cursor-pointer">
                                <FontAwesomeIcon icon={faPrint} />
                            </button>
                            <button onClick={() => deleteHandler(index)} className={`bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm cursor-pointer ${isDelete ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 cursor-pointer"}`}>
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