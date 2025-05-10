import { DonorRegistrationForm } from "@/components/donor-registration-form"

export default function DonorRegistrationPage() {
  return (
    <div className="max-w-md mx-auto">
      <div className="glass-card p-8">
        <h1 className="text-2xl font-bold mb-6 text-white text-center">Register as Donor</h1>
        <DonorRegistrationForm />
      </div>
    </div>
  )
}

