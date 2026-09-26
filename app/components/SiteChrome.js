import Image from 'next/image'
import Link from 'next/link'

export function SiteHeader() {
  return (
    <header className="vin-header">
      <Link className="vin-brand" href="/" aria-label="Autoinspect home">
        <Image className="vin-logo" style={{ width: 'clamp(136px, 24vw, 174px)', height: 'auto' }} src="/autoinspect-logo.svg" alt="Autoinspect Digital VIN Reports" width={180} height={42} />
      </Link>
      <nav className="vin-nav" aria-label="Main navigation">
        <Link className="active" href="/">Home</Link>
        <Link href="/#how-it-works">How It Works</Link>
        <Link href="/#whats-included">What&apos;s Included</Link>
        <Link href="/#faq">FAQ</Link>
      </nav>
      <div className="vin-header-actions">
        <Link className="vin-button vin-button-primary vin-header-cta" href="/#vin-input-section">Check a Vehicle</Link>
        <Link className="vin-account" href="/about#contact" aria-label="Contact Autoinspect">♙</Link>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="vin-footer">
      <div className="vin-footer-main">
        <div className="vin-footer-brand">
          <Link className="vin-brand" href="/"><Image className="vin-logo" style={{ width: 'clamp(150px, 26vw, 190px)', height: 'auto' }} src="/autoinspect-logo.svg" alt="Autoinspect Digital VIN Reports" width={190} height={44} /></Link>
          <p>Vehicle history reports to help you make a more informed purchase.</p>
        </div>
        <div className="vin-footer-column">
          <h2>Platform</h2>
          <Link href="/">Home</Link>
          <Link href="/#how-it-works">How it works</Link>
          <Link href="/#whats-included">What&apos;s included</Link>
          <Link href="/#faq">FAQ</Link>
          <Link href="/about#contact">Contact</Link>
        </div>
        <div className="vin-footer-column">
          <h2>Legal &amp; trust</h2>
          <Link href="/privacy">Privacy policy</Link>
          <Link href="/terms">Terms &amp; conditions</Link>
          <Link href="/refund">Refund policy</Link>
        </div>
      </div>
      <div className="vin-footer-bottom">
        <span>© {new Date().getFullYear()} Autoinspect. All rights reserved.</span>
        <span>Vehicle history information for confident decisions</span>
      </div>
    </footer>
  )
}