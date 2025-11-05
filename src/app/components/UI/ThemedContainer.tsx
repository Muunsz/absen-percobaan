import React from 'react';

interface ThemedContainerProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "gradient" | "accent"
}

export const ThemedContainer = ({
  children,
  className = "",
  variant = "default",
}: ThemedContainerProps) => {
  const variants = {
    default: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
    gradient: "bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-700",
    accent: "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/40 dark:to-indigo-900/40 border border-blue-300 dark:border-blue-700/80",
  }
  return (
    <section className={`rounded-xl p-5 shadow-lg hover:shadow-xl transition-shadow ${variants[variant]} ${className}`}>
      {children}
    </section>
  )
}