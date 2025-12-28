"use client"
import Sidebar from "@/components/Sidebar"
import { supabase } from "@/lib/supabaseClient"
import { useState, useEffect } from "react"

const page = () => {
  const [userName, setUserName] = useState("")

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setUserName(session.user?.email.split("@")[0])
    })()
  })

  return (
    <div className="bg-gray-100 flex flex-col md:flex-row min-h-screen">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 mt-4 md:ml-70 md:mt-0">
        <div>
          <h1 className="text-3xl font-bold mb-4 text-black">Home Page</h1>
          <div className="bg-white p-6 rounded shadow">
            <p className="text-xl text-gray-700 font-semibold">👋 Welcome back, {userName}!</p>
            <p className="text-gray-600 mt-2">
              You can start managing your inventory using the sidebar. Select an option to proceed.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default page