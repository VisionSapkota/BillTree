"use client"
import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'

const GenerateReceipt = ({ dataReceipt }) => {

    const [barcodeNum, setBarcodeNum] = useState("")
    const [productName, setProductName] = useState("")
    const [rate, setRate] = useState("")
    const [quantity, setQuantity] = useState("")
    const [total, setTotal] = useState(0)
    const [isBarcode, setIsBarcode] = useState(true)
    const [finalData, setFinalData] = useState([])
    const [receiptData, setReceiptData] = useState([])

    useEffect(() => {
        const r = Number(rate);
        const q = Number(quantity);

        setTotal(r * q);
    }, [rate, quantity])

    useEffect(() => {

        (async () => {
            const { data: { user } } = await supabase.auth.getUser();
            const { data, error } = await supabase.from("productList").select("productDetails").eq('id', user?.id).single()

            if (error) {
                console.log(error.message)
            } else {
                setFinalData(data.productDetails);
            }
        })()
    }, [])

    useEffect(() => {
        finalData.map((value) => {

            if (value[0].productName === productName && !isBarcode) {
                setBarcodeNum(value[0].barcode)
                setRate(value[0].sp)
                setQuantity(1)
                return;
            } else if (value[0].barcode === barcodeNum && isBarcode) {
                setProductName(value[0].productName)
                setRate(value[0].sp)
                setQuantity(1)
                return;
            }

        })
    }, [productName, barcodeNum])

    const submitHandler = async (e) => {
        e.preventDefault();

        if (barcodeNum === "" || productName === "" || rate === "" || quantity === "") {
            console.log("Error");
            return;
        }

        setReceiptData([
            ...receiptData,
            [{
                barcode: barcodeNum,
                name: productName,
                rate: Number(rate),
                quantity: Number(quantity),
                total: total
            }]
        ])
    }

    useEffect(() => {
        dataReceipt(receiptData)
        setBarcodeNum("")
        setProductName("")
        setRate("")
        setQuantity("")
    }, [receiptData])

    return (
        <form className="space-y-4" onSubmit={submitHandler}>
            <div className="flex gap-2">
                {isBarcode ?
                    <div className="w-full">
                        <label className="block font-medium text-gray-700">Barcode Number</label>
                        <input type="number" value={barcodeNum} onChange={(e) => setBarcodeNum(e.target.value)} className="w-full p-2 text-black border border-gray-300 rounded outline-none"
                            placeholder="Enter barcode number" />
                    </div>
                    :
                    <div className="w-full">
                        <label className="block font-medium text-gray-700">Product Name</label>
                        <input type="text" list="productDetails" value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full p-2 text-black border border-gray-300 rounded outline-none"
                            placeholder="Enter product name" />
                    </div>
                }
                <div className="self-end">
                    <button type="button" className="bg-[#111] text-white px-4 py-2 rounded outline-none hover:bg-gray-800 transition cursor-pointer"
                        onClick={() => setIsBarcode(!isBarcode)}>Change</button>
                </div>
            </div>

            <div>
                <label className="block font-medium text-gray-700">Rate</label>
                <input readOnly type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full bg-[#f9fafb] p-2 text-[#6b7280] border border-gray-300 rounded outline-none"
                    placeholder="Enter Rate" />
            </div>

            <div>
                <label className="block font-medium text-gray-700">Quantity</label>
                <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} step="0.01" className="w-full p-2 text-black border border-gray-300 rounded outline-none"
                    placeholder="Enter Quantity" />
            </div>

            <div className="flex items-center justify-between mt-10 flex-wrap gap-y-5">
                <button type="submit"
                    className="bg-[#111] text-white px-4 py-2 rounded outline-none hover:bg-gray-800 transition cursor-pointer">Add
                    Entry</button>

                <div className="flex justify-between flex-col bg-white border overflow-x-auto border-gray-200 rounded-lg px-5 py-2 shadow-sm">
                    <p className="text-green-600 text-4xl font-bold before:content-['$']">{total.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}</p>
                </div>
            </div>

            <datalist id="productDetails">
                {finalData.map((value, index) => (
                    <option key={index} value={value[0].productName}></option>
                ))}
            </datalist>
        </form>
    )
}

export default GenerateReceipt