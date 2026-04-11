"use client"

const UserFooter = () => {
    return (
        <>
          <footer className="text-center text-sm text-gray-500 border-t pt-4 mt-10">
            &copy; {new Daete().getFullYear} BillTree. All rights reserved.
          </footer>
        </>
    )
}

export default UserFooter