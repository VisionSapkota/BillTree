import Sidebar from "@/components/Sidebar"
import Profile from "@/components/Profile"

const page = () => {
  return (
    <div className="bg-gray-100 min-h-screen md:flex">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 mt-4 md:ml-70 md:mt-0 text-black">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow">
          <h1 className="text-3xl font-bold mb-6 text-center">Store Profile</h1>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-4">
              <Profile />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default page