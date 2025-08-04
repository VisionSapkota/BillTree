import Barcodes from "@/components/Barcodes"
import Sidebar from "@/components/Sidebar"

const page = () => {
  return (
        <div className="bg-gray-100 min-h-screen md:flex">
          <Sidebar />
    
          {/* Main Content */}
          <main className="flex-1 p-6 mt-4 md:ml-70 md:mt-0 text-black">
            <div className="max-w-5xl mx-auto bg-white p-8 rounded shadow">
                <Barcodes />
            </div>
          </main>
        </div>
  )
}

export default page