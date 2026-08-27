// All trip-related API calls live here
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
  const res = await fetch(`${API_URL}/trips`)
  return res.json()
}

export async function getTrip(id: number) {
  const res = await fetch(`${API_URL}/trips/${id}`)
  return res.json()
}

export async function deleteTrip(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/trips/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error(`Failed to delete trip ${id}`)
}

export async function generateTrip(data: unknown) {
  const res = await fetch(`${API_URL}/trips`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return res.json()
}
