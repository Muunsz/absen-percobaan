// File: src/app/guru/layout.tsx
import type React from "react";
import SidebarGuru from "../components/layout/GuruSidebar"; // Sesuaikan path jika berbeda

export default function GuruLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <SidebarGuru>
        <div>{children}</div>
      </SidebarGuru>
    </div>
  );
}