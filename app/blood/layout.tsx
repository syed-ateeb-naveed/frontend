import type React from "react"
import { Navbar1 } from "@/components/navbar1"

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <Navbar1 />
      <div className="mx-auto px-4 py-8 pt-24">{children}</div>
    </div>
  )
}

