const SITE_HOSTS = ["esg-leadership-forum.apps.grok.bot"];

function hostOf(value: string): string | null {
  try {
    return new URL(value).host.toLowerCase();
  } catch {
    return null;
  }
}

function hostname(host: string): string {
  const value = host.trim().toLowerCase();
  if (value.startsWith("[")) {
    const end = value.indexOf("]");
    return end === -1 ? value : value.slice(1, end);
  }
  return value.split(":")[0];
}

function isLoopback(host: string): boolean {
  const name = hostname(host);
  return name === "localhost" || name === "127.0.0.1" || name === "::1";
}

function expectedHosts(request: Request): Set<string> {
  const hosts = new Set<string>(SITE_HOSTS);
  const requestHost = request.headers.get("host")?.trim().toLowerCase() || "";
  const loopbackOk = process.env.NODE_ENV !== "production" && isLoopback(requestHost);
  if (loopbackOk) {
    hosts.add("localhost");
    hosts.add("127.0.0.1");
    hosts.add("[::1]");
  }
  if (requestHost && (loopbackOk || !isLoopback(requestHost))) {
    hosts.add(requestHost);
  }

  const site = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (site) {
    const parsed = hostOf(site);
    if (parsed && (loopbackOk || !isLoopback(parsed))) hosts.add(parsed);
  }
  for (const item of (process.env.FORM_ALLOWED_ORIGINS || "").split(",")) {
    const value = item.trim();
    if (!value) continue;
    const parsed = value.includes("://") ? hostOf(value) : value.toLowerCase();
    if (!parsed || (!loopbackOk && isLoopback(parsed))) continue;
    hosts.add(parsed);
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
  // A client can invent Sec-Fetch-Site. Without the page address, refuse.
  if (!source) return false;

  const sourceHost = hostOf(source);
  if (!sourceHost || (isLoopback(sourceHost) && process.env.NODE_ENV === "production")) {
    return false;
  }
  return expectedHosts(request).has(sourceHost);
}
