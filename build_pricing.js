const fs = require('fs');
const path = require('path');

const indexPath = 'c:\\Users\\S.K Tech\\OneDrive\\Desktop\\web-terms\\wheelstory\\index.html';
const outputPath = 'c:\\Users\\S.K Tech\\OneDrive\\Desktop\\web-terms\\wheelstory\\pricing.html';

const fileContent = fs.readFileSync(indexPath, 'utf-8');
const lines = fileContent.split(/\r?\n/);

const head = lines.slice(0, 10343).join('\n');
const footer = lines.slice(11825).join('\n');

const pricing = `
<!-- Pricing Section -->
<section class="pricing-section" style="padding: 100px 0; background: var(--basic-white);">
    <div class="container holder">
        <div class="pricing-header" style="text-align: center; margin-bottom: 60px;">
            <h1 class="heading heading--xl" style="color: var(--basic-black); margin-bottom: 20px;">Pricing & Packages</h1>
            <p style="color: var(--basic-black); font-size: 18px; max-width: 700px; margin: 0 auto; opacity: 0.8;">
                Choose the perfect report package for your needs. Whether you're checking a single car or a whole fleet, we've got you covered.
            </p>
        </div>
        <div class="pricing-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
            <!-- Basic Plan -->
            <div class="pricing-card" style="background: var(--basic-white); border: 2px solid #e6e6e6; border-radius: 20px; padding: 40px; text-align: center; transition: transform 0.3s ease, box-shadow 0.3s ease;" onmouseover="this.style.transform='translateY(-10px)'; this.style.boxShadow='0 20px 40px rgba(0,0,0,0.1)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                <h3 class="heading heading--m" style="color: var(--basic-black); margin-bottom: 10px;">Basic</h3>
                <div class="price" style="font-size: 48px; font-weight: 700; color: var(--main-blue); margin-bottom: 10px;">$20</div>
                <p style="color: var(--basic-black); margin-bottom: 30px; font-weight: 500;">1 Vehicle History Report</p>
                <ul style="list-style: none; padding: 0; margin-bottom: 40px; text-align: left; color: var(--basic-black);">
                    <li style="margin-bottom: 12px;"><i class="fas fa-check" style="color: var(--main-blue); margin-right: 10px;"></i> Full History Report</li>
                    <li style="margin-bottom: 12px;"><i class="fas fa-check" style="color: var(--main-blue); margin-right: 10px;"></i> Title Branding Check</li>
                    <li style="margin-bottom: 12px;"><i class="fas fa-check" style="color: var(--main-blue); margin-right: 10px;"></i> Odometer Records</li>
                    <li style="margin-bottom: 12px;"><i class="fas fa-check" style="color: var(--main-blue); margin-right: 10px;"></i> 24/7 Support</li>
                </ul>
                <div style="margin-bottom: 20px;">
                    <input type="email" class="pricing-email-basic" placeholder="Enter your email" style="width: 100%; padding: 12px; border: 2px solid #e6e6e6; border-radius: 8px; font-size: 14px;">
                </div>
                <button class="button button--main" style="width: 100%; padding: 15px; border-radius: 10px; font-weight: 600;" onclick="buyPackage('basic', 'pricing-email-basic')">Buy Now</button>
            </div>
            
            <!-- Standard Plan -->
            <div class="pricing-card" style="background: var(--basic-white); border: 2px solid var(--main-blue); border-radius: 20px; padding: 40px; text-align: center; position: relative; box-shadow: 0 10px 30px rgba(4, 147, 211, 0.15);">
                <span style="position: absolute; top: -15px; left: 50%; transform: translateX(-50%); background: var(--main-blue); color: white; padding: 5px 20px; border-radius: 20px; font-size: 14px; font-weight: 700;">Best Value</span>
                <h3 class="heading heading--m" style="color: var(--basic-black); margin-bottom: 10px;">Standard</h3>
                <div class="price" style="font-size: 48px; font-weight: 700; color: var(--main-blue); margin-bottom: 10px;">$40</div>
                <p style="color: var(--basic-black); margin-bottom: 30px; font-weight: 500;">5 Vehicle History Reports</p>
                <ul style="list-style: none; padding: 0; margin-bottom: 40px; text-align: left; color: var(--basic-black);">
                    <li style="margin-bottom: 12px;"><i class="fas fa-check" style="color: var(--main-blue); margin-right: 10px;"></i> 5 Full History Reports</li>
                    <li style="margin-bottom: 12px;"><i class="fas fa-check" style="color: var(--main-blue); margin-right: 10px;"></i> $8 per report</li>
                    <li style="margin-bottom: 12px;"><i class="fas fa-check" style="color: var(--main-blue); margin-right: 10px;"></i> 1 Year Access</li>
                    <li style="margin-bottom: 12px;"><i class="fas fa-check" style="color: var(--main-blue); margin-right: 10px;"></i> Priority Support</li>
                </ul>
                <div style="margin-bottom: 20px;">
                    <input type="email" class="pricing-email-standard" placeholder="Enter your email" style="width: 100%; padding: 12px; border: 2px solid #e6e6e6; border-radius: 8px; font-size: 14px;">
                </div>
                <button class="button button--main" style="width: 100%; padding: 15px; border-radius: 10px; font-weight: 600;" onclick="buyPackage('standard', 'pricing-email-standard')">Buy Now</button>
            </div>

            <!-- Premium Plan -->
            <div class="pricing-card" style="background: var(--basic-white); border: 2px solid #e6e6e6; border-radius: 20px; padding: 40px; text-align: center; transition: transform 0.3s ease, box-shadow 0.3s ease;" onmouseover="this.style.transform='translateY(-10px)'; this.style.boxShadow='0 20px 40px rgba(0,0,0,0.1)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                <h3 class="heading heading--m" style="color: var(--basic-black); margin-bottom: 10px;">Premium</h3>
                <div class="price" style="font-size: 48px; font-weight: 700; color: var(--main-blue); margin-bottom: 10px;">$60</div>
                <p style="color: var(--basic-black); margin-bottom: 30px; font-weight: 500;">25 Vehicle History Reports</p>
                <ul style="list-style: none; padding: 0; margin-bottom: 40px; text-align: left; color: var(--basic-black);">
                    <li style="margin-bottom: 12px;"><i class="fas fa-check" style="color: var(--main-blue); margin-right: 10px;"></i> 25 Full History Reports</li>
                    <li style="margin-bottom: 12px;"><i class="fas fa-check" style="color: var(--main-blue); margin-right: 10px;"></i> $2.40 per report</li>
                    <li style="margin-bottom: 12px;"><i class="fas fa-check" style="color: var(--main-blue); margin-right: 10px;"></i> Lifetime Access</li>
                    <li style="margin-bottom: 12px;"><i class="fas fa-check" style="color: var(--main-blue); margin-right: 10px;"></i> Dedicated Support</li>
                </ul>
                <div style="margin-bottom: 20px;">
                    <input type="email" class="pricing-email-premium" placeholder="Enter your email" style="width: 100%; padding: 12px; border: 2px solid #e6e6e6; border-radius: 8px; font-size: 14px;">
                </div>
                <button class="button button--main" style="width: 100%; padding: 15px; border-radius: 10px; font-weight: 600;" onclick="buyPackage('premium', 'pricing-email-premium')">Buy Now</button>
            </div>
        </div>
    </div>
</section>

<script>
async function buyPackage(tier, emailClass) {
    const emailInput = document.querySelector('.' + emailClass);
    if (!emailInput) return;
    const email = emailInput.value.trim();
    
    if (!email || !email.includes('@')) {
        alert('Please enter a valid email address');
        emailInput.focus();
        return;
    }
    
    if (typeof openPaddleCheckout === 'function') {
        const btn = document.querySelector('button[onclick*="' + tier + '"]');
        if (btn) btn.classList.add('loader-v2');
        
        await openPaddleCheckout(null, null, tier, email);
        
        if (btn) btn.classList.remove('loader-v2');
    } else {
        console.error('openPaddleCheckout not found');
        alert('Payment system error. Please refresh and try again.');
    }
}
</script>
`;

fs.writeFileSync(outputPath, head + pricing + footer, 'utf-8');
console.log('Successfully created ' + outputPath);
