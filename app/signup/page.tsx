"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  function handleSignup() {
    localStorage.setItem("sisakalam_user", email || "dummy");
    router.push("/home");
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-6 bg-white shadow-lg rounded-xl w-96">
        <h1 className="text-2xl font-bold mb-4">Create Account</h1>

        <input
          type="email"
          placeholder="Your Email"
          className="w-full border p-2 rounded mb-4"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleSignup}
          className="w-full py-2 bg-green-600 text-white rounded-lg"
        >
          Sign Up
        </button>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-blue-600 cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
