import React from "react";
import { Link } from "react-router-dom";
import PageSEO from "../../components/ui/PageSEO";
import { SITE_INFO } from "../../data/siteInfo";

export default function About() {
  return (
    <>
      <PageSEO
        title="About"
        description="About ConvertHub: who runs the site, what the calculators do, and how they are checked."
        path="/about"
      />
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 space-y-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">About ConvertHub</h1>

        <p>
          ConvertHub is a free collection of calculators and unit converters for finance, health, math,
          cooking, time and everyday tasks. Each tool runs in your browser, and you do not need an account to use it.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 dark:text-white pt-2">Who runs ConvertHub</h2>
        <p>
          ConvertHub is operated by {SITE_INFO.operator}. Questions about the site can be sent to the{" "}
          <Link to="/contact" className="text-indigo-600 dark:text-indigo-400 hover:underline">contact page</Link>.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 dark:text-white pt-2">How the calculators work</h2>
        <p>
          Every calculator states the formula it uses. Results are estimates for planning and learning, not
          financial, medical or legal advice. Rates, taxes and limits change, so check official sources before
          making a decision based on a result.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 dark:text-white pt-2">Your privacy</h2>
        <p>
          Calculations are performed in your browser. If you choose to sign in, favourites are saved to your
          account. Read the <Link to="/privacy-policy" className="text-indigo-600 dark:text-indigo-400 hover:underline">Privacy Policy</Link> for
          details on data collection and advertising.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 dark:text-white pt-2">Read before you rely on a result</h2>
        <p>
          The <Link to="/disclaimer" className="text-indigo-600 dark:text-indigo-400 hover:underline">Disclaimer</Link> and{" "}
          <Link to="/terms-of-use" className="text-indigo-600 dark:text-indigo-400 hover:underline">Terms of Use</Link> set out
          the limits of what the calculators can be used for.
        </p>
      </div>
    </>
  );
}
