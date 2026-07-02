'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

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
      const res = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vin: vinReport.vin,
          registration: vinReport.vin,
          carModel: vinReport.carModel,
          vehicleModel: vinReport.carModel,
          vehicleType: vinReport.vehicleType,
          enrichment: {
            bodyStyle: vinReport.vehicleType,
          },
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
      a.download = `VinXtract-Report-${safeVin}.pdf`
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image 
                src="/car-logo.webp" 
                alt="VinXtractStore" 
                width={40}
                height={40}
                className="mr-3"
              />
              <div className="text-2xl font-bold text-blue-600 font-sans">VinXtractStore</div>
            </Link>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors font-sans">Home</Link>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors font-sans">About</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors font-sans">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Thank You Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-sans">
            Thank You for Your Order!
          </h1>
          
          <p className="text-base text-gray-600 mb-8 font-sans">
            Your first report is 100% free. The PDF has been generated and should download automatically. If the download did not start, please click the button below.
          </p>

          {/* Download PDF Card */}
          {vinReport && (
            <div className="bg-white p-6 rounded-2xl shadow-xl mb-8 border border-green-200 relative overflow-hidden text-left animate-fadeIn">
              <div className="absolute top-0 right-0 bg-green-500 text-white px-4 py-1 text-xs font-semibold rounded-bl-lg font-sans">
                READY
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 font-sans">Vehicle Report Summary</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm">
                <div>
                  <span className="text-xs text-gray-400 block uppercase font-sans">VIN Number</span>
                  <span className="font-semibold text-gray-800 font-mono">{vinReport.vin}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block uppercase font-sans">Vehicle Model</span>
                  <span className="font-semibold text-gray-800 font-sans">{vinReport.carModel}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block uppercase font-sans">Vehicle Type</span>
                  <span className="font-semibold text-gray-800 font-sans">{vinReport.vehicleType || 'Car'}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block uppercase font-sans">Tier Level</span>
                  <span className="font-semibold text-green-600 font-sans">{vinReport.tierName}</span>
                </div>
              </div>
              
              <button
                onClick={generatePDF}
                disabled={downloading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-base transform hover:-translate-y-0.5 active:translate-y-0 font-sans"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {downloading ? 'Generating PDF...' : 'Download PDF Report'}
              </button>
            </div>
          )}

          {/* Important Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2 font-sans text-sm">Important Notes</h3>
                <ul className="text-blue-800 space-y-1 text-sm font-sans">
                  <li>• We also sent a notification email to <strong>{vinReport?.email || 'your email'}</strong>.</li>
                  <li>• A backup download of the report is available via email support.</li>
                  <li>• Support is available at <strong>support@vinxtract.com</strong> 24/7.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold font-sans text-sm"
            >
              Back to Home
            </Link>
            <button 
              onClick={() => window.location.href = 'mailto:support@vinxtract.com'}
              className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg hover:bg-blue-600 hover:text-white transition-colors font-semibold font-sans text-sm"
            >
              Contact Support
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 flex items-center">
              <Image 
                src="/car-logo.webp" 
                alt="VinXtractStore" 
                width={32}
                height={32}
                className="mr-3"
              />
              <div className="text-2xl font-bold text-blue-400 font-sans">VinXtractStore</div>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm font-sans">
              <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Terms & Conditions</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Refund Policy</a>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-800 text-center text-gray-400 text-xs font-sans">
            © 2015 VinXtractStore. All rights reserved. | Vehicle History Reports & VIN Checks
          </div>
        </div>
      </footer>
    </div>
  )
}
