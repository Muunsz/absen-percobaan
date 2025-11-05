// src/app/components/Absensi/StatusButton.tsx
"use client";

import React from "react";

type Status = "HADIR" | "SAKIT" | "IZIN" | "ALPA" | null;

const META: Record<string, { label: string; badgeClass: string; icon: string }> = {
  HADIR: { label: "Hadir", badgeClass: "bg-green-500/20 text-green-400", icon: "✅" },
  SAKIT: { label: "Sakit", badgeClass: "bg-yellow-500/20 text-yellow-400", icon: "🤒" },
  IZIN: { label: "Izin", badgeClass: "bg-purple-600/20 text-purple-300", icon: "📝" },
  ALPA: { label: "Alpa", badgeClass: "bg-red-500/20 text-red-400", icon: "❌" },
};

interface Props {
  status: Status;
  selected: boolean;
  onClick: (s: Status) => void;
}

export default function StatusButton({ status, selected, onClick }: Props) {
  if (!status) return null;
  const m = META[status];
  return (
    <button
      type="button"
      onClick={() => onClick(status)}
      className={`flex items-center gap-2 text-sm px-3 py-1 rounded-full border transition select-none ${
        selected ? `${m.badgeClass} border-transparent ring-1` : "bg-gray-700/30 text-gray-200 border-gray-700"
      }`}
      aria-pressed={selected}
    >
      <span className="text-xs">{m.icon}</span>
      <span className="font-medium">{m.label}</span>
    </button>
  );
}
