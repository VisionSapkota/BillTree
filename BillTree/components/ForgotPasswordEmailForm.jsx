"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const ForgotPasswordEmailForm = () => {
    const [email, setEmail] = useState("")
    const [msg, setMsg] = useState("")
    const [isLoad, setIsLoad] = useState(false)

    const submitHandler = async (e) => {
        e.preventDefault();
        setMsg("")

        try {
            setIsLoad(true)
            const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${baseURL}/reset/password`
            })

            error ? setMsg(error.message) : setMsg("Please check your email for password reset link.")
        } catch (error) {
            console.error(error)
            setMsg("Unexpected Error Occur. Please try again.")
        } finally {
            setIsLoad(false)
        }
    }

    return (
        <form className="flex flex-col gap-4" onSubmit={submitHandler}>
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Email" required />
            </div>

            <button type="submit"
                className="w-full cursor-pointer bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-5 flex items-center justify-center gap-2">
                Send Password Reset Request <span>{isLoad && <FontAwesomeIcon icon={faSpinner} spin />}</span>
            </button>
            {msg && <p className={`text-center text-red-600 text-base font-semibold mt-4`}>{msg}</p>}
        </form>
    )
}

export default ForgotPasswordEmailForm