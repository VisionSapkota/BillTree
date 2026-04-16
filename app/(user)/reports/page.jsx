import Sidebar from "@/components/Sidebar"
import SalesReport from "@/components/SalesReport"
import TopProducts from "@/components/TopProducts"

const page = () => {
    return (
    <div className="bg-gray-100 flex flex-col md:flex-row min-h-screen">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 mt-4 md:ml-70 md:mt-0">
        <div className="flex flex-col gap-8">
            <SalesReport />
            <TopProducts />
        </div>
      </main>
    </div>
    )
}

export default page