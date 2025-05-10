"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

async function fetchWithToken(url: string, options: RequestInit = {}) {
  const cookieStore = await cookies(); // Awaiting inside server action
  const token = cookieStore.get("jwt_token")?.value;

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  return fetch(url, { ...options, headers });
}

export async function registerUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const first_name = formData.get("first_name") as string
  const last_name = formData.get("last_name") as string
  const date_of_birth = formData.get("date_of_birth") as string

  try {
    const response = await fetch(`${API_URL}/user/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, first_name, last_name, date_of_birth }),
    })

    if (response.ok) {
      revalidatePath("/login")
      return { success: true }
    } else {
      const errorData = await response.json()
      return { success: false, error: errorData.message || "Registration failed" }
    }
  } catch (error) {
    console.error("Error during registration:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    const response = await fetch(`${API_URL}/user/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (response.ok) {
      const data = await response.json()
      // Set cookie with proper attributes
        const cookieStore = await cookies();
        cookieStore.set("jwt_token", data.token.access, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      })
      return { success: true }
    } else {
      const errorData = await response.json()
      return { success: false, error: errorData.message || "Login failed" }
    }
  } catch (error) {
    console.error("Error during login:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function logoutUser() {
  // Clear the cookie with the same attributes used when setting it
    const cookieStore = await cookies();
    cookieStore.set("jwt_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  })
  revalidatePath("/")
  return { success: true }
}

export async function getUserInfo() {
  try {
    const response = await fetchWithToken(`${API_URL}/user/`)
    if (response.ok) {
      return {
        success: true,
        data: await response.json(),
      }
    }
  } catch (error) {
    console.error("Error fetching user info:", error)
    return {
      success: false,
      error: "Failed to fetch user information",
    }
  }
}

export async function registerDonor(formData: FormData) {
  const blood_group = formData.get("blood_group") as string
  const gender = formData.get("gender") as string
  const height = formData.get("height") as string
  const weight = formData.get("weight") as string
  const ailments = formData.get("ailments") as string
  try {
    const response = await fetchWithToken(`${API_URL}/donor/register/`, {
      method: "POST",
      body: JSON.stringify({ blood_group, gender, height, weight, ailments }),
    })

    if (response.ok) {
      revalidatePath("/donors")
      return { success: true }
    } else {
      const errorData = await response.json()
      return { success: false, error: errorData.message || "Donor registration failed" }
    }
  } catch (error) {
    console.error("Error during donor registration:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getDonor() {
  try {
    const response = await fetchWithToken(`${API_URL}/donor/`)
    if (response.ok) {
      return await response.json()
    } 
  } catch (error) {
    console.error("Error fetching donors:", error)
    return null
  }
}

export async function getDonations() {
  try {
    const response = await fetchWithToken(`${API_URL}/donor/donations/`)

    // If response is OK, return the results
    if (response.ok) {
      const data = await response.json()
      return data.results || []
    }
    // If response status is 404 (Not Found) or similar, just return empty array
    else if (response.status === 404 || response.status === 204) {
      console.log("No donations found")
      return []
    }
    // For other error statuses, log but still return empty array
    else {
      console.log(`Failed to fetch donations: ${response.status} ${response.statusText}`)
      return []
    }
  } catch (error) {
    console.error("Error fetching donations:", error)
    return []
  }
}

export async function createDonation(formData: FormData) {
  const donorId = formData.get("donorId") as string
  const date = formData.get("date") as string
  const time = formData.get("time") as string
  const units = formData.get("units") as string
  const location = formData.get("location") as string

  try {
    const response = await fetchWithToken(`${API_URL}/donor/donate/`, {
      method: "POST",
      body: JSON.stringify({ donor_id: donorId, date, time, units, location }),
    })

    if (response.ok) {
      revalidatePath("/donations")
      return { success: true }
    } else {
      const errorData = await response.json()
      return { success: false, error: errorData.message || "Failed to create donation" }
    }
  } catch (error) {
    console.error("Error creating donation:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getBloodRequests() {
  try {
    const response = await fetchWithToken(`${API_URL}/patient/requests/`)
    if (response.ok) {
      const data = await response.json()
      return data.results || []
    }
    return []
  } catch (error) {
    console.error("Error fetching blood requests:", error)
    return []
  }
}

export async function createBloodRequest(formData: FormData) {
  const blood_type = formData.get("blood_type") as string
  const units_required = formData.get("units_required") as string
  const request_date = formData.get("request_date") as string

  try {
    const response = await fetchWithToken(`${API_URL}/patient/request/`, {
      method: "POST",
      body: JSON.stringify({
        blood_type,
        units_required: parseInt(units_required),
        request_date,
      }),
    })

    if (response.ok) {
      revalidatePath("/blood/my-requests")
      return { success: true }
    } else {
      const errorData = await response.json()
      return { success: false, error: errorData.message || "Failed to create blood request" }
    }
  } catch (error) {
    console.error("Error creating blood request:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function loginWorker(formData: FormData) {
  try {
    const response = await fetch(`${API_URL}/user/login/`, {
      method: "POST",
      body: formData,
      credentials: "include",
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.detail || "Login failed",
      }
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    return {
      success: false,
      error: "An unexpected error occurred",
    }
  }
}

export async function getWorkerDonations() {
  try {
    const response = await fetchWithToken(`${API_URL}/worker/donations/`)
    if (response.ok) {
      const data = await response.json()
      return data.results || []
    }
    return []
  } catch (error) {
    console.error("Error fetching worker donations:", error)
    return []
  }
}

export async function getWorkerRequests() {
  try {
    const response = await fetchWithToken(`${API_URL}/worker/requests/`)
    if (response.ok) {
      const data = await response.json()
      return data.results || []
    }
    return []
  } catch (error) {
    console.error("Error fetching worker requests:", error)
    return []
  }
}

export async function getWorkerDonationDetails(id: number) {
  try {
    const response = await fetchWithToken(`${API_URL}/worker/donation/${id}/`)
    if (response.ok) {
      return await response.json()
    }
    return null
  } catch (error) {
    console.error("Error fetching worker donation details:", error)
    return null
  }
}

export async function getWorkerRequestDetails(id: number) {
  try {
    const response = await fetchWithToken(`${API_URL}/worker/request/${id}/`)
    if (response.ok) {
      return await response.json()
    }
    return null
  } catch (error) {
    console.error("Error fetching worker request details:", error)
    return null
  }
}

export async function getWorkerDonationsByStatus(status: string) {
  try {
    const response = await fetchWithToken(`${API_URL}/worker/donations/${status}/`)
    if (response.ok) {
      const data = await response.json()
      return data.results || []
    }
    return []
  } catch (error) {
    console.error("Error fetching worker donations by status:", error)
    return []
  }
}

export async function getLocations() {
  try {
    const response = await fetchWithToken(`${API_URL}/donor/locations/`)
    if (response.ok) {
      const data = await response.json()
      return data.results || []
    }
    return []
  } catch (error) {
    console.error("Error fetching locations:", error)
    return []
  }
}

export async function updateDonationStatus(
  donationId: number,
  status: string,
  cancelReason?: string,
  scheduleData?: { date?: string; time?: string; location?: number }
) {
  try {
    const body: any = { status }
    
    if (cancelReason) {
      body.cancel_reason = cancelReason
    }
    
    if (scheduleData) {
      if (scheduleData.date) body.date = scheduleData.date
      if (scheduleData.time) body.time = scheduleData.time
      if (scheduleData.location) body.location = scheduleData.location
    }

    const response = await fetchWithToken(`${API_URL}/worker/donation/${donationId}/`, {
      method: "PATCH",
      body: JSON.stringify(body),
    })

    if (response.ok) {
      return { success: true, data: await response.json() }
    } else {
      const errorData = await response.json()
      return { success: false, error: errorData.message || "Failed to update donation status" }
    }
  } catch (error) {
    console.error("Error updating donation status:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function updateRequestStatus(
  requestId: number,
  status: string,
  declineReason?: string
) {
  try {
    const body: any = { status }
    
    if (declineReason) {
      body.decline_reason = declineReason
    }

    const response = await fetchWithToken(`${API_URL}/worker/request/${requestId}/`, {
      method: "PATCH",
      body: JSON.stringify(body),
    })

    if (response.ok) {
      return { success: true, data: await response.json() }
    } else {
      const errorData = await response.json()
      return { success: false, error: errorData.message || "Failed to update request status" }
    }
  } catch (error) {
    console.error("Error updating request status:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getWorkerRequestsByStatus(status: string) {
  try {
    const response = await fetchWithToken(`${API_URL}/worker/requests/${status}/`)
    if (response.ok) {
      const data = await response.json()
      return data.results || []
    }
    return []
  } catch (error) {
    console.error("Error fetching worker requests by status:", error)
    return []
  }
}

