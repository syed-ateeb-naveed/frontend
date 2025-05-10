import { NewDonationForm } from "@/components/new-donation-form"

export default function NewDonationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
    <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">New Donation</h1>
        <NewDonationForm />
      </div>
    </div>
  )
}

