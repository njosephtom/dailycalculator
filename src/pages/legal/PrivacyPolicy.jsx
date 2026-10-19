import PageSEO from "../../components/ui/PageSEO";

export default function PrivacyPolicy() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Privacy Policy",
    "description": "ConvertHub privacy policy and data protection information",
    "url": "https://www.converthub.wiki/privacy-policy"
  };

  return (
    <>
      <PageSEO
        title="Privacy Policy"
        description="ConvertHub privacy policy: How we collect, use, and protect your data."
        path="/privacy-policy"
        schema={schema}
      />
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Privacy Policy</h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Last Updated: October 17, 2026</p>
          </div>

          <div className="prose dark:prose-invert max-w-none space-y-6">

            {/* 1. Introduction */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-4">1. Introduction</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                ConvertHub ("we," "us," "our," or "Company") operates the www.converthub.wiki website (the "Service"). This Privacy Policy explains our practices regarding the collection, use, and protection of your information when you use our Service.
              </p>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-3">
                Please read this Privacy Policy carefully. By accessing or using ConvertHub, you acknowledge that you have read, understood, and agree to be bound by all the terms of this Privacy Policy.
              </p>
            </section>

            {/* 2. Information We Collect */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-4">2. Information We Collect</h2>

              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mt-6 mb-3">2.1 Information You Provide Directly</h3>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
                <li><strong>Account Information:</strong> When you create an account, we collect your email address, name, and password (encrypted).</li>
                <li><strong>Profile Data:</strong> Display name, profile picture, and preferences you voluntarily provide.</li>
                <li><strong>Contact Information:</strong> If you contact us, we collect the message and any personally identifiable information you provide.</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mt-6 mb-3">2.2 Information Collected Automatically</h3>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
                <li><strong>Usage Data:</strong> If you are signed in, we count how often you use each calculator and when it was last used (stored per-user in Firebase). Calculator inputs and results are not saved to your account.</li>
                <li><strong>Favorites:</strong> If you are signed in, the calculators you mark as favorites.</li>
                <li><strong>Device Information:</strong> Device type, browser type, and performance metrics collected by Vercel Analytics (anonymized).</li>
                <li><strong>Cookies & Local Storage:</strong> Dark mode preference, sign-in session data, and advertising cookies set by Google AdSense.</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mt-6 mb-3">2.3 Third-Party Data Collection</h3>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
                <li><strong>Google AdSense:</strong> Collects data about ad impressions and clicks. See <a href="https://policies.google.com/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline">Google's Privacy Policy</a>.</li>
                <li><strong>Firebase (Google):</strong> Handles authentication, database storage, and analytics. See <a href="https://firebase.google.com/support/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline">Firebase Privacy</a>.</li>
                <li><strong>Vercel Analytics:</strong> Performance metrics and usage statistics (anonymized). See <a href="https://vercel.com/docs/analytics/privacy-policy" className="text-indigo-600 dark:text-indigo-400 hover:underline">Vercel's Privacy Policy</a>.</li>
              </ul>
            </section>

            {/* 3. How We Use Your Information */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-4">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
                <li>To provide, maintain, and improve the Service</li>
                <li>To authenticate users and manage accounts</li>
                <li>To save your calculator favorites and usage history</li>
                <li>To personalize your experience (dark mode, preferences)</li>
                <li>To display relevant advertisements via Google AdSense</li>
                <li>To analyze usage patterns and improve features</li>
                <li>To comply with legal obligations</li>
                <li>To contact you about updates or changes to our policies</li>
                <li>To prevent fraud, abuse, and security violations</li>
              </ul>
            </section>

            {/* 4. Data Security */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-4">4. Data Security</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                We implement industry-standard security measures to protect your information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300 mt-3">
                <li>HTTPS encryption for all data in transit</li>
                <li>Passwords are handled by Firebase Authentication and are never stored in plaintext</li>
                <li>Google Cloud (Firebase) provides encryption at rest</li>
                <li>Access to our database is restricted to our own application rules</li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
                <strong>Note:</strong> No method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
              </p>
            </section>

            {/* 5. Data Storage & Retention */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-4">5. Data Storage & Retention</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Account data (sign-in details, favorites, and usage counts) is stored on Google Cloud (Firebase) servers. We keep this data as long as your account is active, or as long as necessary to provide the Service. You may request deletion of your account and associated data at any time by emailing us (see Section 11).
              </p>
            </section>

            {/* 6. Your Rights */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-4">6. Your Rights (GDPR & CCPA)</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                If you are in the EU (GDPR) or California (CCPA), you have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300 mt-3">
                <li><strong>Access:</strong> Request a copy of all personal data we hold about you</li>
                <li><strong>Correction:</strong> Request we correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request we delete your data ("right to be forgotten")</li>
                <li><strong>Opt-Out:</strong> Opt out of personalized advertising through <a href="https://adssettings.google.com" className="text-indigo-600 dark:text-indigo-400 hover:underline">Google Ads Settings</a> or <a href="https://www.aboutads.info" className="text-indigo-600 dark:text-indigo-400 hover:underline">aboutads.info</a>. California residents may also opt out of the sale or sharing of personal information; we do not sell personal information for money.</li>
                <li><strong>Data Portability:</strong> Request your data in a portable format</li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
                To exercise these rights, contact us at: <strong>privacy@converthub.wiki</strong>
              </p>
            </section>

            {/* 7. Cookies & Tracking */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-4">7. Cookies & Tracking Technologies</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                We use cookies and local storage for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300 mt-3">
                <li><strong>Session Cookies:</strong> To keep you logged in</li>
                <li><strong>Preference Cookies:</strong> To remember your dark mode setting</li>
                <li><strong>Analytics Cookies:</strong> To understand how users interact with our site</li>
                <li><strong>Ad Cookies:</strong> To display relevant advertisements (Google AdSense). Google uses cookies to show ads based on your prior visits to this and other sites.</li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
                You can disable cookies in your browser settings. However, this may impact functionality.
              </p>
            </section>

            {/* 8. Third-Party Links */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-4">8. Third-Party Links & Services</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Our Service may contain links to third-party websites and services. We are not responsible for their privacy practices. Please review their privacy policies before providing personal information.
              </p>
            </section>

            {/* 9. Children's Privacy */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-4">9. Children's Privacy</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                ConvertHub is not directed at children under 13. We do not knowingly collect personal information from children under 13. If we become aware that a child under 13 has provided us with personal information, we will delete such information promptly.
              </p>
            </section>

            {/* 10. Privacy Policy Changes */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-4">10. Changes to This Privacy Policy</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                We may update this Privacy Policy periodically. We will notify you of significant changes by updating the "Last Updated" date and posting the new policy on our website. Your continued use of the Service constitutes acceptance of the updated Privacy Policy.
              </p>
            </section>

            {/* 11. Contact Us */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-4">11. Contact Us</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                If you have questions about this Privacy Policy or our data practices, please contact:
              </p>
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 mt-4">
                <p className="text-slate-800 dark:text-slate-200"><strong>Email:</strong> privacy@converthub.wiki</p>
                <p className="text-slate-800 dark:text-slate-200"><strong>Website:</strong> www.converthub.wiki</p>
                <p className="text-slate-800 dark:text-slate-200"><strong>Response Time:</strong> 30 days</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
