/**
 * Same-origin Education Portal proxy for brahmando.com
 * Browser → brahmando.com/api/education/* → chat.brahmando.com (server-side)
 * Fixes India / mobile users who cannot reach chat.brahmando.com directly.
 */
const UPSTREAM = "https://chat.brahmando.com/api/education";

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith("/api/education")) {
      return fetch(request);
    }

    const suffix = url.pathname.slice("/api/education".length) || "/";
    const target = `${UPSTREAM}${suffix}${url.search}`;

    const headers = new Headers(request.headers);
    headers.set("X-Internal-Call", "brahmando");
    headers.delete("host");

    const init = {
      method: request.method,
      headers,
      redirect: "follow",
    };
    if (request.method !== "GET" && request.method !== "HEAD") {
      init.body = await request.arrayBuffer();
    }

    try {
      const resp = await fetch(target, init);
      const out = new Headers(resp.headers);
      out.set("Access-Control-Allow-Origin", "*");
      out.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      out.set("Access-Control-Allow-Headers", "Content-Type, Accept");
      return new Response(resp.body, { status: resp.status, headers: out });
    } catch {
      return new Response(
        JSON.stringify({ detail: "Education Portal upstream unreachable" }),
        { status: 502, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
      );
    }
  },
};
