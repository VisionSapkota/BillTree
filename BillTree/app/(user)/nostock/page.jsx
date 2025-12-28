import Sidebar from "@/components/Sidebar"
import NoStock from "@/components/NoStock"

const page = () => {
  return (
    <div className="bg-gray-100 min-h-screen md:flex">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 mt-4 md:ml-70 md:mt-0">
        <div>
          <h1 className="text-3xl font-bold mb-4 text-black">Out of Stock</h1>
          <div className="bg-white p-6 rounded shadow max-w-6xl text-black overflow-x-auto">
            <NoStock />
          </div>
        </div>
      </main>
    </div>
  )
}

export default page