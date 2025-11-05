"use client";

import Link from "next/link";
import React from "react";

interface KelasCardProps {
  label: string;
  color: string;
  href: string;
  icon: React.ReactNode; // Bisa emoji, <Image />, dll
}

export default function KelasCard({ label, color, href, icon }: KelasCardProps) {
  return (
    <Link href={href}>
      <div
        className="rounded-2xl p-5 shadow-lg transition-all cursor-pointer hover:-translate-y-1 hover:shadow-2xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
      >
        <div className="text-center flex flex-col items-center justify-center gap-3">
          <div
            className="mx-auto h-14 w-14 rounded-full grid place-items-center text-2xl overflow-hidden relative"
            style={{
              backgroundColor: `${color}20`,
              border: `2px solid ${color}`,
              color: color
            }}
          >
            {icon}
          </div>

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {label}
          </h2>

          <div
            className="mt-2 px-4 py-1.5 rounded-lg text-sm font-medium"
            style={{ backgroundColor: `${color}33`, color }}
          >
            Pilih →
          </div>
        </div>
      </div>
    </Link>
  );
}
