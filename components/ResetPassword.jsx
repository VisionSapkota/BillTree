"use client"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const ResetPassword = () => {
    const [allow, setAllow] = useState(false)
    const [newPass, setNewPass] = useState("")
    const [confirmPass, setConfirmPass] = useState("")
    const [error, setError] = useState("")
    const [isLoad, setIsLoad] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'PASSWORD_RECOVERY') setAllow(true)
        })

        return () => {
            subscription.unsubscribe();
        }

    }, [])

    const submitHandler = async (e) => {
        e.preventDefault();
        setError("")
        try {
            setIsLoad(true)

            if (newPass !== confirmPass) {
                setError("New password and confirm password do not match.")
                return;
            }
            
            const { error } = await supabase.auth.updateUser({ password: newPass });
            error ? setError(error.message) : "Password Changed Successfully. Redirecting...";
            router.push("/login")
        } catch (error) {
            console.error(error)
            setError("Unexpected Error Occur. Please try again.")
        } finally {
            setIsLoad(false)
        }
    }

    return (
        <div>
            {allow &&
                <form className="flex flex-col gap-4" onSubmit={submitHandler}>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">New Password</label>
                        <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="New Password" />
                    </div>

                    <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-600 mb-1">Confirm New
                            Password</label>
                        <input type="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Confirm your password" />
                    </div>

                    <button type="submit"
                        className="w-full bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-2">
                        Reset Password <span>{isLoad && <FontAwesomeIcon icon={faSpinner} spin />}</span>
                    </button>
                    {error && <p className="text-center text-red-600 text-base font-semibold mt-4">{error}</p>}
                </form>
            }
        </div>
    )
}

export default ResetPassword