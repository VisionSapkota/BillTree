import Authorization from "@/components/Authorization";
import "../globals.css";

export const metadata = {
    title: "BillTree",
    description: "BillTree is an easy-to-use billing software designed for everyone. It's a packaged solution to help you manage your inventory, receipts, and barcodes — all in one place.",
};

export default async function UserLayout({ children }) {
    return (
        <>
            <Authorization />
            {children}
        </>
    );
}