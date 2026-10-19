import PageSEO from "../../components/ui/PageSEO";

export default function TermsOfUse() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Terms of Use",
    "description": "ConvertHub terms of use and service agreement",
    "url": "https://www.converthub.wiki/terms-of-use"
  };

  return (
    <>
      <PageSEO
        title="Terms of Use"
        description="ConvertHub terms of use: Legal agreement for using our calculator services."
        path="/terms-of-use"
        schema={schema}
      />
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Terms of Use</h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Last Updated: October 17, 2026</p>
          </div>

          <div className="prose dark:prose-invert max-w-none space-y-6">

            {/* 1. Acceptance of Terms */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-4">1. Acceptance of Terms</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                By accessing and using ConvertHub (www.converthub.wiki), you agree to be bound by these Terms of Use. If you do not agree to any part of these terms, you may not use the Service. We reserve the right to modify these Terms of Use at any time. Your continued use of the Service following such modifications constitutes your acceptance of the updated Terms.
              </p>
            </section>

            {/* 2. Use License */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-4">2. Use License</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                We grant you a limited, non-exclusive, non-transferable license to access and use ConvertHub for personal, non-commercial purposes. This license does not include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300 mt-3">
                <li>Copying or reproducing any content without permission</li>
                <li>Selling, trading, or reselling the Service</li>
                <li>Modifying or reverse-engineering the code</li>
                <li>Using the Service for automated or bot-driven access</li>
                <li>Scraping calculator data for commercial purposes</li>
              </ul>
            </section>

            {/* 3. User Accounts */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-4">3. User Accounts</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                If you create an account, you are responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300 mt-3">
                <li>Maintaining the confidentiality of your password</li>
                <li>Providing accurate and complete information</li>
                <li>Notifying us immediately of any unauthorized access</li>
                <li>All activities that occur under your account</li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
                We reserve the right to suspend or terminate accounts that violate these Terms.
              </p>
            </section>

            {/* 4. Prohibited Conduct */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-4">4. Prohibited Conduct</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                You agree not to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300 mt-3">
                <li>Violate any laws or regulations</li>
                <li>Harass, threaten, or abuse other users</li>
                <li>Upload malware, viruses, or malicious code</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Engage in spam, phishing, or social engineering</li>
                <li>Use the Service for illegal purposes</li>
                <li>Interfere with the functioning of the Service</li>
                <li>Attempt to overload servers with excessive requests</li>
              </ul>
            </section>

            {/* 5. Intellectual Property Rights */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-4">5. Intellectual Property Rights</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                ConvertHub and all content, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio) are owned by ConvertHub, its licensors, or other providers of such material and are protected by copyright and other intellectual property laws.
              </p>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-3">
                <strong>Personal Use Only:</strong> You may print or download calculator results for personal use only. Commercial reproduction without permission is strictly prohibited.
              </p>
            </section>

            {/* 6. Disclaimer of Warranties */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-4">6. Disclaimer of Warranties</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
                THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS.
              </p>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-3">
                We make no warranties, express or implied, regarding:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300 mt-3">
                <li>The accuracy or completeness of calculator results</li>
                <li>The uninterrupted operation of the Service</li>
                <li>The absence of errors or bugs</li>
                <li>Fitness for a particular purpose</li>
                <li>Non-infringement of third-party rights</li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
                See Section 8 "Disclaimer" for more information about the limitations of our calculators.
              </p>
            </section>

            {/* 7. Limitation of Liability */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-4">7. Limitation of Liability</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, CONVERTHUB SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, LOSS OF DATA, OR LOSS OF USE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
              </p>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-3">
                Because the Service is free, our total liability for any claim arising from the Service shall not exceed $100 USD.
              </p>
            </section>

            {/* 8. Indemnification */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-4">8. Indemnification</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                You agree to indemnify and hold harmless ConvertHub and its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including legal fees) arising from:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300 mt-3">
                <li>Your use of the Service</li>
                <li>Violation of these Terms of Use</li>
                <li>Violation of any law or regulation</li>
                <li>Infringement of third-party rights</li>
              </ul>
            </section>

            {/* 9. Termination */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-4">9. Termination</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300 mt-3">
                <li>Violation of these Terms of Use</li>
                <li>Engagement in prohibited conduct</li>
                <li>Suspected fraud or security violations</li>
                <li>At our sole discretion</li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
                You may stop using the Service at any time. To request deletion of your account, contact us as described in Section 14.
              </p>
            </section>

            {/* 10. Governing Law */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-4">10. Governing Law & Jurisdiction</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                These Terms of Use are governed by and construed in accordance with the laws of the United States, and you irrevocably submit to the exclusive jurisdiction of the courts located therein.
              </p>
            </section>

            {/* 11. Severability */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-4">11. Severability</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                If any provision of these Terms of Use is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.
              </p>
            </section>

            {/* 12. Entire Agreement */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-4">12. Entire Agreement</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                These Terms of Use, together with our Privacy Policy and Disclaimer, constitute the entire agreement between you and ConvertHub regarding the Service and supersede all prior agreements.
              </p>
            </section>

            {/* 13. Advertising */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-4">13. Advertising & Third-Party Links</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                The Service displays advertisements served by Google AdSense and may link to third-party sites. We do not control the content of these advertisements or sites. Your interactions with advertisers are solely between you and them.
              </p>
            </section>

            {/* 14. Contact Us */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-4">14. Contact Us</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                If you have questions about these Terms of Use, please contact:
              </p>
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 mt-4">
                <p className="text-slate-800 dark:text-slate-200"><strong>Email:</strong> legal@converthub.wiki</p>
                <p className="text-slate-800 dark:text-slate-200"><strong>Website:</strong> www.converthub.wiki</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
