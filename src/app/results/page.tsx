"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Session } from "inspector/promises";

export default function ResultsPage () {
    const router = useRouter();
    const [result, setResult] = useState<string | null>(null)

    useEffect (()=> {
        const stored = sessionStorage.getItem("projectSuggestions");
        if (!stored) {
            router.push("/project-generator");
            return
        }
        setResult(stored);
    },[])

    return ( 
        <div>
            <h1>Your project suggestions :</h1>
            <pre className="whitespace-pre-wrap">{result}</pre>
        </div>
    )
}