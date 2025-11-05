"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Login failed");

      toast.success("Login berhasil", {
        position: "top-center",
        duration: 1500,
      });

      switch (data.user.role) {
        case "ADMIN":
          router.push("/admin/dashboard");
          break;
        case "GURU":
          router.push("/guru/dashboard");
          break;
        case "SEKRETARIS":
          router.push("/sekretaris/dashboard");
          break;
        case "VIEW":
          router.push("/view-only/dashboard");
          break;
        default:
          router.push("/dashboard");
          break;
      }
    } catch (err: any) {
      const errorMessage = err.message || "Gagal login";
      toast.error(errorMessage, {
        position: "top-center",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 transition-colors duration-500">
      <Toaster />
      <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 transition-colors duration-500 border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-8">
          <div className="w-24 h-24 flex items-center justify-center mx-auto mb-4 shadow-lg transition-transform duration-300 hover:scale-110">
            <Image
              src="/images/Logo/Sekolah.png"
              alt="Logo"
              width={300}
              height={200}
            />
          </div>
          <h1 className="text-gray-900 dark:text-white text-2xl font-extrabold tracking-wide">
            Login
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 select-none">
            Masuk untuk mengakses dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-gray-700 dark:text-gray-300 text-xs font-semibold mb-2"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={8}
              maxLength={16}
              placeholder="Masukkan username"
              className="w-full rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 text-sm font-medium placeholder-gray-500 dark:placeholder-gray-400
              focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 border border-gray-300 dark:border-gray-600"
            />
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-gray-700 dark:text-gray-300 text-xs font-semibold mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              maxLength={30}
              placeholder="Masukkan password"
              className="w-full rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 text-sm font-medium placeholder-gray-500 dark:placeholder-gray-400
              focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 pr-12 border border-gray-300 dark:border-gray-600"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              className="absolute bottom-3 right-3 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded p-1"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.045.178-2.05.513-3.003M3 3l18 18"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.88 9.88a3 3 0 104.243 4.243"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
              } focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50 text-white rounded-xl px-4 py-3 text-sm font-semibold tracking-wide shadow-md transition duration-300 select-none`}
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>

          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6 select-none">
            © 2025 RPL SMKN Katapang.
          </p>
        </form>
      </div>
    </div>
  );
}