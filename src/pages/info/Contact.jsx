import React from "react";
import PageSEO from "../../components/ui/PageSEO";
import { SITE_INFO } from "../../data/siteInfo";

export default function Contact() {
  const email = SITE_INFO.contactEmail;
  return (
    <>
      <PageSEO
        title="Contact"
        description="Contact ConvertHub with questions, corrections or feedback about its calculators."
        path="/contact"
      />
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 space-y-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Contact ConvertHub</h1>

        <p>
          Email us about a calculator result, a correction, a bug or a feature request. We read every message,
          but we cannot give personal financial, medical or legal advice.
        </p>

        <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4">
          <p className="font-semibold text-slate-800 dark:text-white">Email</p>
          <p className="mt-1">
            <a href={`mailto:${email}`} className="text-indigo-600 dark:text-indigo-400 hover:underline break-all">{email}</a>
          </p>
        </div>

        <p>When you write, please include the calculator name and the inputs you used, so we can reproduce the result.</p>
      </div>
    </>
  );
}
