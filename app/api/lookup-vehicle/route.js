import { NextResponse } from 'next/server'
import { fetchVehicleSpecsFromGroq } from '@/lib/groqVehicleSpecs'

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid JSON body' },
      { status: 400 }
    )
  }

  const registration = String(
    body?.registration ?? body?.vin ?? ''
  ).trim()
  const year = String(body?.year ?? '').trim()
  const vehicleModel = String(
    body?.vehicleModel ?? body?.carModel ?? ''
  ).trim()

  if (!registration || !year || !vehicleModel) {
    return NextResponse.json(
      {
        success: false,
        message: 'registration (or vin), year, and vehicleModel are required',
      },
      { status: 400 }
    )
  }

  const specs = await fetchVehicleSpecsFromGroq({
    registration,
    year,
    vehicleModel,
    carModel: vehicleModel,
  })

  if (!specs) {
    return NextResponse.json(
      {
        success: false,
        message: 'Could not fetch vehicle specifications from Groq.',
      },
      { status: 502 }
    )
  }

  return NextResponse.json({ success: true, data: specs })
}
