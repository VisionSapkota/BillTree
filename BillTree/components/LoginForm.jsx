"use client"
import NewUser from "./NewUser"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useRef } from "react"
import { supabase } from "@/lib/supabaseClient"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import HCaptcha from "@hcaptcha/react-hcaptcha";

const LoginForm = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoad, setIsLoad] = useState(false)
    const [captchaToken, setCaptchaToken] = useState("")
    const router = useRouter()
    const captcha = useRef();

    const handler = async (e) => {
        e.preventDefault()
        setError("")

        try {
            setIsLoad(true)
            const { error } = await supabase.auth.signInWithPassword({ email, password, options: { captchaToken } })

            captcha.current.resetCaptcha();
            error ? setError(error.message) : router.push("/dashboard");
        } catch (error) {
            console.error(error)
            setError("Unexpected Error Occur. Please try again.")
        } finally {
            setIsLoad(false)
        }
    }

    return (
        <div>
            <form onSubmit={handler}>
                <input type="email" placeholder="john_doe@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 text-black" />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 text-black" />
                <div className="text-right mb-4">
                    <Link href="/reset"><span className="text-sm text-purple-600 hover:underline">Forgot your password?</span></Link>
                </div>
                <div className="flex items-center justify-center">
                    <HCaptcha ref={captcha} sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY} onVerify={setCaptchaToken} />
                </div>
                <button className="w-full mt-4 flex items-center justify-center cursor-pointer bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-300 flex items-center justify-center gap-2">
                    Login <span>{isLoad && <FontAwesomeIcon icon={faSpinner} spin />}</span>
                </button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-4">
                Don't have an account? <NewUser />
            </p>
            {error && <p className="text-center text-red-600 text-base font-semibold mt-4">{error}</p>}
        </div>
    )
}

export default LoginForm