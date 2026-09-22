import fs from 'fs'
import path from 'path'
import Groq from 'groq-sdk'

function resolveGroqApiKey() {
  if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim()) {
    return process.env.GROQ_API_KEY.trim()
  }

  const cwd = process.cwd()
  const candidates = [
    path.join(cwd, '.env.local'),
    path.join(cwd, 'report-template', '.env.local'),
    path.join(cwd, '.env'),
  ]

  for (const file of candidates) {
    try {
      if (fs.existsSync(file)) {
        const text = fs.readFileSync(file, 'utf8')
        const m = text.match(/GROQ_API_KEY=(.*)/)
        if (m && m[1].trim()) {
          const key = m[1].trim()
          process.env.GROQ_API_KEY = key
          return key
        }
      }
    } catch {
      /* continue */
    }
  }

  return undefined
}

function resolveGroqModel() {
  if (process.env.GROQ_MODEL && process.env.GROQ_MODEL.trim()) {
    return process.env.GROQ_MODEL.trim()
  }

  const cwd = process.cwd()
  const candidates = [
    path.join(cwd, '.env.local'),
    path.join(cwd, 'report-template', '.env.local'),
  ]

  for (const file of candidates) {
    try {
      if (fs.existsSync(file)) {
        const text = fs.readFileSync(file, 'utf8')
        const m = text.match(/GROQ_MODEL=(.*)/)
        if (m && m[1].trim()) {
          const model = m[1].trim()
          process.env.GROQ_MODEL = model
          return model
        }
      }
    } catch {
      /* continue */
    }
  }

  return 'openai/gpt-oss-120b'
}

function cleanVal(v, fallback = 'N/A') {
  if (v === undefined || v === null) return fallback
  const s = String(v).trim()
  if (!s || s.toLowerCase() === 'undefined' || s.toLowerCase() === 'null') return fallback
  return s
}

function safeParseGroqJson(text) {
  if (!text || typeof text !== 'string') return null
  const trimmed = text.trim()
  const start = trimmed.indexOf('{')
  const end = trimmed.lastIndexOf('}')
  const slice =
    start >= 0 && end > start ? trimmed.slice(start, end + 1) : trimmed
  try {
    const obj = JSON.parse(slice)
    const doors = cleanVal(obj.doors ?? obj.numberOfDoors)
    const transmission = cleanVal(obj.transmission ?? obj.gearbox)
    const engineCap = cleanVal(obj.engineCapacity ?? obj.engine)
    const engineDesc = cleanVal(obj.engine ?? obj.engineCapacity)

    return {
      make: cleanVal(obj.make),
      model: cleanVal(obj.model),
      yearOfManufacture: cleanVal(obj.yearOfManufacture ?? obj.year),
      bodyStyle: cleanVal(obj.bodyStyle),
      engine: engineDesc,
      engineCapacity: engineCap,
      transmission,
      gearbox: transmission,
      fuelType: cleanVal(obj.fuelType),
      color: cleanVal(obj.color),
      doors,
      numberOfDoors: doors,
      driveTrain: cleanVal(obj.driveTrain),
      topSpeed: cleanVal(obj.topSpeed),
      power: cleanVal(obj.power),
      maxTorque: cleanVal(obj.maxTorque),
      cylinders: cleanVal(obj.cylinders),
      consumptionCity: cleanVal(obj.consumptionCity),
      consumptionExtraUrban: cleanVal(obj.consumptionExtraUrban),
      consumptionCombined: cleanVal(obj.consumptionCombined),
      co2Emission: cleanVal(obj.co2Emission),
      co2Label: cleanVal(obj.co2Label),
      tyreDataModel: cleanVal(obj.tyreDataModel ?? obj.model),
      enginePowerKw: cleanVal(obj.enginePowerKw),
      standardFitment: cleanVal(obj.standardFitment, 'Yes'),
      frontTyreSize: cleanVal(obj.frontTyreSize),
      rearTyreSize: cleanVal(obj.rearTyreSize),
      frontPressure: cleanVal(obj.frontPressure),
      rearPressure: cleanVal(obj.rearPressure),
      wheelHub: cleanVal(obj.wheelHub),
      taxBand: cleanVal(obj.taxBand ?? obj.co2Label),
      taxSinglePayment: cleanVal(obj.taxSinglePayment),
      financeStatus: 'Clear — No outstanding loans or financial agreements on this vehicle.',
      damageStatus: 'Clear — No record of accidents or damage reported for this vehicle.',
      stolenStatus: 'Clear — No theft record found.',
      legalFinancialStatus: 'Clear / No issues',
      legalWriteOffStatus: 'Not recorded as write-off',
      legalAccidentStatus: 'No accident records',
      legalTheftStatus: 'No theft markers',
      width: cleanVal(obj.width),
      height: cleanVal(obj.height),
      length: cleanVal(obj.length),
      wheelBase: cleanVal(obj.wheelBase),
      kerbWeight: cleanVal(obj.kerbWeight),
      maxAllowedWeight: cleanVal(obj.maxAllowedWeight),
    }
  } catch {
    return null
  }
}

