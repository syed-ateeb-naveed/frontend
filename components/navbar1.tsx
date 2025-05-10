"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { logoutUser, getNotificationCount, getNotifications } from "@/app/actions"
import { UserCircle, Syringe, LogOut, Droplet, History, List, Bell } from 'lucide-react'
import { useAuth } from "@/app/contexts/auth-context"
import { useEffect, useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import * as SheetPrimitive from "@radix-ui/react-dialog"

interface Notification {
  id: number
  message: string
  created_at: string
  is_read: boolean
}

export function Navbar1() {
    const router = useRouter()
    const { isAuthenticated, isLoading, logout } = useAuth()
    const [mounted, setMounted] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [isSheetOpen, setIsSheetOpen] = useState(false)
  
    // This effect ensures hydration is complete before rendering
    useEffect(() => {
      setMounted(true)
    }, [])

    // Fetch notification count every 5 seconds
    useEffect(() => {
      const fetchNotificationCount = async () => {
        const data = await getNotificationCount()
        setUnreadCount(data.unread_count)
      }

      fetchNotificationCount()
      const interval = setInterval(fetchNotificationCount, 5000)
      return () => clearInterval(interval)
    }, [])

    // Fetch notifications when sheet is opened
    useEffect(() => {
      const fetchNotifications = async () => {
        if (isSheetOpen) {
          const data = await getNotifications()
          setNotifications(data)
        }
      }

      fetchNotifications()
    }, [isSheetOpen])
  
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

    const NotificationBell = () => (
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="relative text-white hover:text-red-400">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                {unreadCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetPrimitive.Portal>
          <SheetPrimitive.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <SheetContent 
            side="right" 
            className="w-[400px] bg-white/10 backdrop-blur-lg border-l border-white/20"
          >
            <SheetHeader>
              <SheetTitle className="text-white">Notifications</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              {notifications.length === 0 ? (
                <p className="text-white/70 text-center">No notifications</p>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg ${
                      notification.is_read ? 'bg-white/5' : 'bg-white/10'
                    }`}
                  >
                    <p className="text-white">{notification.message}</p>
                    <p className="text-sm text-white/50 mt-2">
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </SheetContent>
        </SheetPrimitive.Portal>
      </Sheet>
    )

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

          <div className="flex flex-col items-center">
            <NotificationBell />
            <span className="text-xs text-white">Notifications</span>
          </div>
          
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

          <NotificationBell />
          
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
