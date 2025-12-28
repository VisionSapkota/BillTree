"use client"
import { supabase } from "@/lib/supabaseClient"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPrint, faTrash, faXmark, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"
import "@/styles/receiptPrinter.css";

const ReceiptTable = () => {

    const [isDelete, setIsDelete] = useState(false)
    const [finalData, setFinalData] = useState([])
    const [receiptData, setReceiptData] = useState([])
    const [storeData, setStoreDate] = useState({})
    const [user, setUser] = useState("")
    const [viewReceipt, setViewReceipt] = useState(false)
    const [viewReceiptLoad, setViewReceiptLoad] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter();

    useEffect(() => {
        list()
    }, [])

    const list = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) router.push("/login");

        const { data } = await supabase.from("receipts").select("details").eq('id', user.id).single();
        if (!data || data.details.length === 0) setError("No records found.");

        setFinalData(data?.details || []);
    }

    const deleteHandler = async (index) => {
        setIsDelete(true)

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) router.push("/login")

        const { error: fetchError } = await supabase.from("receipts").select("details").eq("id", user.id)

        if (fetchError) {
            setError(fetchError.message)
            return;
        }

        finalData.splice(index, 1)
        const { error: error } = await supabase.from("receipts").upsert([
            {
                id: user.id,
                details: finalData
            }
        ], { onConflict: ['id'] })

        if (error) setError(error.message)
        list()
        setIsDelete(false)
    }

    const view = async (idx) => {
        setViewReceiptLoad(true)

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) router.push("/login")

        const { data: [{ details }], error } = await supabase.from("receipts").select("details").eq("id", user.id);
        if (error) {
            setViewReceiptLoad(false)
            setError(error);
            return;
        }

        const { data, error: storeError } = await supabase.from("Store Info").select("*").eq("id", user.id);
        if (storeError) {
            setViewReceiptLoad(false)
            setError(storeError)
            return;
        }

        setUser(user.email)
        setReceiptData(details[idx]);
        setStoreDate(data[0]);
        setViewReceipt(true)
        setViewReceiptLoad(false)
    }

    return (
        <>
            {/* Receipt */}
            {viewReceipt &&
                (viewReceiptLoad ? <FontAwesomeIcon icon={faSpinner} spin /> :
                    <div
                        id="print-receipt"
                        className="print:w-full fixed top-0 left-0 bg-white z-50 p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-full sm:max-w-2xl mx-auto mt-4 sm:mt-10 text-black overflow-auto max-h-[95vh]">
                        <div className="flex items-center justify-end w-full print:hidden mb-2">
                            <button
                                type="button"
                                onClick={() => setViewReceipt(false)}
                                className="bg-[#111111] cursor-pointer text-white hover:opacity-85 w-8 h-8 sm:w-10 sm:h-10 rounded-full text-lg flex items-center justify-center">
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>

                        <header className="text-center p-2 sm:p-4 mb-4 sm:mb-8 border-b border-gray-300">
                            <h1 className="text-xl sm:text-3xl font-bold mb-1">{storeData?.store_name || "BillTree"}</h1>
                            <address className="not-italic text-xs sm:text-sm mb-1">
                                {storeData?.store_address || "Nepal"}
                            </address>
                            <div className="text-xs sm:text-sm flex justify-center gap-1">
                                <span className="after:content-['|'] after:mx-1">{storeData?.contact}</span>
                                <span>{storeData?.email || user}</span>
                            </div>

                            <div className="flex items-center justify-left mt-2 w-fit">
                                <h2 className="md:text-xl sm:text-lg whitespace-nowrap font-semibold mt-2">PAN no.</h2>
                                <table className="ml-4 border-collapse">
                                    <tbody>
                                        <tr className="border border-black">
                                            <td className="border border-black p-1">{storeData?.PAN?.split("")?.[0] || "#"}</td>
                                            <td className="border border-black p-1">{storeData?.PAN?.split("")?.[1] || "#"}</td>
                                            <td className="border border-black p-1">{storeData?.PAN?.split("")?.[2] || "#"}</td>
                                            <td className="border border-black p-1">{storeData?.PAN?.split("")?.[3] || "#"}</td>
                                            <td className="border border-black p-1">{storeData?.PAN?.split("")?.[4] || "#"}</td>
                                            <td className="border border-black p-1">{storeData?.PAN?.split("")?.[5] || "#"}</td>
                                            <td className="border border-black p-1">{storeData?.PAN?.split("")?.[6] || "#"}</td>
                                            <td className="border border-black p-1">{storeData?.PAN?.split("")?.[7] || "#"}</td>
                                            <td className="border border-black p-1">{storeData?.PAN?.split("")?.[8] || "#"}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold mt-4">Sales Invoices</h2>
                            </div>
                        </header>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 flex-wrap mb-2">
                            <div className="flex items-center gap-2">
                                <span className="font-bold">Bill no.:</span>
                                <p>{receiptData?.[receiptData.length - 1]?.[0]?.receiptNum}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold">Date:</span>
                                <p>{receiptData?.[receiptData.length - 1]?.[0]?.date}</p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border border-gray-200 text-xs sm:text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-2 border-b border-gray-200 whitespace-nowrap">S.N.</th>
                                        <th className="p-2 border-b border-gray-200 whitespace-nowrap">Product Name</th>
                                        <th className="p-2 border-b border-gray-200 whitespace-nowrap">Rate</th>
                                        <th className="p-2 border-b border-gray-200 whitespace-nowrap">Quantity</th>
                                        <th className="p-2 border-b border-gray-200 whitespace-nowrap">Total</th>
                                    </tr>
                                </thead>
                                <tbody id="transactionTableBody">
                                    {receiptData.slice(0, -1).map((value, index) => (
                                        <tr key={index}>
                                            <td className="p-2 border-b border-gray-200">{index + 1}</td>
                                            <td className="p-2 border-b border-gray-200">{value?.[0]?.name}</td>
                                            <td className="p-2 border-b border-gray-200">{value?.[0]?.prodDiscount ? <span><p className="line-through text-red-500">Rs. {value?.[0]?.rate}</p>Rs. {value?.[0]?.rateSP}</span> : <span>Rs. {value?.[0]?.rateSP}</span>}</td>
                                            <td className="p-2 border-b border-gray-200">{value?.[0]?.quantity}</td>
                                            <td className="p-2 border-b border-gray-200">Rs. {value?.[0]?.total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded bg-gray-50 shadow-sm w-full max-w-full sm:max-w-md ml-auto">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-semibold text-sm sm:text-base">Total:</span>
                                <span className="text-sm sm:text-base">Rs. {receiptData?.[receiptData.length - 1]?.[0]?.final.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="font-semibold text-sm sm:text-base">Discount(%):</label>
                                <div>
                                    <span className="text-sm sm:text-base">{(((receiptData?.[receiptData.length - 1]?.[0]?.discount.toFixed(2)) * 100) / (receiptData?.[receiptData.length - 1]?.[0]?.final.toFixed(2))).toFixed(2)}%</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center border-t pt-1 mt-1">
                                <span className="font-bold text-sm sm:text-lg">Grand Total:</span>
                                <span className="text-sm sm:text-lg font-bold">Rs. {receiptData?.[receiptData.length - 1]?.[0]?.grandTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            onClick={() => window.print()}
                            className="print:hidden mt-3 sm:mt-4 bg-[#111] text-white px-3 py-1 sm:px-4 sm:py-2 rounded outline-none hover:bg-gray-800 transition cursor-pointer w-full sm:w-auto text-sm sm:text-base flex items-center justify-center gap-1"
                        >
                            <FontAwesomeIcon icon={faPrint} /> Print
                        </button>
                    </div>)
            }

            {/* Receipt Table */}
            <table className="print:hidden w-full text-left border border-gray-200 whitespace-nowrap">
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
                    {finalData.length > 0 ? (
                        finalData.map((value, index) => (
                            <tr key={index}>
                                <td className="p-2 border-b border-gray-200">{index + 1}</td>
                                <td className="p-2 border-b border-gray-200">#{(value[value.length - 1][0].receiptNum).toString().padStart(3, "0")}</td>
                                <td className="p-2 border-b border-gray-200">{value[value.length - 1][0].date}</td>
                                <td className="p-2 border-b border-gray-200">{value.length - 1}</td>
                                <td className="p-2 border-b border-gray-200">Rs. {value[value.length - 1][0].grandTotal}</td>
                                <td className="p-2 border-b border-gray-200 flex gap-2">
                                    <button onClick={() => view(index)} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-sm cursor-pointer">
                                        <FontAwesomeIcon icon={faEye} />
                                    </button>
                                    <button onClick={() => deleteHandler(index)} className={`bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm cursor-pointer ${isDelete ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 cursor-pointer"}`}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="text-center text-[#ff0000] font-bold text-2xl p-4 border-b border-gray-200">
                                {error}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    )
}

export default ReceiptTable