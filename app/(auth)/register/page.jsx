import OldUser from "@/components/OldUser"
import RegisterForm from "@/components/RegisterForm"

const page = () => {
  return (
    <>
      <div className="bg-purple-50 flex items-center justify-center min-h-screen">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
          <h2 className="text-4xl font-bold mb-6 text-center text-purple-700">Register</h2>
            <RegisterForm />
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account? <OldUser />
          </p>
        </div>
      </div>
    </>
  )
}

export default page