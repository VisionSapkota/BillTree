"use client"
import "@/styles/barcodeCardPrinter.css"
import { useRef, useEffect, useState } from "react"
import JsBarcode from "jsbarcode";
import { supabase } from "@/lib/supabaseClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from '@fortawesome/free-solid-svg-icons';

const Barcodes = () => {
    const canvasRef = useRef([])
    const cardRef = useRef([])
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
        productsData?.forEach((value, index) => {
            JsBarcode(canvasRef.current[index], value[0].barcode, {
                format: "code128",
                displayValue: true,
                fontSize: 18,
                height: 50,
            })
        })
    }, [productsData])

    const printHandler = (index = false) => {
        if (!index && index !== 0) {
            window.print();
            return;
        }

        const card = cardRef.current[index];
        if (!card) return;

        const print = window.open('', '', 'width=800, height=600');
        print.document.write(`
            <html>
                <head>
                    <title>Print</title>
                    <style>
                        * {
                            font-family: Arial, sans-serif;
                        }

                        button {
                            display: none !important;
                        }
                    </style>
                </head>
                <body>
                    ${card.outerHTML}
                </body>
            </html>
        `)

        print.document.close();
        print.focus();
        print.print();
        print.onafterprint = () => print.close();

        setTimeout(() => {
            if(!print.closed) print.close();
        }, 100);
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen font-sans">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2 sm:gap-0">
                <h1 className="text-3xl font-bold text-gray-900">Barcodes</h1>
                <div className="text-gray-500 text-sm">{productsData?.length || 0} item{productsData?.length !== 1 ? 's' : ''}</div>
            </header>

            <div id="print-cards" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-6">
                {productsData?.map((value, index) => (
                    <div id="card"
                        key={index} ref={el => cardRef.current[index] = el}
                        className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center transition-shadow hover:shadow-xl w-full">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                            {value[0].productName}
                        </h2>

                        <div
                            className="w-full h-32 sm:h-36 md:h-40 bg-white border-2 border-black rounded-xl flex justify-center items-center mb-6"
                            aria-label="Barcode image placeholder">
                            <svg ref={e => (canvasRef.current[index] = e)} width="200"  height="50" className="max-w-full max-h-full"></svg>
                        </div>
                        <button
                            onClick={() => printHandler(index)}
                            type="button"
                            className="bg-indigo-600 cursor-pointer text-white font-semibold py-2 px-7 rounded-xl shadow-md hover:bg-indigo-700 transition-colors">
                            Print
                        </button>
                    </div>
                ))}
            </div>

            <button onClick={() => printHandler()} type="button" className="h-15 w-15 bg-black text-white flex items-center justify-center rounded-full text-2xl cursor-pointer hover:bg-[#111111] transition-all duration-300 ease-in z-3 fixed right-5 bottom-5"><FontAwesomeIcon icon={faPrint} /></button>

            {msg && <p className="mt-4 text-red-500">{msg}</p>}
        </div>
    )
}

export default Barcodes