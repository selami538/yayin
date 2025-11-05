export async function onRequest({ request }) {
  const parsedUrl = new URL(request.url);

  // Cloudflare Pages domain’inde "/hls" altındaki isteği kırpıyoruz
  const targetUrl = "https://esraerolseksi.global.ssl.fastly.net" +
    parsedUrl.pathname.replace("/hls", "") +
    parsedUrl.search;

  const response = await fetch(targetUrl, {
    cf: {
      cacheEverything: true,
      cacheTtl: 360
    }
  });

  const newHeaders = new Headers(response.headers);
  newHeaders.delete("set-cookie");
  newHeaders.set("Access-Control-Allow-Origin", "*");

  return new Response(response.body, {
    status: response.status,
    headers: newHeaders
  });
}
