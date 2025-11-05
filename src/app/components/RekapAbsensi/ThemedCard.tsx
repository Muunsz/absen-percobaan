import React from "react"

export const ThemedCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <section
    className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}
  >
    {children}
  </section>
)