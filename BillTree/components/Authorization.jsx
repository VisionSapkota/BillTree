"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const Authorization = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        (async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push("/login")
            }
            setIsLoading(false)
        })();
    }, [])

    return (
        <>
            {isLoading && <div className="fixed top-0 z-10 flex items-center justify-center bg-[#ffffff11] backdrop-blur-sm h-screen w-screen gap-5 flex-col">
                <p className="text-xl font-bold">Authorizing...</p>
                <div><FontAwesomeIcon icon={faSpinner} spin size="5x" /></div>
            </div>}
        </>
    )
}

export default Authorization