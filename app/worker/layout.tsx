"use client"

import type React from "react"
import { Navbar2 } from "@/components/navbar2"
import { usePathname } from "next/navigation"

export default function WorkerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/worker/login"

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900">
      {!isLoginPage && <Navbar2 />}
      <main className="pt-24">
        {children}
      </main>
    </div>
  )
} 