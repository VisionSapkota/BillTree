"use client"
import { useRef, useEffect, useState } from "react"
import JsBarcode from "jsbarcode";
import { supabase } from "@/lib/supabaseClient";

const Barcodes = () => {
    const canvasRef = useRef([])
    const [productsData, setProductsData] = useState([])
    const [msg, setMsg] = useState("")

    useEffect(() => {
        (async () => {
            setMsg("")
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError) {
                alert("User not found.", error.message);
                return;
            }

            const { data, error } = await supabase.from("productList").select("productDetails").eq("id", user.id);
            if (error) {
                alert("Error", error.message);
                return;
            }

            if (!data[0].productDetails) {
                setMsg("No barcodes found.");
                return;
            }

            setProductsData(data?.[0]?.productDetails);
        })();
    }, [])

    useEffect(() => {
        console.log(productsData)
        productsData?.forEach((value, index) => {
            JsBarcode(canvasRef.current[index], value[0].barcode, {
                format: "code128",
                displayValue: true,
                fontSize: 18,
                height: 50,
            })
        })
    }, [productsData])

    return (
        <div className="max-w-7xl mx-auto px-6 py-8 bg-gray-50 min-h-screen font-sans">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Barcodes</h1>
                <div className="text-gray-500 text-sm">{productsData?.length || 0} item</div>
            </header>

            <div className="flex flex-wrap -mx-3">
                {productsData?.map((value, index) => (
                    <article key={index} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center transition-shadow hover:shadow-xl m-3 flex-grow basis-0 min-w-[calc(50%-1.5rem)]">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                            {value[0].productName}
                        </h2>

                        <div className="w-full h-24 bg-gray-200 rounded-xl flex justify-center items-center mb-6" aria-label="Barcode image placeholder">
                            <canvas ref={e => (canvasRef.current[index] = e)}></canvas>
                        </div>

                        <button type="button" className="bg-indigo-600 text-white font-semibold py-2 px-7 rounded-xl shadow-md hover:bg-indigo-700 transition-colors">
                            Print
                        </button>
                    </article>
                ))}
            </div>
            {msg && <p>{msg}</p>}
        </div>
    )
}

export default Barcodes