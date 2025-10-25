"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faPhone, faStore, faIdCard, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

const RegistrationDetails = () => {
    const [name, setName] = useState("")
    const [address, setAddress] = useState("")
    const [contact, setContact] = useState("")
    const [PANLen, setPANLen] = useState("")
    const [PAN, setPAN] = useState("")
    const [message, setMessage] = useState("")
    const [isLoad, setIsLoad] = useState(false)
    const router = useRouter()

    const submitHandler = async (e) => {
        e.preventDefault()

        try {
            setIsLoad(true)
            let { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                const { data: sessionData, error:  sessionError} = await supabase.auth.exchangeCodeForSession(window.location.href);
                user = sessionData?.user;

                if (sessionError) router.push("/register")
            }

            const { error } = await supabase.from("Store Info").upsert([
                {
                    id: user.id,
                    store_name: name,
                    store_address: address,
                    contact: contact,
                    PAN: PAN
                }
            ], { onConflict: ['id'] })

            if (error) {
                setMessage(error.message)
                return;
            }
            
            router.push("/dashboard")
        } catch (error) {
            console.error(error)
            setMessage("Unexpected Error Occur. Please try again.")
        } finally {
            setName("")
            setAddress("")
            setContact("")
            setPAN("")
            setIsLoad(false)
        }
    }

    useEffect(() => {
        setPANLen(`${PAN.length}/9`);
    }, [PAN])

    return (
        <form className="flex flex-col gap-6" onSubmit={submitHandler}>
            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1"><FontAwesomeIcon icon={faStore} /> Store Name</label>
                <input type="text" required className="outline-none w-full border border-gray-300 rounded px-4 py-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Store Name" />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1"><FontAwesomeIcon icon={faLocationDot} /> Address</label>
                <input type="text" required className="outline-none w-full border border-gray-300 rounded px-4 py-2" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Store Address" />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1"><FontAwesomeIcon icon={faPhone} /> Contact Number</label>
                <input type="number" required className="outline-none w-full border border-gray-300 rounded px-4 py-2" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="98XXXXXXX" />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1"><FontAwesomeIcon icon={faIdCard} /> PAN <span className={`text-gray-400 ${PANLen === "9/9" ? "text-green-500" : "text-red-500"}`}>{PANLen}</span></label>
                <input type="text" inputMode="numeric" pattern="\d{9}" maxLength={9} minLength={9} required className="outline-none w-full border border-gray-300 rounded px-4 py-2" value={PAN} onChange={(e) => setPAN(e.target.value)} placeholder="PAN no." />
            </div>

            <div className="flex justify-end gap-4">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer">Continue {isLoad && <FontAwesomeIcon icon={faSpinner} spin />}</button>
            </div>

            {message && <p className="text-center text-red-600 text-base font-semibold mt-4">{message}</p>}
        </form>
    )
}

export default RegistrationDetails