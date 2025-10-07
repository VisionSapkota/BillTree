"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faEnvelope, faPhone, faStore } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation"
import Load from "./Load"

const StoreDetails = () => {
    const [name, setName] = useState("")
    const [address, setAddress] = useState("")
    const [contact, setContact] = useState("")
    const [email, setEmail] = useState("")
    const [resetIsLoad, setResetIsLoad] = useState(false)
    const [saveIsLoad, setSaveIsLoad] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    useEffect(() => {
        dataSet()
    }, [])

    const dataSet = async () => {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) router.push("/login")

        const { data, error } = await supabase.from("Store Info").select("*").eq("id", user.id).single()
        if (error) {
            setError(error.message)
            return;
        }

        setName(data?.store_name)
        setAddress(data?.store_address)
        setContact(data?.contact)
        setEmail(user?.email)
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        setError("")

        try {
            setSaveIsLoad(true)

            let { data: { user: { id } = {} } = {} } = await supabase.auth.getUser();
            const { error } = await supabase.from("Store Info").upsert([
                {
                    id: id,
                    store_name: name,
                    store_address: address,
                    contact: contact
                }
            ], { onConflict: ['id'] })

            error ? setError(error.message) : dataSet();
        } catch (error) {
            console.error(error);
            setError("Unexpected Error Occur. Please try again.")
        } finally {
            setSaveIsLoad(false)
        }
    }

    return (
        <form className="flex flex-col gap-6" onSubmit={submitHandler}>
            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1"><FontAwesomeIcon icon={faStore} /> Store Name</label>
                <input type="text" className="outline-none w-full border border-gray-300 rounded px-4 py-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Store Name" />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1"><FontAwesomeIcon icon={faLocationDot} /> Address</label>
                <input type="text" className="outline-none w-full border border-gray-300 rounded px-4 py-2" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Store Address" />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1"><FontAwesomeIcon icon={faPhone} /> Contact Number</label>
                <input type="text" className="outline-none w-full border border-gray-300 rounded px-4 py-2" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="+977 98XXXXXXX" />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1"><FontAwesomeIcon icon={faEnvelope} /> Email</label>
                <input type="email" readOnly className="w-full bg-[#f9fafb] p-2 text-[#6b7280] border border-gray-300 rounded outline-none cursor-not-allowed" value={email} />
            </div>

            <div className="flex justify-end gap-4">
                <button type="reset" className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 cursor-pointer" onClick={dataSet} >{resetIsLoad ? <Load /> : "Cancel"}</button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer">{saveIsLoad ? <Load /> : "Save Changes"}</button>
            </div>
            {error && <p className="text-center text-red-600 text-base font-semibold mt-4">{error}</p>}
        </form>
    )
}

export default StoreDetails