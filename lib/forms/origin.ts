const BUILTIN_HOSTS = ["esg-leadership-forum.apps.grok.bot", "localhost", "127.0.0.1"];

function hostOf(value: string): string | null {
  try {
    return new URL(value).host.toLowerCase();
  } catch {
    return null;
  }
}

function expectedHosts(request: Request): Set<string> {
  const hosts = new Set<string>(BUILTIN_HOSTS);
  const host = request.headers.get("host")?.trim().toLowerCase();
  if (host) hosts.add(host);
  const site = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (site) {
    const parsed = hostOf(site);
    if (parsed) hosts.add(parsed);
  }
  for (const item of (process.env.FORM_ALLOWED_ORIGINS || "").split(",")) {
    const value = item.trim();
    if (!value) continue;
    const parsed = value.includes("://") ? hostOf(value) : value.toLowerCase();
    if (parsed) hosts.add(parsed);
  }
  return hosts;
}

/** Browser posts must come from this site. A cross-site page is rejected. */
export function requestIsSameOrigin(request: Request): boolean {
  const fetchSite = request.headers.get("sec-fetch-site")?.trim().toLowerCase();
  if (fetchSite === "cross-site") return false;

  const origin = request.headers.get("origin")?.trim();
  const referer = request.headers.get("referer")?.trim();
  const source = origin || referer;
  if (!source) {
    return fetchSite === "same-origin" || fetchSite === "same-site" || fetchSite === "none";
  }

  const sourceHost = hostOf(source);
  if (!sourceHost) return false;
  return expectedHosts(request).has(sourceHost);
}
