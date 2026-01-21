"use client";

import ComparisonView from "@/components/ComparisonView";

export default function ComparisonPage() {
    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Statute Comparison</h1>
                <p className="text-gray-500">
                    Compare sections from the Indian Penal Code (IPC) with the new Bharatiya Nyaya Sanhita (BNS).
                </p>
            </div>

            <ComparisonView />
        </div>
    );
}
