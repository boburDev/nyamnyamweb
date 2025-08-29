"use client"

import { useSearchParams } from "next/navigation"

export default function VerifyPage() {
    const params = useSearchParams();
    const to = params.get("to");
    
    return (
        <div className="min-h-screen flex items-center justify-center">
            Verify Page {to}
        </div>
    )
}