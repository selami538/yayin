export async function onRequest({ request, params }) {
  const origin = "https://corestream.ronaldovurdu.help/hls/";
  const filename = params.path; // /hls/sonrası ne geldiyse bu
  const targetUrl = origin + filename;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Cloudflare Pages Proxy)",
      },
    });

    if (!response.ok) {
      return new Response(`Upstream error ${response.status}`, { status: 502 });
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "application/vnd.apple.mpegurl",
        "Cache-Control": "public, max-age=5",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (e) {
    return new Response(`Error: ${e.message}`, { status: 500 });
  }
}
