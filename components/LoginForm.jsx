"use client"
import NewUser from "./NewUser"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

const LoginForm = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const router = useRouter()

    const handler = async (e) => {
        e.preventDefault()
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        error ? setError(error.message) : router.push("/dashboard");
    }

    return (
        <div>
            <form onSubmit={handler}>
                <input type="email" placeholder="john_doe@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 text-black" />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 text-black" />
                <div className="text-right mb-4">
                    <a href="" className="text-sm text-purple-600 hover:underline">Forgot your password?</a>
                </div>
                <button className="w-full text-center cursor-pointer bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-300">
                    Login
                </button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-4">
                Don't have an account? <NewUser />
            </p>
            { error && <p className="text-center text-red-600 text-base font-semibold mt-4">{error}</p>}
        </div>
    )
}

export default LoginForm