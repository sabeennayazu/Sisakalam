"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";

export default function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  function handleLogin() {
    localStorage.setItem("sisakalam_user", email || "dummy");
    onClose(); // close popup
    router.push("/home");
  }

  return (
    <Modal open={open} onClose={onClose}>
      <h1 className="text-2xl text-black font-bold mb-4 text-center">Login</h1>
        <label className="text-black">Email</label>
      <input
        type="email"
        placeholder="Your Email"
        className="w-full border border-black p-2 rounded mb-3"
        onChange={(e) => setEmail(e.target.value)}
      />
        <label className="text-black">Password</label>
      <input
        type="password"
        placeholder="Password"
        className="w-full border border-black p-2 rounded mb-4"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleLogin}
        className="w-full py-2 bg-blue-600 text-white rounded-lg mb-4"
      >
        Login
      </button>

      <p className="text-sm text-black text-center">
        Haven’t made an account?{" "}
        <span
          onClick={() => {
            onClose();
            router.push("/signup");
          }}
          className="text-blue-600 cursor-pointer"
        >
          Sign Up
        </span>
      </p>
    </Modal>
  );
}
