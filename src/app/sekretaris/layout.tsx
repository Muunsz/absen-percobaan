// File: src/app/guru/layout.tsx
import type React from "react";
import SidebarSekretaris from "../components/layout/SekretarisSidebar"; // Sesuaikan path jika berbeda

export default function SekretarisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <SidebarSekretaris>
        <div>{children}</div>
      </SidebarSekretaris>
    </div>
  );
}