"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { logoutUser } from "@/app/actions"
import { UserCircle, Syringe, LogOut, Droplet, History, List } from 'lucide-react'
import { useAuth } from "@/app/contexts/auth-context"
import { useEffect, useState } from "react"

export function Navbar1() {
    const router = useRouter()
    const { isAuthenticated, isLoading, logout } = useAuth()
    const [mounted, setMounted] = useState(false)
  
    // This effect ensures hydration is complete before rendering
    useEffect(() => {
      setMounted(true)
    }, [])
  
    const handleLogout = async () => {
      await logoutUser()
      logout()
    }
  
    // Don't render anything while checking auth status or during hydration
    if (isLoading || !mounted) {
      return (
        <nav className="nav-blur fixed w-full z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white hover:text-red-400 transition-colors">
              Blood Bank
            </Link>
          </div>
        </nav>
      )
    }

  return (
    <nav className="nav-blur fixed w-full z-50">
      <div className="container mx-auto px-2 py-3 flex items-center justify-between">
        {/* Logo - hidden on mobile */}
        <Link href="/" className="text-2xl font-bold text-white hover:text-red-400 transition-colors hidden md:block">
          Blood Bank
        </Link>
        
        {/* Mobile navigation - full width, equally spaced */}
        <div className="w-full flex justify-around md:hidden">
          <Link 
            href="/blood/my-donations" 
            className="flex flex-col items-center text-white hover:text-red-400"
          >
            <Syringe className="w-5 h-5 mb-1" />
            <span className="text-xs">Donations</span>
          </Link>

          <Link 
            href="/blood/my-requests" 
            className="flex flex-col items-center text-white hover:text-red-400"
          >
            <Droplet className="w-5 h-5 mb-1" />
            <span className="text-xs">Requests</span>
          </Link>
          
          <Link 
            href="/blood/profile" 
            className="flex flex-col items-center text-white hover:text-red-400"
          >
            <UserCircle className="w-5 h-5 mb-1" />
            <span className="text-xs">Profile</span>
          </Link>
          
          <button
            onClick={handleLogout}
            className="flex flex-col items-center text-white hover:text-red-400 bg-transparent border-none"
          >
            <LogOut className="w-5 h-5 mb-1" />
            <span className="text-xs">Logout</span>
          </button>
        </div>
        
        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" asChild className="text-white hover:text-red-400">
            <Link href="/blood/donations/new" className="flex items-center">
              <Syringe className="w-5 h-5 mr-2" />
              Make a Donation
            </Link>
          </Button>

          <Button variant="ghost" asChild className="text-white hover:text-red-400">
            <Link href="/blood/requests/new" className="flex items-center">
              <Droplet className="w-5 h-5 mr-2" />
              Make a Request
            </Link>
          </Button>

          <Button variant="ghost" asChild className="text-white hover:text-red-400">
            <Link href="/blood/my-donations" className="flex items-center">
              <History className="w-5 h-5 mr-2" />
              My Donations
            </Link>
          </Button>

          <Button variant="ghost" asChild className="text-white hover:text-red-400">
            <Link href="/blood/my-requests" className="flex items-center">
              <List className="w-5 h-5 mr-2" />
              My Requests
            </Link>
          </Button>
          
          <Button variant="ghost" asChild className="text-white hover:text-red-400">
            <Link href="/blood/profile" className="flex items-center">
              <UserCircle className="w-5 h-5 mr-2" />
              Profile
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
