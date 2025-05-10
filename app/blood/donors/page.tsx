import { DonorInfo } from "@/components/donor"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Add this line to force dynamic rendering
export const dynamic = "force-dynamic"

export default function DonorsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Donors</h1>
        <Button asChild>
          <Link href="/blood/donors/register">Register as Donor</Link>
        </Button>
      </div>
      <DonorInfo />
    </div>
  )
}

