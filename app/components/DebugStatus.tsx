"use client";

import { useEffect, useState } from "react";

export function DebugStatus() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        console.log("[DEBUG] DebugStatus mounted");
        setMounted(true);
    }, []);

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: 9999,
                background: mounted ? "green" : "red",
                color: "white",
                padding: "10px",
                fontWeight: "bold",
            }}
        >
            JS STATUS: {mounted ? "ALIVE (Hydrated)" : "SSR (Waiting)"}
        </div>
    );
}
