"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";
import ErrorMessage from "./ErrorMessage";
import { loginApi, signupApi, setToken } from "@/utils/api";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

type AuthMode = "login" | "signup";

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose }) => {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (mode === "signup" && !formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (mode === "signup") {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.confirmPassword !== formData.password) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      let response;
      if (mode === "login") {
        response = await loginApi(formData.email, formData.password);
      } else {
        response = await signupApi(
          formData.username,
          formData.email,
          formData.password,
          formData.confirmPassword
        );
      }

      // Store tokens
      setToken(response.access, response.refresh);

      // Success!
      onClose();
      router.push("/home");
    } catch (error: any) {
      // Handle API errors (could be a string or JSON string from signupApi)
      try {
        const apiError = JSON.parse(error.message);
        const mappedErrors: Record<string, string> = {};
        Object.keys(apiError).forEach((key) => {
          const val = apiError[key];
          mappedErrors[key] = Array.isArray(val) ? val[0] : val;
        });
        setErrors(mappedErrors);
      } catch {
        setErrors({ general: error.message || "An error occurred. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "signup" : "login"));
    setErrors({});
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-gray-500 mt-2">
            {mode === "login"
              ? "Sign in to your account to continue"
              : "Join us today and start your journey"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="johndoe"
                className={`w-full px-4 py-3 text-black rounded-xl border ${errors.username ? "border-red-500" : "border-gray-200"
                  } focus:ring-2 focus:ring-black outline-none transition-all`}
              />
              <ErrorMessage message={errors.username} />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={`w-full px-4 py-3 text-black rounded-xl border ${errors.email ? "border-red-500" : "border-gray-200"
                } focus:ring-2 focus:ring-black outline-none transition-all`}
            />
            <ErrorMessage message={errors.email} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full px-4 py-3 text-black rounded-xl border ${errors.password ? "border-red-500" : "border-gray-200"
                } focus:ring-2 focus:ring-black outline-none transition-all`}
            />
            <ErrorMessage message={errors.password} />
          </div>

          {mode === "signup" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full px-4 py-3 text-black rounded-xl border ${errors.confirmPassword ? "border-red-500" : "border-gray-200"
                  } focus:ring-2 focus:ring-black outline-none transition-all`}
              />
              <ErrorMessage message={errors.confirmPassword} />
            </div>
          )}

          <ErrorMessage message={errors.general} />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white font-semibold py-3 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Processing...</span>
              </>
            ) : mode === "login" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          {mode === "login" ? (
            <p>
              Don't have an account?{" "}
              <button
                onClick={toggleMode}
                className="font-bold text-black hover:underline"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                onClick={toggleMode}
                className="font-bold text-black hover:underline"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AuthModal;
