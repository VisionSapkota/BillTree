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
        <div>
            {productsData?.map((value, index) => (
                <canvas key={index} ref={e => (canvasRef.current[index] = e)}></canvas>
            ))}
            {msg && <p>{msg}</p>}
        </div>
    )
}

export default Barcodes