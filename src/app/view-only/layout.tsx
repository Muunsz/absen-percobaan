// File: src/app/guru/layout.tsx
import type React from "react";
import SidebarView from "../components/layout/ViewSidebar"; // Sesuaikan path jika berbeda

export default function ViewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <SidebarView>
        <div>{children}</div>
      </SidebarView>
    </div>
  );
}