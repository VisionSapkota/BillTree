"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

const TopProducts = () => {
    const [prodList, setProdList] = useState({})
    const [sorted, setSorted] = useState([])
    const [sortBy, setSortBy] = useState("Sales")
    const [sortOrder, setSortOrder] = useState("high")
    const [topFrom, setTopFrom] = useState("1")
    const [topTo, setTopTo] = useState("10")

    const router = useRouter()

    useEffect(() => {
        rank();
    }, [])

    useEffect(() => {
        sortProdList()
    }, [prodList, sortBy, sortOrder])

    const rank = async () => {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) {
            console.error("User not found", userError)
            router.push("/login");
        }

        const { data: [{ details }], error } = await supabase.from("receipts").select("details").eq("id", user.id)
        if (error) console.error("We couldn't find your data", error)

        let prodList = {}

        details.forEach((value) => {
            value.forEach((val, index) => {
                if (index !== value.length - 1) {

                    const name = val[0].name

                    if (!prodList[name]) {
                        prodList[name] = {
                            sale: 0,
                            earned: 0
                        }
                    }

                    prodList[name].sale += val[0].quantity
                    prodList[name].earned += val[0].total
                }
            })
        })
        setProdList(prodList)
    }

    const sortProdList = () => {
        const sortedData = Object.entries(prodList).map(data => ({
            name: data[0],
            sales: data[1].sale,
            earned: data[1].earned
        })).sort((a, b) => {
            if (sortBy === "Sales") {
                return sortOrder === "low" ? a.sales - b.sales : b.sales - a.sales
            }
            else if (sortBy === "Earned") {
                return sortOrder === "low" ? a.earned - b.earned : b.earned - a.earned
            }   
            else if (sortBy === "Name") {
                return sortOrder === "low" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
            }
        }).map((value, index) => ({
            rank: index + 1,
            ...value
        }))
        setSorted(sortedData)
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-black">Top Products</h1>

            <div className="bg-white p-4 rounded-xl shadow my-5 w-full overflow-auto">
                <div className="flex items-center justify-evenly flex-wrap gap-y-3">
                    <div className="flex items-center justify-evenly gap-5">
                        <div className="flex items-center justify-center gap-5">
                            <label htmlFor="sorter" className="font-bold text-sm">Sort by:</label>

                            <select name="sorter" className="border border-gray-200 p-2 rounded-xl outline-none" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                <option value="Sales">Sales</option>
                                <option value="Earned">Earned</option>
                                <option value="Name">Name</option>
                            </select>
                        </div>

                        <div className="flex items-center justify-center gap-3">
                            <label htmlFor="sorterOrder" className="font-bold text-sm">Sort order: </label>

                            <select name="sorterOrder" className="border border-gray-200 p-2 rounded-xl outline-none" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                                <option value="low">Low - High</option>
                                <option value="high">High - Low</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-5">
                        <div className="flex items-center justify-left gap-5">
                            <label htmlFor="topFrom" className="font-bold text-sm">From: </label>
                            <input type="text" inputMode="numeric" required pattern="\d{3}" max={99} min={1} maxLength={2} minLength={1} name="topFrom" placeholder="From" className="border border-gray-200 outline-none p-2 rounded-xl w-20" value={topFrom} onChange={(e) => setTopFrom(e.target.value)} />
                        </div>
                        <div className="flex items-center justify-left gap-5">
                            <label htmlFor="topTo" className="font-bold text-sm">To: </label>
                            <input type="text" inputMode="numeric" required pattern="\d{3}" max={99} min={1} maxLength={2} minLength={1} name="topTo" placeholder="To" className="border border-gray-200 outline-none p-2 rounded-xl w-20" value={topTo} onChange={(e) => setTopTo(e.target.value)} />
                        </div>
                    </div>
                </div>


                <table className="w-full mt-5 border-collapse border border-gray-200">
                    <thead className="bg-gray-100 text-center">
                        <tr className="border border-gray-200">
                            <th className="py-2 text-base">S.N.</th>
                            <th className="py-2 text-base">Rank</th>
                            <th className="py-2 text-base">Product</th>
                            <th className="py-2 text-base">Sales</th>
                            <th className="py-2 text-base">Earned</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.slice(Number(topFrom - 1), Number(topTo)).map((data, key) => (
                            <tr key={key}>
                                <td className="p-2 text-center">{key + 1}</td>
                                <td className="p-2 text-center">#{data.rank}</td>
                                <td className="p-2 text-left">{data.name}</td>
                                <td className="p-2 text-center">{data.sales.toFixed(2)}</td>
                                <td className="p-2 text-center">${data.earned.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default TopProducts