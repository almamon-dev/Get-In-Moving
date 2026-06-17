<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pages = [
            [
                'slug' => 'terms-and-conditions',
                'title' => 'Terms and Conditions',
                'is_published' => true,
                'content' => '<h1>Terms and Conditions</h1>
                <p>Welcome to Get It Moving! These terms and conditions outline the rules and regulations for the use of our website and services.</p>
                <h2>1. Introduction</h2>
                <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use Get It Moving if you do not agree to take all of the terms and conditions stated on this page.</p>
                <h2>2. Service Scope</h2>
                <p>Get It Moving acts as a platform connecting customers with transport and moving service suppliers. We do not directly provide transport services.</p>
                <h2>3. User Accounts</h2>
                <p>You must be at least 18 years of age to use this website. By using this website and by agreeing to these terms and conditions you warrant and represent that you are at least 18 years of age.</p>
                <h2>4. Payments & Subscriptions</h2>
                <p>Certain services and features on the Get It Moving platform require a paid subscription. All payments are processed securely through Stripe.</p>
                <h2>5. Liability</h2>
                <p>Get It Moving is not liable for any damages, loss of items, or delays caused by third-party suppliers hired through the platform.</p>
                <p><i>Last Updated: ' . date('Y-m-d') . '</i></p>'
            ],
            [
                'slug' => 'privacy-policy',
                'title' => 'Privacy Policy',
                'is_published' => true,
                'content' => '<h1>Privacy Policy</h1>
<p>Your privacy is important to us. It is Get It Moving\'s policy to respect your privacy regarding any information we may collect from you across our website.</p>
<h2>1. Information We Collect</h2>
<p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.</p>
<ul>
    <li>Name and Contact details (Email, Phone number)</li>
    <li>Business Information (for Suppliers)</li>
    <li>Billing Information</li>
</ul>
<h2>2. How We Use Your Data</h2>
<p>We use the information we collect to operate, maintain, and improve our services, process transactions, and communicate with you.</p>
<h2>3. Data Sharing</h2>
<p>We do not share your personally identifying information publicly or with third-parties, except when required to by law or to facilitate transport services between customers and suppliers.</p>
<h2>4. Security</h2>
<p>We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable.</p>
<p><i>Last Updated: ' . date('Y-m-d') . '</i></p>'
            ],
            [
                'slug' => 'pay-later',
                'title' => 'Pay Later Instructions',
                'is_published' => true,
                'content' => '<h1>Pay Later Instructions</h1>
<p>Thank you for choosing Get It Moving! If you have selected the "Pay Later" option, please read the following instructions carefully to ensure your service is processed without any delays.</p>
<h2>1. How It Works</h2>
<p>The "Pay Later" option allows you to secure your booking today and complete your payment at a later time. However, your transport service will not be dispatched until the full payment has been confirmed.</p>
<h2>2. Payment Deadline</h2>
<p>You must complete your payment at least <b>48 hours before</b> the scheduled pickup time. Failure to pay within this timeframe may result in the automatic cancellation of your booking.</p>
<h2>3. Accepted Payment Methods</h2>
<ul>
    <li>Bank Transfer (EFT)</li>
    <li>Credit/Debit Card via your user dashboard</li>
    <li>Cash on Delivery (Only available for select routes and verified customers)</li>
</ul>
<h2>4. How to Make Your Payment</h2>
<p>To finalize your payment, simply log in to your Customer Dashboard, navigate to the <b>"Pending Invoices"</b> section, and click on <b>"Pay Now"</b> next to your booking.</p>
<h2>5. Need Help?</h2>
<p>If you face any issues while completing your payment, or if you need an extension, please contact our support team immediately at <a href="mailto:support@getitmoving.com">support@getitmoving.com</a>.</p>'
            ]
        ];

        foreach ($pages as $page) {
            \App\Models\Page::firstOrCreate(
                ['slug' => $page['slug']],
                $page
            );
        }
    }
}
