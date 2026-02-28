"use client";

import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar/Navbar";

export default function HomePage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-white  ">
        <Navbar />

      
      

      
      </div>
    </AuthGuard>
  );
}
