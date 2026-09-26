import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import chromium from '@sparticuz/chromium-min'
import puppeteer from 'puppeteer-core'
import { resolveChromeExecutable } from '@/lib/chromePath'
import { fetchVehicleSpecsFromGroq } from '@/lib/groqVehicleSpecs'

export const runtime = 'nodejs'
export const maxDuration = 120

const CHROMIUM_PACK_URL =
  'https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar'

const LOCAL_CHROME_ARGS = [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
  '--disable-gpu',
]

async function getLaunchOptions() {
  const useSparticuz = !!process.env.VERCEL || process.platform === 'linux'

  if (!useSparticuz) {
    const executablePath = resolveChromeExecutable()
    if (!executablePath) {
      throw new Error(
        'Chrome not found for local PDF generation. Install Google Chrome or set PUPPETEER_EXECUTABLE_PATH.'
      )
    }
    return {
      executablePath,
      headless: true,
      args: LOCAL_CHROME_ARGS,
    }
  }

  return {
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(CHROMIUM_PACK_URL),
    headless: chromium.headless,
  }
}

function cleanVal(v, fallback = 'N/A') {
  if (v === undefined || v === null) return fallback
  const s = String(v).trim()
  if (!s || s.toLowerCase() === 'undefined' || s.toLowerCase() === 'null') return fallback
  return s
}

function inferDoors(e, payload) {
  const sources = [
    String(e.bodyStyle ?? ''),
    String(e.model ?? ''),
    String(payload.vehicleModel ?? ''),
    String(payload.carModel ?? ''),
  ]
  for (const s of sources) {
    const m = String(s || '').match(/(\d)\s*-?\s*door/i)
    if (m && m[1]) return m[1]
    const m2 = String(s || '').match(/\b(2|3|4|5)\b\s*(?:door|doors)?/i)
    if (m2 && m2[1]) return m2[1]
  }
  return 'N/A'
}

function coerceReportBody(payload) {
  const e =
    typeof payload.enrichment === 'object' && payload.enrichment !== null
      ? payload.enrichment
      : {}
  const reg = cleanVal(
    payload.registration ?? payload.reg ?? payload.vin,
    'N/A'
  )
  const year = cleanVal(payload.year ?? e.yearOfManufacture ?? e.year, 'N/A')
  const modelFromUser = cleanVal(
    payload.vehicleModel ?? payload.carModel,
    ''
  )
  const mk = cleanVal(e.make, '')
  const md = cleanVal(e.model ?? modelFromUser, '')

  const bannerParts = [year !== 'N/A' ? year : '', mk, md].filter((p) => p && p !== 'N/A')
  const banner = bannerParts.length > 0 ? bannerParts.join(' ').trim() : (modelFromUser || 'Vehicle Inspection Report')
  const fullName = banner

  const reportDate =
    typeof payload.reportDate === 'string' && payload.reportDate.trim()
      ? payload.reportDate.trim()
      : new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })

  const doors = cleanVal(
    e.numberOfDoors ??
      e.doors ??
      payload.doors ??
      inferDoors(e, payload),
    'N/A'
  )

  const transmission = cleanVal(
    e.gearbox ?? e.transmission,
    'N/A'
  )

  const engineCap = cleanVal(
    e.engineCapacity ?? e.engine,
    'N/A'
  )

  return {
    REGISTRATION: reg,
    IDENTIFICATION_NUMBER: reg,
    REG: reg,
    REPORT_DATE: reportDate,
    BANNER_TITLE: banner,
    VEHICLE_FULL_NAME: fullName,
    MAKE: cleanVal(mk),
    MODEL: cleanVal(md),
    YEAR: year,
    NUMBER_OF_DOORS: doors,
    DOORS: doors,
    GEARBOX: transmission,
    TRANSMISSION: transmission,
    TOP_SPEED: cleanVal(e.topSpeed),
    POWER: cleanVal(e.power),
    MAX_TORQUE: cleanVal(e.maxTorque),
    ENGINE_CAPACITY: engineCap,
    ENGINE: cleanVal(e.engine ?? engineCap),
    CYLINDERS: cleanVal(e.cylinders),
    FUEL_TYPE: cleanVal(e.fuelType),
    CONSUMPTION_CITY: cleanVal(e.consumptionCity),
    CONSUMPTION_EXTRA_URBAN: cleanVal(e.consumptionExtraUrban),
    CONSUMPTION_COMBINED: cleanVal(e.consumptionCombined),
    CO2_EMISSION: cleanVal(e.co2Emission),
    CO2_LABEL: cleanVal(e.co2Label),
    TYRE_DATA_MODEL: cleanVal(e.tyreDataModel ?? md),
    ENGINE_POWER_KW: cleanVal(e.enginePowerKw),
    STANDARD_FITMENT: cleanVal(e.standardFitment, 'Yes'),
    FRONT_TYRE_SIZE: cleanVal(e.frontTyreSize),
    REAR_TYRE_SIZE: cleanVal(e.rearTyreSize),
    FRONT_PRESSURE: cleanVal(e.frontPressure),
    REAR_PRESSURE: cleanVal(e.rearPressure),
    WHEEL_HUB: cleanVal(e.wheelHub),
    TAX_BAND: cleanVal(e.taxBand ?? e.co2Label),
    TAX_SINGLE_PAYMENT: cleanVal(e.taxSinglePayment),
    FINANCE_STATUS: cleanVal(e.financeStatus, 'Clear — No outstanding loans or financial agreements on this vehicle.'),
    DAMAGE_STATUS: cleanVal(e.damageStatus, 'Clear — No record of accidents or damage reported for this vehicle.'),
    STOLEN_STATUS: cleanVal(e.stolenStatus, 'Clear — No theft record found.'),
    LEGAL_FINANCIAL_STATUS: cleanVal(e.legalFinancialStatus, 'Clear / No issues'),
    LEGAL_WRITE_OFF_STATUS: cleanVal(e.legalWriteOffStatus, 'Not recorded as write-off'),
    LEGAL_ACCIDENT_STATUS: cleanVal(e.legalAccidentStatus, 'No accident records'),
    LEGAL_THEFT_STATUS: cleanVal(e.legalTheftStatus, 'No theft markers'),
    WIDTH: cleanVal(e.width),
    HEIGHT: cleanVal(e.height),
    LENGTH: cleanVal(e.length),
    WHEEL_BASE: cleanVal(e.wheelBase),
    KERB_WEIGHT: cleanVal(e.kerbWeight),
    MAX_ALLOWED_WEIGHT: cleanVal(e.maxAllowedWeight),
    BODY_STYLE: cleanVal(e.bodyStyle ?? payload.vehicleType),
    COLOR: cleanVal(e.color),
    DRIVE_TRAIN: cleanVal(e.driveTrain),
    LOGO_SRC: '{{LOGO_SRC}}',
    INSPECTION_BANNER_SRC: '{{INSPECTION_BANNER_SRC}}',
    EXAMPLE_CAR_IMAGE: '{{EXAMPLE_CAR_IMAGE}}',
  }
}

