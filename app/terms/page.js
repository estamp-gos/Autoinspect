import Link from 'next/link';
import { SiteFooter, SiteHeader } from '../components/SiteChrome'

export const metadata = {
  title: "Terms of Service - Autoinspect | Vehicle History Reports",
  description: "Terms of Service for Autoinspect vehicle history reports. Read our terms and conditions for using our VIN check services.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsOfService() {
  return (
    <div className="legal-page">
      <SiteHeader />
      <div className="legal-title-band"><div className="legal-title-inner"><span>Terms of service</span><h1>Terms of Service</h1><p>The terms that apply when you use Autoinspect vehicle history reports.</p></div></div>

      {/* Main Content */}
      <main className="legal-main">
        <div className="legal-content">
          <p className="legal-meta">
            <strong>Effective Date:</strong> November 4, 2025<br/>
            <strong>Last Updated:</strong> November 4, 2025
          </p>

          <div className="legal-sections">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using Autoinspect&apos;s website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Autoinspect provides vehicle history reports based on Vehicle Identification Numbers (VINs). Our service includes:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Vehicle history reports containing accident history, title information, and other vehicle data</li>
                <li>Market value analysis and depreciation information</li>
                <li>Mileage verification and odometer history</li>
                <li>Safety recall information</li>
                <li>Service and maintenance records (when available)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Responsibilities</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                As a user of our service, you agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Provide accurate and complete information, including valid VIN numbers</li>
                <li>Use the service only for lawful purposes</li>
                <li>Not attempt to circumvent, disable, or otherwise interfere with security features</li>
                <li>Not use automated systems to access our service without permission</li>
                <li>Respect intellectual property rights</li>
                <li>Provide a valid email address for report delivery</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Payment Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our payment terms are as follows:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Payment is required before report generation</li>
                <li>Current price: £54.99 per vehicle history report</li>
                <li>All payments are processed securely through Paddle</li>
                <li>Prices may change without notice</li>
                <li>Refunds are available within 14 days under specific conditions outlined in our Refund Policy</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Refund Policy</h2>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Refund Policy</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p><strong>14-Day Refund Window:</strong> Autoinspect offers refunds within 14 days of purchase under specific conditions. Digital service delivery does not automatically disqualify refund eligibility. Please see our detailed Refund Policy for complete terms.</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                While this is a digital service providing immediate delivery of vehicle history information, we understand that certain circumstances may warrant a refund. Please review our Refund Policy for detailed information about eligible refund scenarios and the process.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Service Delivery and Human Involvement</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Autoinspect&apos;s vehicle history reports are generated through a combination of automated systems and human oversight:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Automated Data Processing:</strong> Initial VIN analysis and data compilation is performed by automated systems</li>
                <li><strong>Human Quality Assurance:</strong> Reports undergo human review for quality control and accuracy verification</li>
                <li><strong>Expert Analysis:</strong> Complex cases may receive additional human analysis for market value assessment and damage evaluation</li>
                <li><strong>Customer Support:</strong> Human customer service representatives are available to assist with report interpretation and technical issues</li>
                <li><strong>Data Verification:</strong> Human analysts verify critical information and flag potential discrepancies</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                While our primary data processing is automated for efficiency, human expertise ensures report accuracy and provides personalized customer support when needed.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Report Delivery</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Report delivery terms:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Reports are delivered via email to the address provided during purchase</li>
                <li>Standard delivery time: 6-12 hours (most reports delivered within 1-2 hours)</li>
                <li>Check your spam/junk folder if you don&apos;t receive the report</li>
                <li>Ensure your email can receive attachments up to 10MB</li>
                <li>Contact support if you don&apos;t receive your report within 24 hours</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Data Accuracy and Limitations</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                While we strive for accuracy, please note:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Information is compiled from various sources and databases</li>
                <li>Not all incidents may be captured in our databases</li>
                <li>Some information may be delayed or incomplete</li>
                <li>Reports should be used as one factor in vehicle evaluation</li>
                <li>We recommend professional vehicle inspection before purchase</li>
                <li>Data availability varies by vehicle age, location, and record keeping</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Intellectual Property</h2>
              <p className="text-gray-700 leading-relaxed">
                All content, features, and functionality on our website and in our reports are owned by Autoinspect and are protected by international copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Disclaimer of Warranties</h2>
              <p className="text-gray-700 leading-relaxed">
                Our service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without any warranties of any kind, either express or implied. We disclaim all warranties, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the service will be uninterrupted or error-free.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                In no event shall Autoinspect be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising out of or relating to your use of our service, even if we have been advised of the possibility of such damages. Our total liability shall not exceed the amount paid for the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Indemnification</h2>
              <p className="text-gray-700 leading-relaxed">
                You agree to indemnify, defend, and hold harmless Autoinspect from and against any and all claims, damages, obligations, losses, liabilities, costs, and expenses arising from your use of our service or violation of these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Privacy Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of our service, to understand our practices regarding the collection and use of your information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Governing Law</h2>
              <p className="text-gray-700 leading-relaxed">
                These terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Dispute Resolution</h2>
              <p className="text-gray-700 leading-relaxed">
                Any disputes arising from these terms or your use of our service shall be resolved through appropriate channels, except that you may assert claims in small claims court if they qualify.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">16. Modifications to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to our website. Your continued use of the service after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">17. Termination</h2>
              <p className="text-gray-700 leading-relaxed">
                We may terminate or suspend your access to our service immediately, without prior notice, for any reason, including but not limited to violation of these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">18. Severability</h2>
              <p className="text-gray-700 leading-relaxed">
                If any provision of these terms is held to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">19. Company Information</h2>
              <div className="bg-blue-50 p-6 rounded-lg mb-6">
                <div className="text-gray-700">
                  <p className="mb-4"><strong>Service Provider:</strong></p>
                  <p className="mb-2"><strong>Business Name:</strong> Autoinspect</p>
                  <p className="mb-2"><strong>Website:</strong> <Link href="https://Autoinspect.com" className="text-blue-600 hover:text-blue-700">https://Autoinspect.com</Link></p>
                  <p className="mb-2"><strong>Email:</strong> support@autoinspect.site</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Autoinspect is the company operating the vehicle history report service. All services are provided by Autoinspect under these Terms of Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">20. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg mt-4">
                <p className="text-gray-700">
                  <strong>Email:</strong> support@autoinspect.site<br/>
                  <strong>Website:</strong> <Link href="https://Autoinspect.com" className="text-blue-600 hover:text-blue-700">https://Autoinspect.com</Link>
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
