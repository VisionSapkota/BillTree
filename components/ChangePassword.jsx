"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faSpinner } from "@fortawesome/free-solid-svg-icons";

const ChangePassword = () => {
    const [currPass, setCurrPass] = useState("")
    const [newPass, setNewPass] = useState("")
    const [confirmPass, setConfirmPass] = useState("")
    const [error, setError] = useState("")
    const [isLoad, setIsLoad] = useState(false)

    const submitHandler = async (e) => {
        e.preventDefault()
        setError("")
        try {
            setIsLoad(true)

            const { data: { user } } = await supabase.auth.getUser()
            const emaill = user.email;
            const { error } = await supabase.auth.signInWithPassword({ email: emaill, password: currPass })

            if (error) {
                setError("Current password is incorrect. Please try again.");
                return;
            }

            if (currPass === newPass) {
                setError("New password cannot be the same as current password.");
                return;
            }

            if (newPass !== confirmPass) {
                setError("New password and confirm password do not match.");
                return;
            }
            changePass()
        } catch (error) {
            console.error(error)
            setError("Unexpected Error Occur. Please try again.")
        } finally {
            setIsLoad(false)
        }
    }

    const changePass = async () => {
        const { error } = await supabase.auth.updateUser({ password: newPass })

        if (error) {
            setError(`Error changing password: ${error.message}`)
            setIsLoad(false)
            return;
        }

        alert("Password changed successfully!");
        setCurrPass("")
        setNewPass("")
        setConfirmPass("")
        setIsLoad(false)
    }

    return (
        <form className="flex flex-col gap-6" onSubmit={submitHandler}>
            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1"><FontAwesomeIcon icon={faLock} />  Current Password</label>
                <input type="password" className="outline-none w-full border border-gray-300 rounded px-4 py-2" value={currPass} onChange={(e) => setCurrPass(e.target.value)} placeholder="Current Password" />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1"><FontAwesomeIcon icon={faLock} />  New Passwords</label>
                <input type="password" className="outline-none w-full border border-gray-300 rounded px-4 py-2" value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder="New Password" />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1"><FontAwesomeIcon icon={faLock} /> Confirm Password</label>
                <input type="password" className="outline-none w-full border border-gray-300 rounded px-4 py-2" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} placeholder="Confirm Password" />
            </div>

            <div className="flex justify-end gap-4">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer">Change Password {isLoad && <FontAwesomeIcon icon={faSpinner} spin />}</button>
            </div>

            {error && <p className="text-center text-red-600 text-base font-semibold mt-4">{error}</p>}
        </form>
    )
}

export default ChangePassword