import { Helmet } from "react-helmet-async";

const SITE_NAME = "CalcVault";
const BASE_URL = "https://dailycalculator.vercel.app";

export default function PageSEO({ title, description, path }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Free Online Calculators`;
  const url = path ? `${BASE_URL}${path}` : BASE_URL;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || "Free online calculators for finance, health, math, cooking, tech, and everyday tools."} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || "Free online calculators for finance, health, math, cooking, tech, and everyday tools."} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || "Free online calculators for finance, health, math, cooking, tech, and everyday tools."} />
    </Helmet>
  );
}
