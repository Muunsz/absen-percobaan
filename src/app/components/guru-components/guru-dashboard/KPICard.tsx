// components/guru-components/guru-dashboard/KPICard.tsx
"use client";
import { LucideIcon } from "lucide-react";

type KPICardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: string;
};

export default function KPICard({ title, value, subtitle, icon: Icon, color }: KPICardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color.replace("text-", "bg-").replace("500", "100")} dark:${color.replace("text-", "bg-").replace("500", "900/30")}`}>
          <Icon className={`h-6 w-6 ${color} dark:${color.replace("600", "400")}`} />
        </div>
      </div>
      {subtitle && (
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          {subtitle}
        </div>
      )}
    </div>
  );
}