/**
 * Searches vehicle specifications using Groq AI.
 * Returns parsed specifications or null on complete failure.
 */
export async function fetchVehicleSpecsFromGroq({ registration = '', year = '', vehicleModel = '', carModel = '' }) {
  const apiKey = resolveGroqApiKey()
  if (!apiKey) {
    console.warn('Cannot fetch vehicle specs: GROQ_API_KEY not found in env or .env.local')
    return null
  }

  const modelQuery = String(vehicleModel || carModel || '').trim()
  const yearQuery = String(year || '').trim()
  const regQuery = String(registration || '').trim()

  const prompt = `You are an expert automotive database. Given this vehicle:
- Registration / VIN: ${regQuery || 'N/A'}
- Year: ${yearQuery || 'Unknown'}
- Model: ${modelQuery || 'Unknown'}

Provide real, accurate typical factory specifications for a ${yearQuery} ${modelQuery}.
You MUST provide realistic values for ALL of these fields (do not leave them empty or N/A if a standard specification exists for this model):
{
  "make": "Manufacturer brand, e.g. BMW, Toyota, Ford, Volkswagen, Audi, Honda",
  "model": "Exact model name without year, e.g. 3 Series 320i, Civic 1.5 Sport, Golf 1.4 TSI",
  "yearOfManufacture": "${yearQuery || '2018'}",
  "bodyStyle": "e.g. Sedan, Hatchback, SUV, Coupe, Wagon",
  "doors": "e.g. 4",
  "transmission": "e.g. 6-Speed Manual / 8-Speed Automatic / CVT",
  "topSpeed": "e.g. 135 mph",
  "power": "e.g. 150 BHP",
  "maxTorque": "e.g. 250 Nm @ 1500 rpm",
  "engineCapacity": "e.g. 1,498 cc",
  "engine": "e.g. 1.5L 4-Cylinder Turbo",
  "cylinders": "e.g. 4",
  "fuelType": "e.g. Petrol, Diesel, Hybrid, Electric",
  "color": "e.g. Silver, Black, White, Blue, Grey",
  "driveTrain": "e.g. FWD, RWD, AWD",
  "consumptionCity": "e.g. 38.2 mpg",
  "consumptionExtraUrban": "e.g. 54.5 mpg",
  "consumptionCombined": "e.g. 46.8 mpg",
  "co2Emission": "e.g. 138 g/km",
  "co2Label": "e.g. D",
  "tyreDataModel": "e.g. Standard",
  "enginePowerKw": "e.g. 110 kW",
  "standardFitment": "Yes",
  "frontTyreSize": "e.g. 205/55 R16",
  "rearTyreSize": "e.g. 205/55 R16",
  "frontPressure": "e.g. 2.20 bar / 32.00 psi",
  "rearPressure": "e.g. 2.20 bar / 32.00 psi",
  "wheelHub": "e.g. PCD 5x112 | Centre bore 57.10 mm",
  "taxBand": "e.g. D",
  "taxSinglePayment": "e.g. £ 165",
  "width": "e.g. 1,799 mm",
  "height": "e.g. 1,450 mm",
  "length": "e.g. 4,350 mm",
  "wheelBase": "e.g. 2,640 mm",
  "kerbWeight": "e.g. 1,280 kg",
  "maxAllowedWeight": "e.g. 1,780 kg"
}
Return ONLY valid JSON matching this schema.`

  const defaultModel = resolveGroqModel()
  const candidateModels = [
    defaultModel,
    'openai/gpt-oss-120b',
    'openai/gpt-oss-20b',
    'qwen/qwen3.8-27b',
  ]

  const client = new Groq({ apiKey })
  for (const m of [...new Set(candidateModels)]) {
    try {
      const completion = await client.chat.completions.create({
        model: m,
        temperature: 0.1,
        max_tokens: 2048,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: 'You output only compact JSON matching the requested schema with real automotive specifications.',
          },
          { role: 'user', content: prompt },
        ],
      })

      const text = completion.choices[0]?.message?.content ?? ''
      const parsed = safeParseGroqJson(text)
      if (parsed && parsed.engineCapacity !== 'N/A' && parsed.power !== 'N/A') {
        return parsed
      }
      if (parsed) {
        return parsed
      }
    } catch (err) {
      console.warn(`Groq model ${m} failed:`, err instanceof Error ? err.message : err)
    }
  }

  return null
}
