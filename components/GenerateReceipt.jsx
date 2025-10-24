"use client"
import "@/styles/receiptPrinter.css"
import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState, useRef } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faShuffle, faFloppyDisk, faPrint, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation"

const GenerateReceipt = () => {
    const [barcodeNum, setBarcodeNum] = useState("")
    const [productName, setProductName] = useState("")
    const [rate, setRate] = useState("")
    const [rateSP, setRateSP] = useState("")
    const [spcDiscount, setSpcDiscount] = useState("")
    const [quantity, setQuantity] = useState("")
    const [total, setTotal] = useState("")
    const [isBarcode, setIsBarcode] = useState(true)
    const [finalData, setFinalData] = useState([])
    const [receiptData, setReceiptData] = useState([])
    const [receiptNumber, setReceiptNumber] = useState(1)
    const [date, setDate] = useState("")
    const [data, setData] = useState([])
    const [final, setFinal] = useState(0)
    const [discount, setDiscount] = useState(0)
    const [grandTotal, setGrandTotal] = useState(0)
    const [stock, setStock] = useState(null)
    const [saveLoader, setSaveLoader] = useState(false)
    const [addLoader, setAddLoader] = useState(false)
    const [msg, setMsg] = useState("")
    const [error, setError] = useState("")
    const [edit, setEdit] = useState(false)
    const [editBarcode, setEditBarcode] = useState("")
    const [editName, setEditName] = useState("")
    const [editRate, setEditRate] = useState(0)
    const [editRateSP, setEditRateSP] = useState(0)
    const [editSpcDiscount, setEditSpcDiscount] = useState(0)
    const [editQuantity, setEditQuantity] = useState(0)
    const [editTotal, setEditTotal] = useState(0)
    const [editStock, setEditStock] = useState(null)
    const [idx, setIdx] = useState()
    const [isEditBarcode, setIsEditBarcode] = useState(true)
    const [editError, setEditError] = useState("")
    const [defaultData, setDefaultData] = useState({
        store_name: "BillTree",
        store_address: "Not Specified",
        contact: "Not Specified",
        email: ""
    })
    const router = useRouter()
    const barcodeRef = useRef(null)
    const nameRef = useRef(null)
    const quantityRef = useRef(null)

    // Generate Receipt
    // Total Calculator
    useEffect(() => {
        const SP = rate - ((spcDiscount / 100) * rate);
        setRateSP(SP);
    }, [rate, spcDiscount])

    useEffect(() => {
        const r = Number(rateSP);
        const q = Number(quantity);

        setTotal(r * q);
    }, [rateSP, quantity])

    useEffect(() => {

        (async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) router.push("/login")

            const { data, error } = await supabase.from("productList").select("productDetails").eq('id', user?.id).single()

            error ? setMsg(error.message) : setFinalData(data.productDetails);
        })()
    }, [])

    useEffect(() => {
        finalData.map((value) => {

            if (value[0].productName === productName && !isBarcode) {
                setBarcodeNum(value[0].barcode);
                setRate(value[0].mp);
                setSpcDiscount(value[0].discount);
                setStock(value[0].stock);
                setQuantity(0);
            } else if (value[0].barcode === barcodeNum && isBarcode) {
                setProductName(value[0].productName);
                setRate(value[0].mp);
                setSpcDiscount(value[0].discount);
                setStock(value[0].stock);
                setQuantity(0);
            }

            if (value[0].productName === editName && !isEditBarcode) {
                setEditBarcode(value[0].barcode);
                setEditRate(value[0].mp);
                setEditSpcDiscount(value[0].discount);
                setEditStock(value[0].stock);
                setEditQuantity(0);
            } else if (value[0].barcode === editBarcode && isEditBarcode) {
                setEditName(value[0].productName);
                setEditRate(value[0].mp);
                setEditSpcDiscount(value[0].discount);
                setEditStock(value[0].stock);
                setEditQuantity(0);
            }
        })
    }, [productName, barcodeNum, editBarcode, editName, finalData])

    const submitHandler = async (e) => {
        e.preventDefault();
        setAddLoader(true)
        setMsg("")

        try {
            if (barcodeNum === "" || productName === "" || quantity === "") {
                setMsg(`${barcodeNum === "" ? "Barcode Number" : productName === "" ? "Product Name" : "Quantity"} is empty.`);
                return;
            }

            if (quantity === 0) {
                setMsg("Quantity cannot be zero.");
                quantityRef.current.focus();
                return;
            }

            let isDuplicate = false;
            receiptData.map((value) => {
                if (value[0].barcode === barcodeNum || value[0].name === productName) {
                    isDuplicate = true;
                }
            })

            if (isDuplicate) {
                setMsg("Product already added");
                isBarcode ? barcodeRef.current.focus() : nameRef.current.focus();
                return;
            }

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) router.push("/login")

            const { data: [{ productDetails }], error } = await supabase.from("productList").select("productDetails").eq("id", user?.id);
            if (error) {
                setMsg(error)
                return;
            }

            const matchedProduct = productDetails.find(
                value => value[0].barcode === barcodeNum && value[0].productName === productName
            );

            if (!matchedProduct) {
                setMsg("Product barcode doesn't match.");
                setRate("")
                setQuantity("")
                return;
            } else if (matchedProduct[0].stock === 0) {
                setMsg("Product is out of stock.");
                setRate("")
                setQuantity("")
                return;
            } else {
                setMsg("");
            }

            if (quantity > matchedProduct[0].stock) {
                setMsg(`Quantity exceeds available stock. Available Stock = ${stock}`);
                quantityRef.current.focus();
                return;
            }

            const newEntry = [{
                barcode: barcodeNum,
                name: productName,
                rate: Number(rate),
                rateSP: Number(rateSP),
                prodDiscount: Number(spcDiscount),
                quantity: Number(quantity),
                total: Number(total)
            }];

            const updatedData = [...receiptData, newEntry];

            setReceiptData(updatedData);
            setBarcodeNum("");
            setProductName("");
            setRate("");
            setQuantity("");
        } catch (error) {
            console.error(error)
            setMsg("Unexpected Error Occur. Please try again.")
            setBarcodeNum("");
            setProductName("");
            setRate("");
            setQuantity("");
        } finally {
            setAddLoader(false)
        }
    };

    // Receipt Number
    useEffect(() => {
        (async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) router.push("/login")

            const { data: [{ details }] } = await supabase.from("receipts").select("details").eq('id', user.id)

            const lastReceipt = details[details.length - 1];
            const lastMeta = lastReceipt?.[lastReceipt?.length - 1][0] || 0;

            setReceiptNumber((lastMeta?.receiptNum + 1) || 1);
        })()
    }, [receiptData])

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
            if (!user) router.push("/login")

            const { data, error } = await supabase.from("Store Info").select("*").eq("id", user?.id);
            setDefaultData((dataa) => ({
                ...dataa,
                email: user?.email
            }));

            error ? setError(error.message) : setData(data[0]);
        })();
    }, [])

    // Total, Discount, Grand Total
    useEffect(() => {
        if (discount > 100) {
            setDiscount(Number(discount.toString().slice(0, discount.toString().length - 1)));
            return;
        }

        if (discount < 0) {
            setDiscount(Math.abs(discount));
            return;
        }

        let final = 0;
        let discountAmt = 0;

        receiptData.map((value) => {
            final += value[0].total;
        })

        discountAmt = final * (discount / 100);

        setFinal(Number(final.toFixed(2)))
        setGrandTotal(Number((final - discountAmt).toFixed(2)))
    }, [receiptData, discount])

    // Submit your Receipt
    const submitReceipt = async (e, isPrint) => {
        e.preventDefault();
        setError("")

        try {
            setSaveLoader(true)

            if (receiptData.length === 0) {
                setError("Empty receipts cannot be submitted");
                return;
            }

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) router.push("/login")

            const { data, error } = await supabase.from("receipts").select("details").eq("id", user.id)

            if (error) {
                setError(error.message);
                return;
            }

            let allData = [
                ...(data?.[0]?.details || []),
                [
                    ...receiptData,
                    [
                        {
                            receiptNum: receiptNumber,
                            date: date,
                            final: Number(final),
                            discount: Number(final - grandTotal),
                            grandTotal: Number(grandTotal)
                        }
                    ]
                ]
            ]

            const { error: upsertError } = await supabase.from("receipts").upsert([
                {
                    id: user.id,
                    details: allData
                }
            ], { onConflict: ['id'] })

            if (upsertError) {
                setError(upsertError.message)
                return;
            }

            await quantityChanger(user.id, receiptData);

            if (isPrint) {
                setTimeout(() => {
                    window.print();
                }, 1000)
            }
        } catch (error) {
            console.error(error);
            setError("Unexpected error occur. Please try again.");
        } finally {
            setTimeout(() => {
                setReceiptData([]);
                setDiscount(0);
                setSaveLoader(false);
            }, isPrint ? 2000 : 0)
        }
    }

    // Change Quantity in product list
    const quantityChanger = async (id, receiptData) => {
        const { data: [{ productDetails }] } = await supabase.from("productList").select("productDetails").eq('id', id)

        receiptData.map((value) => {
            productDetails.map((data) => {
                if (value?.[0]?.barcode === data?.[0]?.barcode) {
                    data[0].stock -= value[0].quantity
                }
            })
        })

        const { error } = await supabase.from("productList").update({ productDetails }).eq("id", id)
        if (error) setError(error.message);
    }

    // Delete a specific product from receipt
    const deleteHandler = (index) => {
        let updatedData = [...receiptData]

        updatedData.splice(index, 1);
        setReceiptData(updatedData);
    }

    useEffect(() => {
        const SP = editRate - ((editSpcDiscount / 100) * editRate);
        setEditRateSP(SP.toFixed(2));
    }, [editRate, editSpcDiscount])

    useEffect(() => {
        const total = editRateSP * editQuantity;
        setEditTotal(total.toFixed(2));
    }, [editQuantity, editRateSP])

    const editSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editBarcode === "" || editName === "" || editRate === "" || editQuantity === "") {
                setEditError("Please fill in the details.")
                return;
            }

            let isDuplicate = false;
            receiptData.filter((_, i) => i !== idx).map((value) => {
                if (value[0].barcode === editBarcode || value[0].name === editName) {
                    isDuplicate = true;
                }
            })

            if (isDuplicate) {
                setEditError("Product already added");
                return;
            }

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) router.push("/login")

            const { data: [{ productDetails }], error } = await supabase.from("productList").select("productDetails").eq("id", user?.id);
            if (error) {
                setEditError(error)
                return;
            }

            const matchedProduct = productDetails.find(
                value => value[0].barcode === editBarcode && value[0].productName === editName
            );

            if (!matchedProduct) {
                setEditError("Product barcode doesn't match.");
                setRate("")
                setQuantity("")
                return;
            } else if (matchedProduct[0].stock === 0) {
                setEditError("Product is out of stock.");
                setRate("")
                setQuantity("")
                return;
            } else {
                setEditError("");
            }

            if (editQuantity > matchedProduct[0].stock) {
                setEditError(`Quantity exceeds available stock. Available Stock = ${editStock}`);
                return;
            }

            const newData = [...receiptData];
            const updatedData = [{
                barcode: editBarcode,
                name: editName,
                quantity: Number(editQuantity),
                rate: Number(editRate),
                rateSP: Number(editRateSP),
                prodDiscount: Number(editSpcDiscount),
                total: Number(editTotal)
            }]

            newData[idx] = updatedData
            setReceiptData(newData)

            setEditBarcode("")
            setEditName("")
            setEditRate(0)
            setEditQuantity(0)
            setEditTotal(0)
            setEdit(false)
        } catch (error) {
            console.error(error);
            setEditError("Unexpected error occur. Please try again.")
        }
    }

    return (
        <>
            {/* Generate */}
            <form className="space-y-4" onSubmit={submitHandler}>
                <div className="flex gap-2">
                    {isBarcode ?
                        <div className="w-full">
                            <label className="block font-medium text-gray-700">Barcode Number</label>
                            <input type="number" ref={barcodeRef} value={barcodeNum} onChange={(e) => setBarcodeNum(e.target.value)} className="w-full p-2 text-black border border-gray-300 rounded outline-none"
                                placeholder="Enter barcode number" />
                        </div>
                        :
                        <div className="w-full">
                            <label className="block font-medium text-gray-700">Product Name</label>
                            <input type="text" ref={nameRef} list="productDetails" value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full p-2 text-black border border-gray-300 rounded outline-none"
                                placeholder="Enter product name" />
                        </div>
                    }
                    <div className="self-end">
                        <button type="button" className="bg-[#111] text-white px-4 py-2 rounded outline-none hover:bg-gray-800 transition cursor-pointer"
                            onClick={() => setIsBarcode(!isBarcode)}><FontAwesomeIcon icon={faShuffle} /></button>
                    </div>
                </div>

                <div>
                    <label className="block font-medium text-gray-700">Rate (MP)</label>
                    <input readOnly type="number" value={rate} min="0.01" step="0.01" className="cursor-not-allowed w-full bg-[#f9fafb] p-2 text-[#6b7280] border border-gray-300 rounded outline-none"
                        placeholder="MP" />
                </div>

                <div>
                    <label className="block font-medium text-gray-700">Rate (SP)</label>
                    <input readOnly type="number" value={rateSP} min="0.01" step="0.01" className="cursor-not-allowed w-full bg-[#f9fafb] p-2 text-[#6b7280] border border-gray-300 rounded outline-none"
                        placeholder="SP" />
                </div>

                <div>
                    <label className="block font-medium text-gray-700">Quantity</label>
                    <input type="number" value={quantity} ref={quantityRef} min="0" step="0.01" onChange={(e) => setQuantity(e.target.value)} className="w-full p-2 text-black border border-gray-300 rounded outline-none"
                        placeholder="Enter Quantity" />
                </div>

                <div className="flex items-center justify-between mt-10 flex-wrap gap-y-5">
                    <button type="submit"
                        className="bg-[#111] text-white px-4 py-2 rounded outline-none hover:bg-gray-800 transition cursor-pointer">Add Entry {addLoader && <FontAwesomeIcon icon={faSpinner} spin />}</button>

                    <div className="flex justify-between flex-col bg-white border overflow-x-auto border-gray-200 rounded-lg px-5 py-2 shadow-sm">
                        <p className="text-green-600 text-4xl font-bold">Rs. {total.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}</p>
                    </div>
                </div>

                <div className="text-center text-[#ff0000] font-bold">
                    <p>{msg}</p>
                </div>

                <datalist id="productDetails">
                    {finalData.map((value, index) => (
                        value[0].stock !== 0 && (<option key={index} value={value[0].productName}></option>)
                    ))}
                </datalist>
            </form>

            {/* Edit Receipt */}
            {edit && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6">

                        <div className="flex justify-between items-center border-b pb-3 mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Edit</h2>
                        </div>

                        <form className="space-y-4" onSubmit={editSubmit}>
                            <div className="grid grid-cols-2 gap-4">
                                {isEditBarcode ? (
                                    <div>
                                        <label className="block w-full text-sm font-medium text-gray-700 mb-1">Barcode</label>
                                        <input type="number" value={editBarcode} required onChange={(e) => setEditBarcode(e.target.value)} className="w-full p-2 border border-gray-400 rounded outline-none" placeholder="Enter barcode" />
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block w-full text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                        <input type="text" list="productDetails" maxLength="50" required value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full px-3 py-2 border border-gray-400 outline-none rounded-md" placeholder="Enter name" />
                                    </div>
                                )}
                                <div className="self-end">
                                    <button type="button" className="bg-[#111] text-white px-4 py-2 rounded outline-none hover:bg-gray-800 transition cursor-pointer"
                                        onClick={() => setIsEditBarcode(!isEditBarcode)}><FontAwesomeIcon icon={faShuffle} /></button>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Rate (MP)</label>
                                    <input type="number" required min="0.01" step="0.01" value={editRate} readOnly className="w-full px-3 py-2 border border-gray-400 bg-gray-100 text-gray-500 cursor-not-allowed outline-none rounded-md" placeholder="0" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Rate (SP)</label>
                                    <input type="number" required min="0.01" step="0.01" value={editRateSP} readOnly className="w-full px-3 py-2 border border-gray-400 bg-gray-100 text-gray-500 cursor-not-allowed outline-none rounded-md" placeholder="0" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                    <input type="number" required min="0" step="0.01" value={editQuantity} onChange={(e) => setEditQuantity(e.target.value)} className="w-full px-3 py-2 border border-gray-400 outline-none rounded-md" placeholder="0" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                                    <input type="number" required value={editTotal} readOnly className="w-full px-3 py-2 border border-gray-400 bg-gray-100 text-gray-500 cursor-not-allowed outline-none rounded-md" placeholder="0" />
                                </div>
                            </div>

                            <div className="text-center text-[#ff0000] my-3 font-bold">
                                <p>{editError}</p>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button type="reset" onClick={() => setEdit(false)} className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 cursor-pointer">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Receipt */}
            <div id="print-receipt" className="bg-white p-6 rounded shadow max-w-2xl mt-10 text-black">
                <header className="text-center p-4 mb-8 border-b border-gray-300">
                    <h1 className="text-3xl font-bold mb-1">{data?.store_name || defaultData.store_name}</h1>
                    <address className="not-italic text-sm mb-1">
                        {data?.store_address || defaultData.store_address}
                    </address>
                    <div className="text-sm">
                        <span className="no-underline after:content-['|'] after:mx-1">{data?.contact || defaultData.contact}</span>
                        <span className="no-underline">{data?.email || defaultData.email || "Not Specified"}</span>
                    </div>

                    <div className="flex items-center justify-left mt-2 w-fit">
                        <h2 className="md:text-xl sm:text-lg whitespace-nowrap font-semibold mt-2">PAN no.</h2>
                        <table className="ml-4 border-collapse">
                            <tbody>
                                <tr className="border border-black">
                                    <td className="border border-black p-1">{data?.PAN?.split("")?.[0] || "#"}</td>
                                    <td className="border border-black p-1">{data?.PAN?.split("")?.[1] || "#"}</td>
                                    <td className="border border-black p-1">{data?.PAN?.split("")?.[2] || "#"}</td>
                                    <td className="border border-black p-1">{data?.PAN?.split("")?.[3] || "#"}</td>
                                    <td className="border border-black p-1">{data?.PAN?.split("")?.[4] || "#"}</td>
                                    <td className="border border-black p-1">{data?.PAN?.split("")?.[5] || "#"}</td>
                                    <td className="border border-black p-1">{data?.PAN?.split("")?.[6] || "#"}</td>
                                    <td className="border border-black p-1">{data?.PAN?.split("")?.[7] || "#"}</td>
                                    <td className="border border-black p-1">{data?.PAN?.split("")?.[8] || "#"}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                        
                    <div>
                        <h2 className="text-2xl font-bold mt-4">Sales Invoices</h2>
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

                {/* Receipt Table */}
                <div className="overflow-x-auto mt-2">
                    <table className="w-full text-left border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 border-b border-gray-200 whitespace-nowrap">S.N.</th>
                                <th className="p-2 border-b border-gray-200 whitespace-nowrap">Product Name</th>
                                <th className="p-2 border-b border-gray-200 whitespace-nowrap">Rate</th>
                                <th className="p-2 border-b border-gray-200 whitespace-nowrap">Quantity</th>
                                <th className="p-2 border-b border-gray-200 whitespace-nowrap">Total</th>
                                <th id="action" className="p-2 border-b border-gray-200 whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>

                        <tbody id="transactionTableBody">
                            {receiptData.map((value, index) => (
                                <tr key={index}>
                                    <td className="p-2 border-b border-gray-200 whitespace-nowrap">{index + 1}</td>
                                    <td className="p-2 border-b border-gray-200 whitespace-nowrap">{value[0].name}</td>
                                    <td className="p-2 border-b border-gray-200 whitespace-nowrap">{value[0].prodDiscount ? <span><p className="line-through text-red-500">Rs. {value[0].rate}</p> Rs. {value[0].rateSP}</span> : <span>Rs. {value[0].rateSP}</span>}</td>
                                    <td className="p-2 border-b border-gray-200 whitespace-nowrap">{value[0].quantity}</td>
                                    <td className="p-2 border-b border-gray-200 whitespace-nowrap">Rs. {value[0].total}</td>
                                    <td id="action" className="p-2 border-b border-gray-200 flex items-center justify-between gap-3">
                                        <button type="button" onClick={() => { setEdit(true); setIdx(index) }} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-sm cursor-pointer"><FontAwesomeIcon icon={faPen} /></button>
                                        <button type='button' onClick={() => deleteHandler(index)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm cursor-pointer"><FontAwesomeIcon icon={faTrash} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 p-4 rounded bg-gray-50 shadow-sm w-full max-w-md ml-auto">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">Total:</span>
                        <span>Rs. {final}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="font-semibold">Discount(%):</label>
                        <div>
                            <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} className="print:hidden text-right border border-gray-300 p-1 w-20 rounded focus:outline-none text-sm"
                                placeholder="0%" min="0" max="100" />
                            <span className="hidden print:block">{discount || 0}%</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center border-t pt-2 mt-2">
                        <span className="font-bold text-lg">Grand Total:</span>
                        <span className="text-lg font-bold">Rs. {grandTotal}</span>
                    </div>
                </div>

                <div className="flex items-center justify-end mt-10 gap-5">
                    <button type="submit" onClick={(e) => submitReceipt(e, false)}
                        className="bg-[#111] text-white px-4 py-2 rounded outline-none hover:bg-gray-800 transition cursor-pointer flex items-center justify-center gap-2"><FontAwesomeIcon icon={faFloppyDisk} /> Save <span>{saveLoader && <FontAwesomeIcon icon={faSpinner} spin />}</span></button>
                    <button type="submit" onClick={(e) => submitReceipt(e, true)}
                        className="bg-[#111] text-white px-4 py-2 rounded outline-none hover:bg-gray-800 transition cursor-pointer flex items-center justify-center gap-2"><FontAwesomeIcon icon={faPrint} /> Save & Print <span>{saveLoader && <FontAwesomeIcon icon={faSpinner} spin />}</span></button>
                </div>

                <div className="text-center text-[#ff0000] font-bold">
                    <p>{error}</p>
                </div>
            </div>
        </>
    )
}

export default GenerateReceipt