'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { SiteFooter, SiteHeader } from '../components/SiteChrome'

export default function ThankYou() {
  const [vinReport, setVinReport] = useState(null)
  const [downloadStarted, setDownloadStarted] = useState(false)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem('vinReport')
    if (raw) {
      try {
        setVinReport(JSON.parse(raw))
      } catch (e) {
        console.error('Failed to parse vinReport from localStorage:', e)
      }
    }
  }, [])

  const generatePDF = async () => {
    if (!vinReport || downloading) return

    setDownloading(true)

    try {
      const vehicleModel = String(vinReport.carModel ?? '').trim()
      const registration = String(vinReport.vin ?? '').trim()
      // Prefer explicit year; fall back to a 4-digit year embedded in the model string
      let year = String(vinReport.year ?? '').trim()
      if (!year && vehicleModel) {
        const yearMatch = vehicleModel.match(/\b(19|20)\d{2}\b/)
        if (yearMatch) year = yearMatch[0]
      }

      let enrichment = vinReport.enrichment
      const hasFullSpecs =
        enrichment &&
        typeof enrichment === 'object' &&
        enrichment.power &&
        enrichment.power !== 'N/A' &&
        enrichment.topSpeed &&
        enrichment.topSpeed !== 'N/A' &&
        enrichment.cylinders &&
        enrichment.cylinders !== 'N/A' &&
        enrichment.engineCapacity &&
        enrichment.engineCapacity !== 'N/A'

      if (!hasFullSpecs) {
        if (registration && year && vehicleModel) {
          const lookupRes = await fetch('/api/lookup-vehicle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              registration,
              vin: registration,
              year,
              vehicleModel,
              carModel: vehicleModel,
            }),
          })

          if (lookupRes.ok) {
            const lookupData = await lookupRes.json()
            if (lookupData.success && lookupData.data) {
              enrichment = lookupData.data
              const updated = { ...vinReport, year, enrichment }
              setVinReport(updated)
              try {
                localStorage.setItem('vinReport', JSON.stringify(updated))
              } catch {
                /* ignore */
              }
            }
          } else {
            const errBody = await lookupRes.json().catch(() => ({}))
            console.warn(
              'Vehicle lookup failed, generating report with limited data:',
              errBody.message || lookupRes.status
            )
          }
        }
      }

      const mergedEnrichment = {
        ...(enrichment || {}),
      }
      // Prefer Groq body style; fall back to selected vehicle type
      if (!mergedEnrichment.bodyStyle || mergedEnrichment.bodyStyle === 'N/A') {
        mergedEnrichment.bodyStyle = vinReport.vehicleType || 'N/A'
      }

      const res = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vin: registration,
          registration,
          year,
          carModel: vehicleModel,
          vehicleModel,
          vehicleType: vinReport.vehicleType,
          enrichment: mergedEnrichment,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || 'Could not generate PDF')
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const safeVin =
        String(vinReport.vin || 'vehicle')
          .replace(/[^\w\d-]+/gi, '')
          .slice(0, 32) || 'vehicle'
      a.download = `Autoinspect-Report-${safeVin}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Failed to generate PDF:', err)
      alert(`Error: ${err instanceof Error ? err.message : 'Failed to generate report PDF. Please try again.'}`)
    } finally {
      setDownloading(false)
    }
  }

  // Auto-start download once report is loaded
  useEffect(() => {
    if (vinReport && !downloadStarted) {
      setDownloadStarted(true)
      const timer = setTimeout(() => {
        generatePDF()
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [vinReport, downloadStarted])

  return (
    <div className="thankyou-page">
      <SiteHeader />

      {/* Main Content */}
      <main className="thankyou-main">
        <div className="thankyou-content">
          {/* Success Icon */}
          <div className="thankyou-success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Thank You Message */}
          <h1 className="thankyou-title">
            Thank You for Your Order!
          </h1>
          
          <p className="thankyou-intro">
            Your first report is 100% free. The PDF has been generated and should download automatically. If the download did not start, please click the button below.
          </p>

          {/* Download PDF Card */}
          {vinReport && (
            <div className="thankyou-report">
              <div className="thankyou-ready">
                READY
              </div>
              <h2 className="thankyou-report-title">Vehicle Report Summary</h2>
              
              <div className="thankyou-report-details">
                <div>
                  <span className="thankyou-detail-label">VIN Number</span>
                  <span className="thankyou-vin">{vinReport.vin}</span>
                </div>
                <div>
                  <span className="thankyou-detail-label">Model Year</span>
                  <span className="thankyou-detail-value">{vinReport.year || '—'}</span>
                </div>
                <div>
                  <span className="thankyou-detail-label">Vehicle Model</span>
                  <span className="thankyou-detail-value">{vinReport.carModel}</span>
                </div>
                <div>
                  <span className="thankyou-detail-label">Vehicle Type</span>
                  <span className="thankyou-detail-value">{vinReport.vehicleType || 'Car'}</span>
                </div>
                <div>
                  <span className="thankyou-detail-label">Tier Level</span>
                  <span className="thankyou-detail-value thankyou-tier">{vinReport.tierName}</span>
                </div>
              </div>
              
              <button
                onClick={generatePDF}
                disabled={downloading}
                className="thankyou-download"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {downloading ? 'Generating PDF...' : 'Download PDF Report'}
              </button>
            </div>
          )}

          {/* Important Information */}
          <div className="thankyou-notice">
            <div className="flex items-start">
              <svg className="thankyou-notice-icon" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <h3>Important Notes</h3>
                <ul>
                  <li>• We also sent a notification email to <strong>{vinReport?.email || 'your email'}</strong>.</li>
                  <li>• A backup download of the report is available via email support.</li>
                  <li>• Support is available at <strong>support@autoinspect.site</strong> 24/7.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="thankyou-actions">
            <Link 
              href="/"
              className="thankyou-home-button"
            >
              Back to Home
            </Link>
            <button 
              onClick={() => window.location.href = 'mailto:support@autoinspect.site'}
              className="thankyou-support-button"
            >
              Contact Support
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  )
}
