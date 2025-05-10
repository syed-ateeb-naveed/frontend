import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)]">
      <div className="glass-card p-8 text-center max-w-2xl">
        <h1 className="text-4xl font-bold mb-6 text-white">Welcome to Blood Bank Management System</h1>
        <p className="text-xl mb-8 text-gray-200">
          Efficiently manage blood donations and help save lives. Register as a donor or view available donations.
        </p>
        <div className="space-x-4">
          <Button asChild variant="default" className="bg-red-600 hover:bg-red-700">
            <Link href="/auth/register">Register</Link>
          </Button>
          <Button asChild variant="outline" className="text-black border-white hover:bg-white/10">
            <Link href="/auth/login">Login</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

