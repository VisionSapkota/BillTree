"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Load from "./Load"

const AddProducts = () => {
    const [productName, setProductName] = useState("")
    const [CP, setCP] = useState("")
    const [MP, setMP] = useState("")
    const [stock, setStock] = useState("")
    const [barcodeNum, setBarcodeNum] = useState("")
    const [barcodeload, setBarcodesetload] = useState(false)
    const [isLoad, setIsLoad] = useState(false)
    const [msg, setMsg] = useState("")

    {/* Generate Barcode */ }
    const barcodeNumber = () => {
        setBarcodeNum("");
        setBarcodesetload(true);
        setTimeout(() => {
            const now = new Date();
            const randomNum = Math.floor(Math.random() * 900) + 100;

            const barcode = `${now.getFullYear().toString().slice(-2)}${now.getMonth() + 1}${now.getDate()}${randomNum}${now.getHours()}${now.getMinutes()}${now.getSeconds()}${now.getMilliseconds()}`;
            setBarcodeNum(barcode);
            setBarcodesetload(false);
        }, 500)
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        setMsg("")

        try {
            setIsLoad(true)

            if (!barcodeNum) {
                setMsg("Generate barcode.");
                return;
            }

            const currentProductData = [{
                productName: productName,
                barcode: barcodeNum,
                cp: Number(CP),
                mp: Number(MP),
                stock: Number(stock)
            }]

            let { data: { user: { id } = {} } = {} } = await supabase.auth.getUser();
            const { data } = await supabase.from("productList").select("productDetails").eq("id", id)

            const productData = [
                ...(data?.[0]?.productDetails || []),
                currentProductData,
            ];

            const { error } = await supabase.from("productList").upsert([{
                id: id,
                productDetails: productData
            }], { onConflict: ['id'] })

            if (error) setMsg(error.message)

        } catch (error) {
            console.error(error)
            setMsg("Unexpected Error Occur. Please try again.")
        } finally {
            setProductName("")
            setCP("")
            setMP("")
            setStock("")
            setBarcodeNum("")
            setIsLoad(false)
        }
    }

    return (
        <form className="space-y-4" onSubmit={submitHandler}>
            <div>
                <label className="block font-medium text-gray-700">Product Name</label>
                <input type="text" maxLength="50" className="w-full p-2 border border-gray-300 rounded outline-none" value={productName} onChange={(e) => setProductName(e.target.value)}
                    placeholder="Enter product name" required />
            </div>

            <div>
                <label className="block font-medium text-gray-700">Rate(Cost Price)</label>
                <input type="number" min="1" step="0.01" className="w-full p-2 border border-gray-300 rounded outline-none" value={CP} onChange={(e) => setCP(e.target.value)}
                    placeholder="Enter rate" required />
            </div>

            <div>
                <label className="block font-medium text-gray-700">Rate(Marked Price)</label>
                <input type="number" min="1" step="0.01" className="w-full p-2 border border-gray-300 rounded outline-none" value={MP} onChange={(e) => setMP(e.target.value)}
                    placeholder="Enter rate" required />
            </div>

            <div>
                <label className="block font-medium text-gray-700">Stock</label>
                <input type="number" min="0" step="1" className="w-full p-2 border border-gray-300 rounded outline-none" value={stock} onChange={(e) => setStock(e.target.value)}
                    placeholder="Enter stock amount" required />
            </div>

            <div>
                <label className="block font-medium text-gray-700">Barcode Number</label>
                <div className="flex gap-2">
                    <input id="barcodeInput" type="text" className="w-full p-2 border border-gray-300 rounded outline-none" readOnly required value={barcodeNum} onChange={(e) => setProductName(e.target.value)}
                        placeholder="Enter barcode number" />
                    <button type="button" onClick={barcodeNumber}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200 cursor-pointer">
                        {barcodeload ? <Load /> : "Generate"}
                    </button>
                </div>
            </div>

            <div className="mt-6">
                <button type="submit" className="bg-[#111] text-white px-6 py-2 rounded hover:bg-gray-800 transition cursor-pointer">{isLoad ? <Load /> : "Add Product"}</button>
            </div>
            <div>
                <p className="text-[#ff0000] font-bold text-center">{msg}</p>
            </div>
        </form>
    )
}

export default AddProducts