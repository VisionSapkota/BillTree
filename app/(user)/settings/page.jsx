import Sidebar from "@/components/Sidebar"
import StoreDetails from "@/components/StoreDetails"
import ChangePassword from "@/components/ChangePassword"
import Legal from "@/components/Legal"
import Logout from "@/components/Logout"
<<<<<<< HEAD
import UserFooter from "../../../components/userFooter"
=======
>>>>>>> 83ad582034468384225e2e14a8f753d44f184e2e

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
            <Legal />
          </section>

          <section className="mb-10">
            <Logout />
          </section>

<<<<<<< HEAD
          <UserFooter />
=======
          <footer className="text-center text-sm text-gray-500 border-t pt-4 mt-10">
            &copy; {new Date().getFullYear()} BillTree. All rights reserved.
          </footer>
>>>>>>> 83ad582034468384225e2e14a8f753d44f184e2e
        </div>
      </main>
    </div>
  )
}

export default page