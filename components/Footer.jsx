const Footer = () => {
    return (
        <>
            <footer className="bg-gray-800 text-gray-300 py-6 mt-12">
                <div className="max-w-4xl mx-auto text-center">
                    &copy; {new Date().getFullYear()} BillTree. All rights reserved.
                </div>
            </footer>
        </>
    )
}

export default Footer