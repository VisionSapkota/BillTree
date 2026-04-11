import ResetPassword from "@/components/ResetPassword"

const page = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Reset Password</h2>
                <ResetPassword />
            </div>
        </div>
    )
}

export default page