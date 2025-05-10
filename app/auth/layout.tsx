import type React from "react"
import { Navbar } from "@/components/navbar"

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <Navbar />
      <div className="mx-auto px-4 py-8 pt-24">{children}</div>
    </div>
  )
}

