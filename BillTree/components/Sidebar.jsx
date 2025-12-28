'use client'
import { useState } from "react";
import SidebarItem from "./SidebarItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faBars, faHouse, faPlus, faCubes, faBoxOpen, faTableList, faFolderPlus, faCircleUser, faGear } from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <>
            <button onClick={toggleSidebar} className="md:hidden print:hidden bg-[#111] w-10 h-10 rounded-full text-white mt-3 ml-3">
                <FontAwesomeIcon icon={faBars} />
            </button>

            {/* Sidebar */}
            <nav id="hideScrollbar" className={`print:hidden bg-[#111] select-none text-white w-60 h-screen flex flex-col items-center
                transform transition-transform duration-300 ease-in-out overflow-y-auto
                fixed top-0 z-2
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                md:translate-x-0`}>
                <div className="flex items-center justify-between md:justify-center w-full px-3 py-5">
                    {/* Mobile Toggle Button */}
                    <h2 className="font-bold text-xl text-center">BillTree</h2>
                    <button
                        onClick={toggleSidebar}
                        className="md:hidden print:hidden bg-transparent text-white"
                        aria-label="Toggle sidebar">
                        <span><FontAwesomeIcon icon={faXmark} className="text-xl" /></span>
                    </button>
                </div>
                <div className="mt-3 w-full h-full flex flex-col text-lg pl-3 justify-evenly">
                    <SidebarItem href="/dashboard" icon={faHouse} label="Home" />
                    <SidebarItem href="/new" icon={faPlus} label="New" />
                    <SidebarItem href="/receipts" icon={faBoxOpen} label="Receipts" />
                    <SidebarItem href="/nostock" icon={faCubes} label="Out of Stock" />
                    <SidebarItem href="/products" icon={faTableList} label="Products List" />
                    <SidebarItem href="/add" icon={faFolderPlus} label="Add Products" />
                    <SidebarItem href="/profile" icon={faCircleUser} label="Profile" />
                    <SidebarItem href="/settings" icon={faGear} label="Settings" />
                </div>
            </nav>
        </>
    )
}

export default Sidebar