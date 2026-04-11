"use client"
import { useState, useRef, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import Link from "next/link"

const RegisterForm = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")
    const [isLoad, setIsLoad] = useState(false)
    const [captchaToken, setCaptchaToken] = useState("")
    const captcha = useRef();

    const handler = async (e) => {
        e.preventDefault()
        setMessage("")
        try {
            setIsLoad(true)
            let baseURL = process.env.NEXT_PUBLIC_BASE_URL;
            const { error } = await supabase.auth.signUp({
                email, password, options: {
                    captchaToken,
                    emailRedirectTo: `${baseURL}/register/details`
                }
            })

            captcha.current.resetCaptcha();
            error ? setMessage(error.message) : setMessage("Registration successful! Please check your email for confirmation.");
        } catch (error) {
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
                className="w-full text-black mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300" />

            <div className="flex items-center justify-center">
                <HCaptcha ref={captcha} sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY} onVerify={setCaptchaToken} />
            </div>

            <div className="my-4 text-sm text-gray-600">
                By registering, you agree to our{' '}
                <Link href="/terms-and-conditions" className="text-blue-600 hover:underline" target="_blank">
                    Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link href="/privacy-policy" className="text-blue-600 hover:underline" target="_blank">
                    Privacy Policy
                </Link>.
            </div>

            <button className="w-full flex items-center justify-center cursor-pointer bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-300 flex items-center justify-center gap-2">
                Register <span>{isLoad && <FontAwesomeIcon icon={faSpinner} spin />}</span>
            </button>
            {message && <p className={`text-center text-red-600 text-base font-semibold mt-4`}>{message}</p>}
        </form>
    )
}

export default RegisterForm