"use client"
import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState } from "react"

const TermsConditions = () => {
    const [data, setData] = useState([])

    useEffect(() => {
        (async () => {
            const { data: [{ terms_and_conditions }] } = await supabase.from("policies").select("terms_and_conditions")
            setData(terms_and_conditions)
        })()
    }, [])

    return (
        <>
            <main className="max-w-4xl mx-auto py-12 px-4">
                {data.map((value, index) => (
                    <section className="mb-10" key={index}>
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">{index + 1}. {value?.[0]?.title}</h2>
                        <p className="text-gray-700 leading-relaxed">{value?.[0]?.description}</p>
                    </section>
                ))}
            </main>
        </>
    )
}

export default TermsConditions