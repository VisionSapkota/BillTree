import Sidebar from "@/components/Sidebar"
import StoreDetails from "@/components/StoreDetails"
import ChangePassword from "@/components/ChangePassword"

const page = () => {
  return (
    <div className="bg-gray-100 min-h-screen md:flex">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 mt-4 md:ml-70 md:mt-0 text-black">
        <div className="max-w-5xl mx-auto bg-white p-8 rounded shadow">
          <h1 className="text-3xl font-bold mb-8 text-center">Store Settings</h1>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Store Information</h2>
            <StoreDetails />
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            <div className="space-y-4">
              <ChangePassword />
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Legal</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li><a href="" className="text-blue-600 hover:underline">Terms and Conditions</a></li>
              <li><a href="" className="text-blue-600 hover:underline">Privacy Policy</a></li>
            </ul>
          </section>

          <section className="mb-10">
            <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer">Log Out</button>
          </section>

          <footer className="text-center text-sm text-gray-500 border-t pt-4 mt-10">
            &copy; {new Date().getFullYear()} Sauji Ko Calculator. All rights reserved.
          </footer>
        </div>
      </main>
    </div>
  )
}

export default page