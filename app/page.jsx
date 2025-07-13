import GetStarted from "@/components/GetStarted"

const page = () => {
  return (
    <>
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-xl p-8 max-w-lg text-center">
          <h1 className="text-4xl font-bold text-purple-700 mb-4">BillTree</h1>
          <p className="text-gray-700 text-lg mb-6">
            BillTree is an easy-to-use billing software designed for everyone. It's a packaged solution to help you manage your inventory, receipts, and barcodes — all in one place.
          </p>
          <GetStarted />
        </div>
      </div>
    </>
  )
}

export default page