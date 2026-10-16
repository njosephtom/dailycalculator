import { Helmet } from "react-helmet-async";

const SITE_NAME = "CalcVault";
const BASE_URL = "https://www.converthub.wiki";

export default function PageSEO({ title, description, path, schema }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Free Online Calculators`;
  const url = path ? `${BASE_URL}${path}` : BASE_URL;
  const defaultDesc = "Free online calculators for finance, health, math, cooking, tech, and everyday tools.";
  const finalDesc = description || defaultDesc;

  // Default Organization schema
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": SITE_NAME,
    "url": BASE_URL,
    "description": defaultDesc,
  };

  // WebApplication schema for calculator pages
  const appSchema = schema || orgSchema;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={finalDesc} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={finalDesc} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={finalDesc} />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      {/* JSON-LD Schema Markup */}
      <script type="application/ld+json">{JSON.stringify(appSchema)}</script>
    </Helmet>
  );
}
