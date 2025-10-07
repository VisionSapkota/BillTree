"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Load from "./Load"

const RegisterForm = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")
    const [isLoad, setIsLoad] = useState(false)

    const handler = async (e) => {
        e.preventDefault()
        setMessage("")
        try {
            setIsLoad(true)
            let baseURL = process.env.NEXT_PUBLIC_BASE_URL;
            const { error } = await supabase.auth.signUp({ email, password, options: {
                emailRedirectTo: `${baseURL}/register/details`
            } })

            error ? setMessage(error.message) : setMessage("Registration successful! Please check your email for confirmation.");
        } catch(error) {
            console.error(error)
            setMessage("Unexpected Error Occur. Please try again.")
        } finally {
            setIsLoad(false)
        }
    }

    return (
        <form onSubmit={handler}>
            <input
                type="email"
                placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full text-black mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300" />
            <input
                type="password"
                placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full text-black mb-6 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300" />
            <button className="w-full flex items-center justify-center cursor-pointer bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-300">
                {isLoad ? <Load /> : "Register"}
            </button>
            {message && <p className={`text-center text-red-600 text-base font-semibold mt-4`}>{message}</p>}
        </form>
    )
}

export default RegisterForm