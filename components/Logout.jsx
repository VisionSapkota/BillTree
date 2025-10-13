"use client"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import Load from "./Load"

const Logout = () => {
    const [isloading, setIsLoading] = useState(false)

    const router = useRouter()

    const handleLogout = async () => {
        setIsLoading(true)
        const { error } = await supabase.auth.signOut()

        if (error) {
            alert(error.message);
            setIsLoading(false)
        } else {
            router.push("/login");
        }
    }
98
    return (
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer flex items-center justify-center gap-2"><FontAwesomeIcon icon={faRightFromBracket} /> <span>{isloading ? <Load /> : "Log Out"}</span></button>
    )
}

export default Logout