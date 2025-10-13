'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SidebarItem = ({href, icon, label}) => {
    const path = usePathname();
    return (
        <Link href={href} className={`cursor-pointer ${(path === href) || (path === "/barcodes" && label === "Products List") ? "bg-[#333]" : "bg-none hover:bg-[#222]"} w-full p-3 rounded-l-xl`}>
            <FontAwesomeIcon icon={icon} />
            <span className="ml-3">{label}</span>
        </Link>
    )
}

export default SidebarItem