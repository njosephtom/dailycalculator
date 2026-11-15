// PDF Tools (beta) access: localhost only, and only for these accounts.
// Gates the menus, category hub, search and routes. Everything else stays public.
const PDF_TOOLS_EMAILS = ["ouseph13@gmail.com", "chimmuaugustine@gmail.com"];
const LOCAL_HOSTS = ["localhost", "127.0.0.1"];

export function canUsePdfTools(user) {
  if (typeof window === "undefined" || !LOCAL_HOSTS.includes(window.location.hostname)) return false;
  const email = user?.email?.toLowerCase();
  return !!email && PDF_TOOLS_EMAILS.includes(email);
}

// PDF API base. Default is the same-origin /api/pdf; set VITE_PDF_API_URL to the Render service URL.
export const PDF_API_URL = import.meta.env.VITE_PDF_API_URL || "/api/pdf";

// Category visibility for menus and hubs. Only "pdf" is gated.
export function canSeeCategory(category, user) {
  return category !== "pdf" || canUsePdfTools(user);
}
