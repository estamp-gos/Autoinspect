import nodemailer from 'nodemailer'
import { Resend } from 'resend'
import EmailTemplate from '../../components/Email_Template'

function buildReminderHtml({ vin, email, carModel, tierName, tierPrice }) {
  const paymentLink =
    'https://pay.paddle.io/hsc_01k34catt2jk8687d4myd9c1nw_7nacyast8w4bwcs65b81ep50f0ysnpj3'
  const reportType = tierName || 'Standard'
  const price = tierPrice != null ? `£${tierPrice}` : '£1'

  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #111;">Payment Pending</h2>
      <p>
        We have received your order for the <strong>Autoinspect ${reportType} Report</strong>, but we have not yet received your payment.
        Kindly complete the payment so that we can process and send your report without any delay.
      </p>
      <p>You can complete your payment using the link below:</p>
      <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
        <p><strong>Report Type:</strong> ${reportType}</p>
        <p><strong>Price:</strong> ${price}</p>
        <p><strong>VIN:</strong> ${vin}</p>
        <p><strong>Model:</strong> ${carModel || 'N/A'}</p>
        <p><strong>Email:</strong> ${email}</p>
      </div>
      <p>
        <a href="${paymentLink}" target="_blank" rel="noopener noreferrer"
          style="display: inline-block; padding: 10px 16px; background-color: #16a34a; color: #fff; border-radius: 8px; text-decoration: none; font-weight: bold;">
          Complete Payment ${price}
        </a>
      </p>
      <p style="font-weight: bold;">If you have already paid, please ignore this message.</p>
      <p>Best regards,<br/>Autoinspect Team</p>
    </div>
  `
}

async function sendWithGmail({ vin, email, carModel, tierName, tierPrice }) {
  const user = process.env.EMAIL_USER
  const pass = process.env.EMAIL_PASS
  if (!user || !pass) {
    return { ok: false, reason: 'EMAIL_USER / EMAIL_PASS not set' }
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  })

  await transporter.sendMail({
    from: user,
    to: email,
    subject:
      'Payment Completion mail - IGNORE THIS IF YOU HAVE ALREADY PAID FOR THE REPORT',
    html: buildReminderHtml({ vin, email, carModel, tierName, tierPrice }),
  })

  return { ok: true, provider: 'gmail' }
}

async function sendWithResend({ vin, email, carModel, tierName, tierPrice }) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return { ok: false, reason: 'RESEND_API_KEY not set' }
  }

  // Prefer a verified Resend from-address; fall back to Resend's test sender.
  const from =
    process.env.RESEND_FROM_EMAIL?.trim() ||
    'Autoinspect <onboarding@resend.dev>'

  const resend = new Resend(apiKey)
  const { data, error } = await resend.emails.send({
    from,
    to: [email],
    subject:
      'Payment Completion mail - IGNORE THIS IF YOU HAVE ALREADY PAID FOR THE REPORT',
    react: EmailTemplate({ vin, email, carModel, tierName, tierPrice }),
  })

  if (error) {
    return {
      ok: false,
      reason: error.message || JSON.stringify(error),
    }
  }

  return { ok: true, provider: 'resend', data }
}

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { vin, email, carModel, tierName, tierPrice } = body || {}

  if (!vin || !email) {
    return Response.json(
      { error: 'vin and email are required' },
      { status: 400 }
    )
  }

  const errors = []

  // Prefer Gmail (same credentials as /api/send-vin, which already works on Vercel)
  try {
    const gmailResult = await sendWithGmail({
      vin,
      email,
      carModel,
      tierName,
      tierPrice,
    })
    if (gmailResult.ok) {
      return Response.json({
        success: true,
        message: 'Reminder mail sent successfully',
        provider: gmailResult.provider,
      })
    }
    errors.push(gmailResult.reason)
  } catch (err) {
    errors.push(err instanceof Error ? err.message : 'Gmail send failed')
  }

  // Fall back to Resend if Gmail is unavailable
  try {
    const resendResult = await sendWithResend({
      vin,
      email,
      carModel,
      tierName,
      tierPrice,
    })
    if (resendResult.ok) {
      return Response.json({
        success: true,
        message: 'Reminder mail sent successfully',
        provider: resendResult.provider,
        data: resendResult.data,
      })
    }
    errors.push(resendResult.reason)
  } catch (err) {
    errors.push(err instanceof Error ? err.message : 'Resend send failed')
  }

  console.error('Failed to send reminder mail:', errors)

  if (process.env.NODE_ENV === 'development') {
    return Response.json({
      success: true,
      message: 'Reminder mail simulated successfully (Development Mode)',
      simulated: true,
      errors,
    })
  }

  return Response.json(
    {
      success: false,
      error: 'Failed to send reminder mail',
      details: errors,
    },
    { status: 500 }
  )
}
