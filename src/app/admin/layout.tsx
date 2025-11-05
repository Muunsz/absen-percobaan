import type React from "react"
import Sidebar from "../components/layout/AdminSidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <Sidebar>
        <div>{children}</div>
      </Sidebar>
    </div>
  )
}
