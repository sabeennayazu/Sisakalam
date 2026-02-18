"use client";

import AuthGuard from "@/components/AuthGuard";

export default function HomePage() {
  return (
    <AuthGuard>
      <div className="min-h-screen p-8">
        <h1 className="text-4xl font-bold">Your Feed</h1>
        <p className="mt-4 text-gray-600">Here will be all the stories & poems.</p>
      </div>
    </AuthGuard>
  );
}
