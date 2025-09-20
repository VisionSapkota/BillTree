'use client'
import { useState } from "react";
import SidebarItem from "./SidebarItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faHouse, faPlus, faCubes, faBoxOpen, faTableList, faFolderPlus, faCircleUser, faGear } from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="md:hidden bg-[#111] w-full text-white p-3"
                aria-label="Toggle sidebar"
            >
                <span><FontAwesomeIcon icon={faBars} /> Menu</span>
            </button>

            {/* Sidebar */}
            <nav id="hideScrollbar" className={`bg-[#111] select-none text-white w-60 h-screen flex flex-col items-center
                transform transition-transform duration-300 ease-in-out overflow-y-auto
                fixed z-2
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                md:translate-x-0`}>

                <h2 className="font-bold text-xl mt-5">BillTree</h2>
                <div className="mt-3 w-full h-full flex flex-col text-lg pl-3 justify-evenly">
                    <SidebarItem href="/dashboard" icon={faHouse} label="Home" />
                    <SidebarItem href="/new" icon={faPlus} label="New" />
                    <SidebarItem href="/receipts" icon={faBoxOpen} label="Receipts" />
                    <SidebarItem href="/stock" icon={faCubes} label="In Stock" />
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