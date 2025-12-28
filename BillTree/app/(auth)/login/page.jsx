import LoginForm from '@/components/LoginForm'

const page = () => {
    return (
        <>
            <div className="bg-purple-50 flex items-center justify-center min-h-screen">
                <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
                    <h2 className="text-4xl font-bold mb-6 text-center text-purple-700">Login</h2>
                        <LoginForm />
                </div>
            </div>
        </>
    )
}

export default page