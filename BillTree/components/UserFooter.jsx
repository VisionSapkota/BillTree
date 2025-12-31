"use client"
import { useState, useEffect } from "react"

const UserFooter = () => {
    const [year, setYear] = useState("")

    useEffect(() => {
      setYear(new Date().getFullYear())
    }, [])
    
    return (
        <>
          <footer className="text-center text-sm text-gray-500 border-t pt-4 mt-10">
            &copy; {year} BillTree. All rights reserved.
          </footer>
        </>
    )
}

export default UserFooter