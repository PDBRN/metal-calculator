import { Suspense } from "react";
import { Calculator } from "./components/Calculator";

console.log("[BUNDLE] page.tsx LOADED");

export default function Home() {
  return (
    <main>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-white text-zinc-500 font-sans p-4 text-center">
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
            <p>Загрузка калькулятора (v3)...</p>
          </div>
        </div>
      }>
        <Calculator />
      </Suspense>
    </main>
  );
}