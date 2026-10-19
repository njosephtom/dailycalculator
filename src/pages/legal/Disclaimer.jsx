import PageSEO from "../../components/ui/PageSEO";

export default function Disclaimer() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Disclaimer",
    "description": "ConvertHub disclaimer and limitation of liability statement",
    "url": "https://www.converthub.wiki/disclaimer"
  };

  return (
    <>
      <PageSEO
        title="Disclaimer"
        description="ConvertHub disclaimer: Important limitations and liability information for calculator results."
        path="/disclaimer"
        schema={schema}
      />
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 space-y-6">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-yellow-800 dark:text-yellow-200 font-semibold">
              ⚠️ Important: Please read this disclaimer carefully before using ConvertHub calculators.
            </p>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Disclaimer</h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Last Updated: October 17, 2026</p>
          </div>

          <div className="prose dark:prose-invert max-w-none space-y-6">

            {/* 1. General Disclaimer */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-4">1. General Disclaimer</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                ConvertHub ("Service") is provided "as is" without warranties of any kind. We make no representations or warranties regarding the accuracy, completeness, reliability, or timeliness of any calculator results, content, or services provided through this website.
              </p>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-3">
                <strong>Use at Your Own Risk:</strong> Your use of the Service and reliance on any calculator results is entirely at your own risk. We shall not be liable for any damages or losses resulting from the use of or inability to use the Service.
              </p>
            </section>

            {/* 2. Financial Calculators */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-4">2. Financial Calculator Disclaimer</h2>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mb-4 border border-red-200 dark:border-red-800">
                <p className="text-red-800 dark:text-red-200 font-semibold">
                  ⛔ NOT FINANCIAL ADVICE
                </p>
              </div>

              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                <strong>ConvertHub does not provide financial, investment, or professional advice.</strong> Our financial calculators (Compound Interest, Loan Calculator, SIP Calculator, etc.) are educational tools only. Results are estimates based on assumptions you provide.
              </p>

              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mt-6 mb-3">Important Limitations:</h3>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
                <li><strong>Market Conditions:</strong> Results assume constant interest rates and stable market conditions. Actual results may vary significantly.</li>
                <li><strong>Taxes & Fees:</strong> Calculations do not include taxes, fees, inflation, or market volatility.</li>
                <li><strong>Past Performance:</strong> Historical returns do not guarantee future results.</li>
                <li><strong>Individual Circumstances:</strong> Results do not account for your specific financial situation, goals, or risk tolerance.</li>
                <li><strong>No Guarantees:</strong> We do not guarantee any specific investment returns or financial outcomes.</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mt-6 mb-3">Before Making Financial Decisions:</h3>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
                <li>Consult with a qualified financial advisor or investment professional</li>
                <li>Review all fee disclosures and terms of your financial products</li>
                <li>Consider your risk tolerance and investment timeline</li>
                <li>Do your own research and due diligence</li>
                <li>Verify any calculations with official sources</li>
              </ul>
            </section>

            {/* 3. Health & Fitness Calculators */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-4">3. Health & Fitness Calculator Disclaimer</h2>
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 mb-4 border border-orange-200 dark:border-orange-800">
                <p className="text-orange-800 dark:text-orange-200 font-semibold">
                  ⚕️ NOT MEDICAL ADVICE
                </p>
              </div>

              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                <strong>ConvertHub does not provide medical, health, or fitness advice.</strong> Our health calculators (BMI, BMR, Body Fat, Calorie Deficit, TDEE, Water Intake, Pregnancy, etc.) are educational tools based on general formulas. Results are not substitutes for professional medical advice.
              </p>

              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mt-6 mb-3">Important Limitations:</h3>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
                <li><strong>Individual Variation:</strong> Health calculations do not account for individual metabolism, genetics, medications, or medical conditions.</li>
                <li><strong>BMI Limitations:</strong> BMI is a screening tool only and does not measure body fat, muscle mass, or overall health.</li>
                <li><strong>Calorie Estimates:</strong> Calorie needs vary widely. Actual requirements depend on age, gender, activity level, and health status.</li>
                <li><strong>No Medical Diagnosis:</strong> Calculators cannot diagnose, treat, or prevent any disease or medical condition.</li>
                <li><strong>Pre-existing Conditions:</strong> Results do not account for allergies, medications, injuries, or chronic conditions.</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mt-6 mb-3">Before Making Health Decisions:</h3>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
                <li>Consult with a qualified healthcare provider (doctor, dietitian, trainer)</li>
                <li>Disclose all medications and medical conditions to your doctor</li>
                <li>Get personalized medical advice based on your health history</li>
                <li>Do not rely solely on calculator results for health decisions</li>
                <li>Stop exercising or dieting if you experience pain, dizziness, or other symptoms</li>
              </ul>
            </section>

            {/* 4. Accuracy of Calculations */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-4">4. Accuracy of Calculations</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                While we strive to ensure calculator accuracy, we make no warranties regarding:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300 mt-3">
                <li>Correctness of mathematical formulas</li>
                <li>Accuracy of conversion factors</li>
                <li>Completeness or current status of reference data</li>
                <li>Suitability for specific use cases</li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
                <strong>Verification Recommended:</strong> Always verify important calculations with official sources before making decisions.
              </p>
            </section>

            {/* 5. Third-Party Information */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-4">5. Third-Party Information & Links</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Our website may contain references to third-party websites, products, or services. We do not endorse and are not responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300 mt-3">
                <li>Content on external websites</li>
                <li>Products or services offered by third parties</li>
                <li>Privacy practices of third-party sites</li>
                <li>Accuracy of information from external sources</li>
              </ul>
            </section>

            {/* 6. Data Loss & Security */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-4">6. Data Loss & Security</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                We are not responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300 mt-3">
                <li>Loss of calculator history or saved data</li>
                <li>Unauthorized access to your account</li>
                <li>Breach of third-party services (Firebase, Google)</li>
                <li>Data corruption or hardware failures</li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
                <strong>Backup Important Data:</strong> Keep copies of important calculation results or data outside our Service.
              </p>
            </section>

            {/* 7. Service Availability */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-4">7. Service Availability</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                We do not guarantee continuous, uninterrupted access to the Service. ConvertHub may be unavailable due to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300 mt-3">
                <li>Scheduled maintenance</li>
                <li>Server failures or technical issues</li>
                <li>Internet or network problems</li>
                <li>Security incidents or attacks</li>
                <li>Force majeure events</li>
              </ul>
            </section>

            {/* 8. Limitation of Liability */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-4">8. Limitation of Liability</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, CONVERTHUB SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300 mt-3">
                <li>Loss of profits or revenue</li>
                <li>Loss of data or business interruption</li>
                <li>Financial losses from incorrect calculations</li>
                <li>Health problems from relying on health calculators</li>
                <li>Any other damages whatsoever</li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
                <strong>Total Liability Cap:</strong> Because the Service is free, our total liability for any claim shall not exceed $100 USD.
              </p>
            </section>

            {/* 9. Changes to Disclaimer */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-4">9. Changes to This Disclaimer</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                We may update this Disclaimer at any time without notice. Your continued use of the Service constitutes acceptance of any updated Disclaimer.
              </p>
            </section>

            {/* 10. Acknowledgment */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-4">10. Your Acknowledgment</h2>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800 mt-4">
                <p className="text-blue-900 dark:text-blue-200">
                  <strong>By using ConvertHub, you acknowledge that:</strong>
                </p>
                <ul className="list-disc pl-6 space-y-2 text-blue-900 dark:text-blue-200 mt-2">
                  <li>You have read and understood this Disclaimer</li>
                  <li>You understand calculator results are estimates only</li>
                  <li>You will seek professional advice for important decisions</li>
                  <li>You assume all risk from using the Service</li>
                  <li>You release ConvertHub from all liability</li>
                </ul>
              </div>
            </section>

            {/* 11. Contact Us */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-4">11. Questions?</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                If you have questions about this Disclaimer, please contact:
              </p>
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 mt-4">
                <p className="text-slate-800 dark:text-slate-200"><strong>Email:</strong> support@converthub.wiki</p>
                <p className="text-slate-800 dark:text-slate-200"><strong>Website:</strong> www.converthub.wiki</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
