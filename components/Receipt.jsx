"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

const Receipt = ({ info, clearInfo }) => {
    const [date, setDate] = useState("")
    const [receiptNumber, setReceiptNumber] = useState(1)
    const [data, setData] = useState([])
    const [final, setFinal] = useState(0)
    const [discount, setDiscount] = useState("")
    const [grandTotal, setGrandTotal] = useState(0)
    const [defaultData, setDefaultData] = useState({
        store_name: "BillTree",
        store_address: "Not Specified",
        contact: "Not Specified",
        email: ""
    })

    // Receipt Number
    useEffect(() => {
        (async () => {
            const { data: {user} } = await supabase.auth.getUser()
            const { data } = await supabase.from("receipts").select("details").eq('id', user.id)

            const allReceipts = data?.[0]?.details || []
            const newReceiptNumber = allReceipts.length + 1
            setReceiptNumber(newReceiptNumber);
        })()
    }, [info])

    // Date for Receipt
    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();

        const dates = `${year}-${month}-${day}`
        setDate(dates)
    }, [])

    // Store Data
    useEffect(() => {

        (async () => {
            const { data: { user } = {} } = await supabase.auth.getUser();
            const { data, error } = await supabase.from("Store Info").select("*").eq("id", user?.id);
            setDefaultData((dataa) => ({
                ...dataa,
                email: user?.email
            }));

            error ? console.log(error.message) : setData(data[0]);
        })();
    }, [])

    // Total, Discount, Grand Total
    useEffect(() => {
        if (discount > 100) {
            setDiscount(Number(discount.toString().slice(0, discount.toString().length - 1)));
            return;
        } else if (discount < 0) {
            setDiscount(0);
            return;
        }

        let final = 0;
        let discountAmt = 0;

        info.map((value) => {
            final += value[0].total;
        })

        discountAmt = final * (discount / 100);

        setFinal(final)
        setGrandTotal(final - discountAmt)
    }, [info, discount])

    // Submit Handler
    const submitHandler = async (e) => {
        e.preventDefault();

        let { data: { user: { id } = {} } = {} } = await supabase.auth.getUser();

        const { data, error } = await supabase.from("receipts").select("details").eq('id', id)
        if (error) console.log(error.message)

        const finalData = [
            ...(data?.[0]?.details || []),
            [
                ...info,
                [{
                    fullDate: date,
                    total: final,
                    totalDiscount: final - grandTotal,
                    granddTotal: grandTotal
                }]
            ]
        ]

        const { error: upsertError } = await supabase.from("receipts").upsert([{
            id: id,
            details: finalData
        }], { onConflict: ['id'] })

        if (upsertError) console.log(upsertError.message);
        setDiscount("")
        clearInfo()
    }

    return (
        <div className="bg-white p-6 rounded shadow max-w-2xl mt-10 text-black">
            <header className="text-center p-4 mb-8 border-b border-gray-300">
                <h1 className="text-3xl font-bold mb-1">{data?.store_name || defaultData.store_name}</h1>
                <address className="not-italic text-sm mb-1">
                    {data?.store_address || defaultData.store_address}
                </address>
                <div className="text-sm">
                    <span className="no-underline after:content-['|'] after:mx-1">{data?.contact || defaultData.contact}</span>
                    <span className="no-underline">{data?.email || defaultData.email || "Not Specified"}</span>
                </div>
            </header>

            <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                    <span className="font-bold">Bill no.:</span>
                    <p>{receiptNumber}</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-bold">Date:</span>
                    <p>{date}</p>
                </div>
            </div>

            <div className="overflow-x-auto mt-2">
                <table className="w-full text-left border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 border-b border-gray-200 whitespace-nowrap">S.N.</th>
                            <th className="p-2 border-b border-gray-200 whitespace-nowrap">Barcode</th>
                            <th className="p-2 border-b border-gray-200 whitespace-nowrap">Product Name</th>
                            <th className="p-2 border-b border-gray-200 whitespace-nowrap">Rate</th>
                            <th className="p-2 border-b border-gray-200 whitespace-nowrap">Quantity</th>
                            <th className="p-2 border-b border-gray-200 whitespace-nowrap">Total</th>
                            <th className="p-2 border-b border-gray-200 whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>

                    <tbody id="transactionTableBody">
                        {info.map((value, index) => (
                            <tr key={index}>
                                <td className="p-2 border-b border-gray-200 whitespace-nowrap">{index + 1}</td>
                                <td className="p-2 border-b border-gray-200 whitespace-nowrap">{value[0].barcode}</td>
                                <td className="p-2 border-b border-gray-200 whitespace-nowrap">{value[0].name}</td>
                                <td className="p-2 border-b border-gray-200 whitespace-nowrap">${value[0].rate}</td>
                                <td className="p-2 border-b border-gray-200 whitespace-nowrap">{value[0].quantity}</td>
                                <td className="p-2 border-b border-gray-200 whitespace-nowrap">${value[0].total}</td>
                                <td className="p-2 border-b border-gray-200 flex items-center justify-between gap-3">
                                    <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-sm cursor-pointer"><FontAwesomeIcon icon={faPen} /></button>
                                    <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm cursor-pointer"><FontAwesomeIcon icon={faTrash} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 p-4 rounded bg-gray-50 shadow-sm w-full max-w-md ml-auto">
                <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Total:</span>
                    <span>${final.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <label className="font-semibold">Discount(%):</label>
                    <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} className="text-right border border-gray-300 p-1 w-20 rounded focus:outline-none text-sm"
                        placeholder="0%" min="0" max="100" />
                </div>
                <div className="flex justify-between items-center border-t pt-2 mt-2">
                    <span className="font-bold text-lg">Grand Total:</span>
                    <span className="text-lg font-bold">${grandTotal.toFixed(2)}</span>
                </div>
            </div>

            <div className="flex items-center justify-end mt-10 gap-5">
                <button type="submit" onClick={submitHandler}
                    className="bg-[#111] text-white px-4 py-2 rounded outline-none hover:bg-gray-800 transition cursor-pointer">Save</button>
                <button type="submit" onClick={submitHandler}
                    className="bg-[#111] text-white px-4 py-2 rounded outline-none hover:bg-gray-800 transition cursor-pointer">Save
                    & Print</button>
            </div>
        </div>
    )
}

export default Receipt