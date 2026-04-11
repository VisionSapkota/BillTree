"use client"
import "@/styles/barcodeCardPrinter.css"
import { useRef, useEffect, useState } from "react"
import JsBarcode from "jsbarcode";
import { supabase } from "@/lib/supabaseClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faXmark, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/navigation"

const Barcodes = () => {
    const [productsData, setProductsData] = useState([])
    const [msg, setMsg] = useState("")
    const [copiesPage, setCopiesPage] = useState(false)
    const [copies, setCopies] = useState(1)
    const [idx, setIdx] = useState(null)
    const router = useRouter()
    const [copiesLoader, setCopiesLoader] = useState(false)
    const [printLoader, setPrintLoader] = useState(false)
    const canvasRef = useRef([])
    const cardRef = useRef([])
    const printAllRef = useRef()

    useEffect(() => {
        (async () => {
            setMsg("")
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError) {
                router.push("/login")
                return;
            }

            const { data, error } = await supabase.from("productList").select("productDetails").eq("id", user.id);
            if (error) {
                setMsg("Error", error.message);
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

    const printHandler = (e) => {
        e.preventDefault();
        setCopiesLoader(true);
        setCopiesPage(false);

        let card = null;
        if (!idx && idx !== 0) {
            card = printAllRef.current;
        } else {
            card = cardRef.current?.[idx];
        }

        let copy = "";
        for (let i = 1; i <= copies; i++) {
            copy += `
                <div style="margin-bottom: 20px;">
                    ${card.outerHTML}
                </div>
            `
        }
        setPrintLoader(false);
        setCopiesLoader(false);

        const print = window.open('', '', 'width=1200, height=700');
        print.document.write(`
            <html>
                <head>
                    <title>Print</title>
                    <style>
                        * {
                            font-family: Arial, sans-serif;
                        }
                        
                        body, #print-cards {
                            display: flex;
                            flex-wrap: wrap;
                            justify-content: space-evenly;
                            row-gap: 10px;
                            width: 100%;
                        }

                        button {
                            display: none !important;
                        }
                    </style>
                </head>
                <body>
                    ${copy}
                </body>
            </html>
        `)

        print.document.close();
        print.focus();
        print.print();
        print.onafterprint = () => print.close();
        setCopies(1)
        setIdx(null)
        setCopiesLoader(false);

        setTimeout(() => {
            if (!print.closed) print.close();
        }, 100);
    }

    return (
        <>
            {copiesPage && <div className="print:hidden fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6">

                    <div className="flex justify-between items-center border-b pb-3 mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">Copies</h2>
                        <button
                            type="button"
                            onClick={() => setCopiesPage(false)}
                            className="bg-[#111111] cursor-pointer text-white hover:opacity-85 w-8 h-8 sm:w-10 sm:h-10 rounded-full text-lg flex items-center justify-center">
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </div>

                    <form className="space-y-4" onSubmit={printHandler}>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="block w-full text-sm font-medium text-gray-700 mb-1">Copies</label>
                                <p className="block w-full text-xs font-medium text-gray-700 mb-1">10/page (A4, default margin)</p>
                            </div>
                            <input type="number" min="1" required value={copies} onChange={(e) => setCopies(e.target.value)} className="w-full px-3 py-2 border border-gray-400 outline-none rounded-md" placeholder="No. of copies" />
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">Proceed {copiesLoader && <FontAwesomeIcon icon={faSpinner} spin />}</button>
                        </div>
                    </form>
                </div>
            </div>}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen font-sans">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2 sm:gap-0">
                    <h1 className="text-3xl font-bold text-gray-900">Barcodes</h1>
                    <div className="text-gray-500 text-sm">{productsData?.length || 0} item{productsData?.length !== 1 ? 's' : ''}</div>
                </header>

                <div id="print-cards" ref={printAllRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-6">
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
                                <svg ref={e => (canvasRef.current[index] = e)} width="200" height="50" className="max-w-full max-h-full"></svg>
                            </div>
                            <button
                                onClick={() => { setCopiesPage(true); setIdx(index); setPrintLoader(true); }}
                                type="button"
                                className="bg-indigo-600 cursor-pointer text-white font-semibold py-2 px-7 rounded-xl shadow-md hover:bg-indigo-700 transition-colors">
                                Print {printLoader && <FontAwesomeIcon icon={faSpinner} spin />}
                            </button>
                        </div>
                    ))}
                </div>

                <button onClick={printHandler} type="button" className="h-15 w-15 bg-black text-white flex items-center justify-center rounded-full text-2xl cursor-pointer hover:bg-[#111111] transition-all duration-300 ease-in z-3 fixed right-5 bottom-5"><FontAwesomeIcon icon={faPrint} /></button>

                {msg && <p className="mt-4 text-red-500">{msg}</p>}
            </div>
        </>
    )
}

export default Barcodes