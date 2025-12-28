"use client"
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faEye, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation"
import Link from "next/link";

const ProductList = () => {
    const [finalData, setFinalData] = useState([])
    const [isDelete, setIsDelete] = useState(false)
    const [error, setError] = useState("")
    const [msg, setMsg] = useState("")
    const [edit, setEdit] = useState(false)
    const [editBarcode, setEditBarcode] = useState("")
    const [editName, setEditName] = useState("")
    const [editCP, setEditCP] = useState()
    const [editMP, setEditMP] = useState()
    const [editStock, setEditStock] = useState()
    const [editDiscount, setEditDiscount] = useState()
    const [editLoader, setEditLoader] = useState(false)
    const [idx, setIdx] = useState()
    const router = useRouter();

    useEffect(() => {
        list()
    }, [])

    const list = async () => {
        setError("")
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) {
            setError("User Not Found.", userError);
            router.push('/login')
        }

        const { data, error } = await supabase.from("productList").select("productDetails").eq("id", user.id)
        if (error) setError(error.message)

        setFinalData(data?.[0]?.productDetails || [])
    }

    const deleteHandler = async (index) => {
        setIsDelete(true)

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) {
            setError("User Not Found.", userError);
            router.push("/login");
        }

        const { error: fetchError } = await supabase.from("productList").select("productDetails").eq("id", user.id)

        if (fetchError) {
            setError(fetchError.message)
            return;
        }

        finalData.splice(index, 1)
        const { error: error } = await supabase.from("productList").upsert([
            {
                id: user.id,
                productDetails: finalData
            }
        ], { onConflict: ['id'] })

        if (error) setError(error.message)
        list()
        setIsDelete(false)
    }

    const editHandler = async (index) => {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) router.push("/login")

        const { data: [{ productDetails }], error } = await supabase.from("productList").select("productDetails").eq("id", user.id)
        if (error) alert(error.message)

        let editDetails = productDetails?.[index]?.[0];

        setEditBarcode(editDetails?.barcode);
        setEditName(editDetails?.productName);
        setEditCP(editDetails?.cp);
        setEditMP(editDetails?.mp);
        setEditStock(editDetails?.stock);
        setEditDiscount(editDetails?.discount);
        setEdit(true)
        setIdx(index)
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        setEditLoader(true)
        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError) router.push("/login");

            const { data: [{ productDetails }], error } = await supabase.from("productList").select("productDetails").eq("id", user.id);
            if (error) alert(error.message)

            const updated = {
                barcode: editBarcode,
                cp: Number(editCP),
                mp: Number(editMP),
                productName: editName,
                stock: Number(editStock),
                discount: Number(editDiscount)
            }

            productDetails[idx][0] = updated;
            const { error: updateError } = await supabase.from("productList").update({ productDetails }).eq("id", user.id)
            if (updateError) alert(updateError.message)
        } catch (error) {
            console.error(error)
            setMsg("Unexpected error occur. Please try again.")
        } finally {
            list()
            setEdit(false)
            setEditLoader(false)
        }
    }

    return (
        <>
            {edit && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6">

                        <div className="flex justify-between items-center border-b pb-3 mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Edit Product</h2>
                        </div>

                        <form className="space-y-4" onSubmit={submitHandler}>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Barcode</label>
                                    <input type="number" value={editBarcode} readOnly className="w-full p-2 border border-gray-400 rounded bg-gray-100 text-gray-500 cursor-not-allowed outline-none" placeholder="Enter barcode" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                    <input type="text" maxLength="50" required value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full px-3 py-2 border border-gray-400 outline-none rounded-md" placeholder="Enter name" />
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">CP</label>
                                    <input type="number" required min="0" value={editCP} onChange={(e) => setEditCP(e.target.value)} className="w-full px-3 py-2 border border-gray-400 outline-none rounded-md" placeholder="0" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">MP</label>
                                    <input type="number" required min="0" value={editMP} onChange={(e) => setEditMP(e.target.value)} className="w-full px-3 py-2 border border-gray-400 outline-none rounded-md" placeholder="0" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                                    <input type="number" required min="0" value={editStock} onChange={(e) => setEditStock(e.target.value)} className="w-full px-3 py-2 border border-gray-400 outline-none rounded-md" placeholder="0" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount</label>
                                    <input type="number" required min="0" max="100" value={editDiscount} onChange={(e) => setEditDiscount(e.target.value)} className="w-full px-3 py-2 border border-gray-400 outline-none rounded-md" placeholder="0%" />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button type="reset" onClick={() => setEdit(false)} className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 cursor-pointer">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">Save Changes {editLoader && <FontAwesomeIcon icon={faSpinner} spin />}</button>
                            </div>
                        </form>
                    </div>

                    <div className="text-center text-[#ff0000] font-bold">
                        <p>{msg}</p>
                    </div>
                </div>
            )}

            <table className="w-full text-left border border-gray-200 whitespace-nowrap">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 border-b border-gray-200">S.N.</th>
                        <th className="p-2 border-b border-gray-200">Barcode</th>
                        <th className="p-2 border-b border-gray-200">Product Name</th>
                        <th className="p-2 border-b border-gray-200">CP</th>
                        <th className="p-2 border-b border-gray-200">MP</th>
                        <th className="p-2 border-b border-gray-200">Discount</th>
                        <th className="p-2 border-b border-gray-200">SP</th>
                        <th className="p-2 border-b border-gray-200">Stock</th>
                        <th className="p-2 border-b border-gray-200">Status</th>
                        <th className="p-2 border-b border-gray-200">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {finalData.length > 0 ? (
                        finalData.map((value, index) => (
                            <tr key={index}>
                                <td className="p-2 border-b border-gray-200">{index + 1}</td>
                                <td className="p-2 border-b border-gray-200">{value[0].barcode}</td>
                                <td className="p-2 border-b border-gray-200">{value[0].productName}</td>
                                <td className="p-2 border-b border-gray-200">Rs. {value[0].cp}</td>
                                <td className="p-2 border-b border-gray-200">Rs. {value[0].mp}</td>
                                <td className="p-2 border-b border-gray-200">{value[0].discount}%</td>
                                <td className="p-2 border-b border-gray-200">Rs. {(value[0].mp - ((value[0].discount / 100) * value[0].mp)).toFixed(2)}</td>
                                <td className="p-2 border-b border-gray-200">{value[0].stock}</td>
                                <td className="p-2 border-b border-gray-200">
                                    <span className={`${value[0].stock > 0 ? "text-green-600" : "text-red-600"} font-medium`}>{value[0].stock > 0 ? "In Stock" : "Out of Stock"}</span>
                                </td>
                                <td className="p-2 border-b border-gray-200 flex gap-2">
                                    <button onClick={() => editHandler(index)} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-sm cursor-pointer"><FontAwesomeIcon icon={faPen} /></button>
                                    <button onClick={() => deleteHandler(index)} className={`bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm ${isDelete ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 cursor-pointer"} `}><FontAwesomeIcon icon={faTrash} /></button>
                                </td>
                            </tr>
                        ))) : (
                        <tr>
                            <td colSpan={8} className="text-center font-bold text-2xl p-4 border-b border-gray-200">
                                {error ? error : "No records found."}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="mt-6">
                <Link href="/barcodes" className="bg-[#111] text-white px-6 py-2 rounded hover:bg-gray-800 transition cursor-pointer"><FontAwesomeIcon icon={faEye} /> View Barcodes</Link>
            </div>
        </>
    )
}

export default ProductList