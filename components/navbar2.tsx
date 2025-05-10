"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { logoutUser } from "@/app/actions"
import { LogOut, Droplet, Syringe } from 'lucide-react'
import { useAuth } from "@/app/contexts/auth-context"

export function Navbar2() {
  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logoutUser()
    logout()
    router.push("/worker/login")
  }

  return (
    <nav className="nav-blur fixed w-full z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/worker/dashboard" className="text-2xl font-bold text-white hover:text-red-400 transition-colors">
          Worker Dashboard
        </Link>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild className="text-white hover:text-red-400">
            <Link href="/worker/donations" className="flex items-center">
              <Syringe className="w-5 h-5 mr-2" />
              View Donations
            </Link>
          </Button>

          <Button variant="ghost" asChild className="text-white hover:text-red-400">
            <Link href="/worker/requests" className="flex items-center">
              <Droplet className="w-5 h-5 mr-2" />
              View Requests
            </Link>
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={handleLogout} 
            className="text-white hover:text-red-400"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  )
} 