"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faEnvelope, faPhone, faStore, faIdCard, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation"

const StoreDetails = () => {
    const [name, setName] = useState("")
    const [address, setAddress] = useState("")
    const [contact, setContact] = useState("")
    const [PANLen, setPANLen] = useState("")
    const [PAN, setPAN] = useState("")
    const [email, setEmail] = useState("")
    const [resetLoad, setResetLoad] = useState(false)
    const [saveIsLoad, setSaveIsLoad] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    useEffect(() => {
        dataSet()
    }, [])

    const dataSet = async () => {
        setResetLoad(true)
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
        setPAN(data?.PAN)
        setEmail(user?.email)
        setResetLoad(false)
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
                    contact: contact,
                    PAN: PAN
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

    useEffect(() => {
        setPANLen(`${PAN.length}/9`)
    }, [PAN])

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
                <input type="text" className="outline-none w-full border border-gray-300 rounded px-4 py-2" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="98XXXXXXX" />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1"><FontAwesomeIcon icon={faIdCard} /> PAN <span className={`text-gray-400 ${PANLen === "9/9" ? "text-green-500" : "text-red-500"}`}>{PANLen}</span></label>
                <input type="text" inputMode="numeric" required pattern="\d{9}" maxLength={9} minLength={9} className="outline-none w-full border border-gray-300 rounded px-4 py-2" value={PAN} onChange={(e) => setPAN(e.target.value)} placeholder="PAN no." />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1"><FontAwesomeIcon icon={faEnvelope} /> Email</label>
                <input type="email" readOnly className="w-full bg-[#f9fafb] p-2 text-[#6b7280] border border-gray-300 rounded outline-none cursor-not-allowed" value={email} />
            </div>

            <div className="flex justify-end gap-4">
                <button type="reset" className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 cursor-pointer" onClick={dataSet} >Cancel {resetLoad && <FontAwesomeIcon icon={faSpinner} spin />}</button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer">Save Changes {saveIsLoad && <FontAwesomeIcon icon={faSpinner} spin />}</button>
            </div>
            {error && <p className="text-center text-red-600 text-base font-semibold mt-4">{error}</p>}
        </form>
    )
}

export default StoreDetails