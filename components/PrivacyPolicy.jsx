"use client"
import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState } from "react"

const PrivacyPolicy = () => {

    const [data, setData] = useState([])

    useEffect(() => {
        (async () => {
            const { data: [{ privacy_policy }] } = await supabase.from("policies").select("privacy_policy")

            setData(privacy_policy)
        })()
    }, [])
    return (
        <>
            <main className="max-w-4xl mx-auto py-12 px-4">
            {data.map((value, index) => (
                    <section className="mb-10" key={index}>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">{index + 1}. {value?.[0]?.title}</h2>
                    <p className="text-gray-700 leading-relaxed">{value?.[0]?.description}</p>
                </section>))}
            </main>
        </>
    )
}

export default PrivacyPolicy