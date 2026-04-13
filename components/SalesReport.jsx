"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

const SalesReport = () => {
    const [todaySale, setTodaySale] = useState(0);
    const [yesterdaySale, setYesterdaySale] = useState(0);
    const [sale7Day, setSale7Day] = useState(0);
    const [sale14Day, setSale14Day] = useState(0);
    const [sale30Day, setSale30Day] = useState(0);
    const [sale60Day, setSale60Day] = useState(0);
    const [sale365Day, setSale365Day] = useState(0);
    const [sale730Day, setSale730Day] = useState(0);

    const [todayPerc, setTodayPerc] = useState(0);
    const [perc7, setPerc7] = useState(0);
    const [perc30, setPerc30] = useState(0);
    const [perc365, setPerc365] = useState(0);

    const router = useRouter();

    useEffect(() => {
        todaySaleData();
    }, [])

    const todaySaleData = async () => {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError) {
            console.error("User not found", userError)
            router.push("/login");
        }

        const { data: [{ details }], error } = await supabase.from("receipts").select("details").eq("id", user.id);

        if (error) console.error("Something went wrong.", error);

        // Today's date
        const today = new Date();
        today.setHours(0, 0, 0, 0)

        // Yesterday's date
        const yesterday = new Date(today)
        yesterday.setDate(today.getDate() - 1)

        // 7 days ago
        const days7 = new Date(today)
        days7.setDate(today.getDate() - 6)
        
        // 14 days ago
        const days14 = new Date(today)
        days14.setDate(today.getDate() - 13)

        // 30 days ago
        const days30 = new Date(today)
        days30.setDate(today.getDate() - 29)

        // 60 days ago
        const days60 = new Date(today)
        days60.setDate(today.getDate() - 59)

        // 365 days ago
        const days365 = new Date(today)
        days365.setDate(today.getDate() - 364)

        // 730 days ago
        const days730 = new Date(today)
        days730.setDate(today.getDate() - 729)

        const todayDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
        const yesterdayDate = `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`;

        let todayCal = 0
        let yesterdayCal = 0
        let dayCal7 = 0
        let dayCal14 = 0
        let dayCal30 = 0
        let dayCal60 = 0
        let dayCal365 = 0
        let dayCal730 = 0

        details.forEach((data) => {
            // Today Sale
            if (data?.[data.length - 1]?.[0]?.date === todayDate) {
                todayCal += data?.[data.length - 1]?.[0]?.grandTotal;
            }

            // Yesterday Sale
            if (data?.[data.length - 1]?.[0]?.date === yesterdayDate) {
                yesterdayCal += data?.[data.length - 1]?.[0]?.grandTotal;
            }

            // 7 days Sale
            if (new Date(data?.[data.length - 1]?.[0]?.date) >= days7 && new Date(data?.[data.length - 1]?.[0]?.date) <= today) {
                dayCal7 += data?.[data.length - 1]?.[0]?.grandTotal;
            }

            // 14 days Sale
            if (new Date(data?.[data.length - 1]?.[0]?.date) >= days14 && new Date(data?.[data.length - 1]?.[0]?.date) <= days7) {
                dayCal14 += data?.[data.length - 1]?.[0]?.grandTotal;
            }

            // 30 days Sale
            if (new Date(data?.[data.length - 1]?.[0]?.date) >= days30 && new Date(data?.[data.length - 1]?.[0]?.date) <= today) {
                dayCal30 += data?.[data.length - 1]?.[0]?.grandTotal;
            }

            // 60 days Sale
            if (new Date(data?.[data.length - 1]?.[0]?.date) >= days60 && new Date(data?.[data.length - 1]?.[0]?.date) <= days30) {
                dayCal60 += data?.[data.length - 1]?.[0]?.grandTotal;
            }

            // 365 days Sale
            if (new Date(data?.[data.length - 1]?.[0]?.date) >= days365 && new Date(data?.[data.length - 1]?.[0]?.date) <= today) {
                dayCal365 += data?.[data.length - 1]?.[0]?.grandTotal;
            }

            // 730 days Sale
            if (new Date(data?.[data.length - 1]?.[0]?.date) >= days730 && new Date(data?.[data.length - 1]?.[0]?.date) <= days365) {
                dayCal730 += data?.[data.length - 1]?.[0]?.grandTotal;
            }

        })
        setTodaySale(todayCal);
        setYesterdaySale(yesterdayCal);
        setSale7Day(dayCal7);
        setSale14Day(dayCal14);
        setSale30Day(dayCal30);
        setSale60Day(dayCal60);
        setSale365Day(dayCal365);
        setSale730Day(dayCal730);
    }

    // Today/yesterday Sale difference (%)
    useEffect(() => {
        if (yesterdaySale !== 0) {
            let percentage = (todaySale - yesterdaySale)/yesterdaySale * 100;
            setTodayPerc(percentage);
        } else {
            setTodayPerc(null)
        }
    }, [todaySale, yesterdaySale])

    // 7 days/14 days Sale difference (%)
    useEffect(() => {
        if (sale14Day !== 0) {
            let percentage = (sale7Day - sale14Day)/sale14Day * 100;
            setPerc7(percentage);
        } else {
            setPerc7(null)
        }
    }, [sale7Day, sale14Day])

    // 30 days/60 days Sale difference (%)
    useEffect(() => {
        if (sale60Day !== 0) {
            let percentage = (sale30Day - sale60Day)/sale60Day * 100;
            setPerc30(percentage);
        } else {
            setPerc30(null)
        }
    }, [sale30Day, sale60Day])

    // 365 days/730 days Sale difference (%)
    useEffect(() => {
        if (sale730Day !== 0) {
            let percentage = (sale365Day - sale730Day)/sale730Day * 100;
            setPerc365(percentage);
        } else {
            setPerc365(null)
        }
    }, [sale365Day, sale730Day])

    return (
        <>
            <h1 className="text-3xl font-bold mt-20 text-black">Reports</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-screen gap-x-6 gap-y-1">
                <div className="bg-white p-4 rounded-xl border-l-4 border-green-500 shadow my-5 flex flex-1 flex-col">
                    <p className="font-semibold text-lg">Today's Sale</p>
                    <p className="text-2xl font-bold mt-5 mb-1">Rs. {todaySale.toLocaleString(navigator.language, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}</p>
                    <p className={`text-xs ${todayPerc >= 0 ? "text-green-500" : "text-red-500"}`}>{todayPerc !== null ? todayPerc >= 0 ? "+" : "" : ""}{todayPerc !== null ? todayPerc.toFixed(2) : "N/A"}% from yesterday</p>
                </div>
                <div className="bg-white p-4 rounded-xl border-l-4 border-blue-500 shadow my-5 flex flex-1 flex-col">
                    <p className="font-semibold text-lg">Weekly Revenue</p>
                    <p className="text-2xl font-bold mt-5 mb-1">Rs. {sale7Day.toLocaleString(navigator.language, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}</p>
                    <p className={`text-xs ${perc7 >= 0 ? "text-green-500" : "text-red-500"}`}>{perc7 !== null ? perc7 >= 0 ? "+" : "" : ""}{perc7 !== null ? perc7.toFixed(2) : "N/A"}% from previous 7 days</p>
                </div>
                <div className="bg-white p-4 rounded-xl border-l-4 border-purple-500 shadow my-5 flex flex-1 flex-col">
                    <p className="font-semibold text-lg">Monthly Revenue</p>
                    <p className="text-2xl font-bold mt-5 mb-1">Rs. {sale30Day.toLocaleString(navigator.language, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}</p>
                    <p className={`text-xs ${perc30 >= 0 ? "text-green-500" : "text-red-500"}`}>{perc30 !== null ? perc30 >= 0 ? "+" : "" : ""}{perc30 !== null ? perc30.toFixed(2) : "N/A"}% from previous 30 days</p>
                </div>
                <div className="bg-white p-4 rounded-xl border-l-4 border-yellow-500 shadow my-5 flex flex-1 flex-col">
                    <p className="font-semibold text-lg">Yearly Revenue</p>
                    <p className="text-2xl font-bold mt-5 mb-1">Rs. {sale365Day.toLocaleString(navigator.language, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}</p>
                    <p className={`text-xs ${perc365 >= 0 ? "text-green-500" : "text-red-500"}`}>{perc365 !== null ? perc365 >= 0 ? "+" : "" : ""}{perc365 !== null ? perc365.toFixed(2) : "N/A"}% from previous 365 days</p>
                </div>
            </div>
        </>
    )
}

export default SalesReport