function escapeReplacement(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function applyPlaceholders(html, map) {
  let out = html
  const ordered = [...Object.entries(map)].sort(
    (a, b) => b[0].length - a[0].length
  )
  for (const [key, val] of ordered) {
    const token = new RegExp(
      `\\{\\{\\s*${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\}\\}`,
      'g'
    )
    const replacement = (val === undefined || val === null || val === '') ? 'N/A' : String(val)
    out = out.replace(token, escapeReplacement(replacement))
  }
  // Replace any remaining unreplaced placeholders with 'N/A'
  out = out.replace(/\{\{\s*[A-Z0-9_-]+\s*\}\}/g, 'N/A')
  return out
}

async function resolveLogoSrc(cwd) {
  const logoCandidates = [
    path.join(cwd, 'public', 'autoinspect-logo.svg'),
    path.join(cwd, 'report-template', 'car-logo.png'),
    path.join(cwd, 'public', 'car-logo.webp'),
    path.join(cwd, 'public', 'car-logo.png'),
  ]
  for (const candidate of logoCandidates) {
    try {
      await fs.access(candidate)
      const data = await fs.readFile(candidate)
      const ext = path.extname(candidate).toLowerCase()
      const mime =
        ext === '.svg'
          ? 'image/svg+xml'
          : ext === '.webp'
          ? 'image/webp'
          : ext === '.png'
            ? 'image/png'
            : ext === '.jpg' || ext === '.jpeg'
              ? 'image/jpeg'
              : 'application/octet-stream'
      return `data:${mime};base64,${Buffer.from(data).toString('base64')}`
    } catch {
      /* try next */
    }
  }
  return ''
}

async function resolveExampleCarImage(cwd) {
  const imageCandidates = [
    path.join(cwd, 'report-template', 'example-car-2.png'),
    path.join(cwd, 'public', 'example-car-2.png'),
  ]
  for (const candidate of imageCandidates) {
    try {
      await fs.access(candidate)
      const data = await fs.readFile(candidate)
      const ext = path.extname(candidate).toLowerCase()
      const mime =
        ext === '.webp'
          ? 'image/webp'
          : ext === '.png'
            ? 'image/png'
            : ext === '.jpg' || ext === '.jpeg'
              ? 'image/jpeg'
              : 'application/octet-stream'
      return `data:${mime};base64,${Buffer.from(data).toString('base64')}`
    } catch {
      /* try next */
    }
  }
  return ''
}

function stripTrailingScript(html) {
  return html.replace(
    /<script\b[\s\S]*?<\/script>\s*(?=<\/body>)/i,
    '<!-- scripts omitted for pdf -->\n'
  )
}

function safeFilename(reg) {
  const base =
    String(reg || 'vehicle')
      .replace(/[^\w\d-]+/gi, '')
      .slice(0, 32) || 'vehicle'
  return `Autoinspect-Report-${base}.pdf`
}

export async function POST(request) {
  let payload
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid JSON body' },
      { status: 400 }
    )
  }

  let enrichment =
    typeof payload.enrichment === 'object' && payload.enrichment !== null
      ? { ...payload.enrichment }
      : {}

  const hasFullSpecs =
    enrichment.power &&
    enrichment.power !== 'N/A' &&
    enrichment.topSpeed &&
    enrichment.topSpeed !== 'N/A' &&
    enrichment.cylinders &&
    enrichment.cylinders !== 'N/A' &&
    enrichment.engineCapacity &&
    enrichment.engineCapacity !== 'N/A'

  if (!hasFullSpecs) {
    const reg = String(payload.registration ?? payload.reg ?? payload.vin ?? '').trim()
    const year = String(payload.year ?? '').trim()
    const model = String(payload.vehicleModel ?? payload.carModel ?? '').trim()

    if (model || reg) {
      try {
        const aiSpecs = await fetchVehicleSpecsFromGroq({
          registration: reg,
          year,
          vehicleModel: model,
          carModel: model,
        })
        if (aiSpecs) {
          for (const [k, v] of Object.entries(aiSpecs)) {
            if (!enrichment[k] || enrichment[k] === 'N/A') {
              enrichment[k] = v
            }
          }
        }
      } catch (err) {
        console.warn('Auto AI spec enrichment in generate-report failed:', err)
      }
    }
  }

  payload.enrichment = enrichment

  const cwd = process.cwd()
  const templatePath = path.join(cwd, 'report-template', 'index.html')

  let rawTemplate
  try {
    rawTemplate = await fs.readFile(templatePath, 'utf8')
  } catch {
    return NextResponse.json(
      { success: false, message: 'Report template not found' },
      { status: 500 }
    )
  }

  const placeholders = coerceReportBody(payload)
  const logoHref = await resolveLogoSrc(cwd)
  placeholders.LOGO_SRC =
    logoHref ||
    `data:image/svg+xml,${encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect fill="#2563eb" width="64" height="64" rx="8"/><text x="32" y="40" text-anchor="middle" fill="white" font-size="12" font-family="sans-serif">AUTO</text></svg>'
    )}`

  const exampleCarHref = await resolveExampleCarImage(cwd)
  placeholders.INSPECTION_BANNER_SRC =
    exampleCarHref ||
    `data:image/svg+xml,${encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150"><rect fill="#f0f0f0" width="200" height="150" rx="4"/><text x="100" y="75" text-anchor="middle" fill="#999" font-size="14" font-family="sans-serif">Vehicle Image</text></svg>'
    )}`
  placeholders.EXAMPLE_CAR_IMAGE = placeholders.INSPECTION_BANNER_SRC

  let html = rawTemplate
  html = stripTrailingScript(html)
  html = applyPlaceholders(html, placeholders)

  let browser
  try {
    browser = await puppeteer.launch(await getLaunchOptions())

    const page = await browser.newPage()
    await page.setViewport({ width: 1024, height: 1400 })
    await page.emulateMediaType('print')
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 90_000 })
    await new Promise((r) => setTimeout(r, 1500))

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '14px', right: '14px', bottom: '14px', left: '14px' },
    })

    await browser.close()
    browser = undefined

    const filename = safeFilename(placeholders.REGISTRATION || placeholders.REG)

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (err) {
    if (browser) {
      await browser.close().catch(() => {})
    }
    console.error('PDF generation error:', err)
    const msg = err instanceof Error ? err.message : 'PDF generation failed'
    return NextResponse.json({ success: false, message: msg }, { status: 500 })
  }
}
