"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Load from "./Load"

const ForgotPasswordEmailForm = () => {
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")
    const [isLoad, setIsLoad] = useState(false)

    const submitHandler = async (e) => {
        e.preventDefault();
        setIsLoad(true)
        const baseURL = process.env.REACT_APP_BASE_URL;
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${baseURL}/reset/password`
        })

        error ? setMessage(error.message) : setMessage("Please check your email for password reset link.")
        setIsLoad(false)
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
                className="w-full cursor-pointer bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-5">
                {isLoad ? <Load /> : "Send Password Reset Request"}
            </button>
            {message && <p className={`text-center text-red-600 text-base font-semibold mt-4`}>{message}</p>}
        </form>
    )
}

export default ForgotPasswordEmailForm