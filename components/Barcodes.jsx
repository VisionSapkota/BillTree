"use client"
import { useRef, useEffect, useState } from "react"
import JsBarcode from "jsbarcode";
import { supabase } from "@/lib/supabaseClient";

const Barcodes = () => {
    const ref = useRef(null)
    const [productsData, setProductsData] = useState([])

    useEffect(() => {
        (async () => {
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

            setProductsData(data[0].productDetails);
        })();
    }, [])

    useEffect(() => {
        productsData.map(value => {
            JsBarcode(ref.current, value[0].barcode, {
                format: "code128",
                displayValue: true,
                fontSize: 18,
                height: 50,
            })
        })
    }, [productsData])

    return (
        <div>
            <canvas ref={ref}></canvas>
        </div>
    )
}

export default Barcodes