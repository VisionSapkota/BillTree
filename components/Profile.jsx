"use client"
import Link from "next/link"
import StoreInfo from "./StoreInfo"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faLocationDot, faEnvelope, faPhone, faStore, faIdCard  } from "@fortawesome/free-solid-svg-icons";

const Profile = () => {

    const [data, setData] = useState([])
    const [email, setEmail] = useState()

    useEffect(() => {
        (async () => {
            const { data: { user } = {} } = await supabase.auth.getUser();
            const {data, error} = await supabase.from("Store Info").select("*").eq("id", user.id);
            setEmail(user.email)

            error ? console.error(error.message) : setData(data[0]);
        })();
    }, [])
    

    return (
        <div>
            <StoreInfo label="Store Name" icon={faStore} info={data?.store_name || "BilTree"} />
            <StoreInfo label="Address" icon={faLocationDot} info={data?.store_address || "Not Specified"} />
            <StoreInfo label="Contact Number" icon={faPhone} info={data?.contact || "Not Specified"} />
            <StoreInfo label="Email" icon={faEnvelope} info={email || "billtree46@gmail.com"} />
            <StoreInfo label="PAN no," icon={faIdCard} info={data?.PAN || "Not Specified"} />
            <div className="flex gap-4 mt-6">
                <Link href="/settings">
                    <span className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"><FontAwesomeIcon icon={faPen} /> Edit Store Info</span>
                </Link>
            </div>
        </div>
    )
}

export default Profile