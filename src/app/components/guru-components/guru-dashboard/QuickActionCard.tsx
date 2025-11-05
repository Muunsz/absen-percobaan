// components/guru-components/guru-dashboard/QuickActionCard.tsx
"use client";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

type QuickActionCardProps = {
  href: string;
  icon: LucideIcon;
  title: string;
  color: string; // Tailwind color class
};

export default function QuickActionCard({ href, icon: Icon, title, color }: QuickActionCardProps) {
  return (
    <Link href={href} className="block">
      <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md border border-gray-200 dark:border-gray-700 transition-shadow">
        <Icon className={`h-8 w-8 ${color} mb-2`} />
        <span className="text-gray-700 dark:text-gray-300 text-sm">{title}</span>
      </div>
    </Link>
  );
}