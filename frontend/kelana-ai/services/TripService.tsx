// All trip-related API calls live here
import { authHeaders } from "@/services/AuthService"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export interface Trip {
  id: number
  destination: string
  days: number
  budget: number
  category: string
  daily_budget: number
  travel_style: string
  ai_recommendation: string | null
}

export async function getTrips(): Promise<Trip[]> {
  const res = await fetch(`${API_URL}/trips`, {
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error("Failed to fetch trips")
  return res.json()
}

export async function getTrip(id: number): Promise<Trip> {
  const res = await fetch(`${API_URL}/trips/${id}`, {
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error("Failed to fetch trip")
  return res.json()
}

export async function deleteTrip(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/trips/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error(`Failed to delete trip ${id}`)
}

export async function generateTrip(data: unknown): Promise<Trip> {
  const res = await fetch(`${API_URL}/trips`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to generate trip")
  return res.json()
}
