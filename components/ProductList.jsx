"use client"
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "@/lib/supabaseClient";

const ProductList = () => {
    const [finalData, setFinalData] = useState([])
    const [isDelete, setIsDelete] = useState(false)

    useEffect(() => {
        list()
    }, [])
    

    const list = async () => {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) {
            alert("User Not Found.", userError);
            return
        }

        const { data, error } = await supabase.from("productList").select("productDetails").eq("id", user.id)
        if (error) {
            alert(error.message)
        }

        setFinalData(data?.[0]?.productDetails || [])
    }

    const deleteHandler = async (index) => {
        setIsDelete(true)

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) {
            alert("User Not Found.", userError);
            return
        }

        const { error: fetchError } = await supabase.from("productList").select("productDetails").eq("id", user.id)

        if (fetchError) {
            alert(fetchError.message)
            return;
        }

        finalData.splice(index, 1)
        const { error: error } = await supabase.from("productList").upsert([
            {
                id: user.id,
                productDetails: finalData
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
                    <th className="p-2 border-b border-gray-200">Barcode</th>
                    <th className="p-2 border-b border-gray-200">Product Name</th>
                    <th className="p-2 border-b border-gray-200">CP</th>
                    <th className="p-2 border-b border-gray-200">SP</th>
                    <th className="p-2 border-b border-gray-200">Quantity</th>
                    <th className="p-2 border-b border-gray-200">Status</th>
                    <th className="p-2 border-b border-gray-200">Action</th>
                </tr>
            </thead>
            <tbody>
                {finalData.map((value, index) => (
                    <tr key={index}>
                        <td className="p-2 border-b border-gray-200">{index + 1}</td>
                        <td className="p-2 border-b border-gray-200">{value[0].barcode}</td>
                        <td className="p-2 border-b border-gray-200">{value[0].productName}</td>
                        <td className="p-2 border-b border-gray-200">{value[0].cp}</td>
                        <td className="p-2 border-b border-gray-200">{value[0].sp}</td>
                        <td className="p-2 border-b border-gray-200">{value[0].stock}</td>
                        <td className="p-2 border-b border-gray-200">
                            <span className={`${value[0].stock > 0 ? "text-green-600" : "text-red-600"} font-medium`}>{value[0].stock > 0 ? "In Stock" : "Out of Stock"}</span>
                        </td>
                        <td className="p-2 border-b border-gray-200 flex gap-2">
                            <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-sm"><FontAwesomeIcon icon={faPen} /></button>
                            <button onClick={() => deleteHandler(index)} className={`bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm ${isDelete ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 cursor-pointer"} `}><FontAwesomeIcon icon={faTrash} /></button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default ProductList