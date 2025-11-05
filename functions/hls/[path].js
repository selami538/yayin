export async function onRequest({ request }) {
  const parsedUrl = new URL(request.url);

  // Artık /hls kısmını kaldırmıyoruz, çünkü origin’de de var
  const targetUrl = "https://esraerolseksi.global.ssl.fastly.net" +
    parsedUrl.pathname +
    parsedUrl.search;

  const response = await fetch(targetUrl, {
    cf: { cacheEverything: true, cacheTtl: 360 },
  }).catch(err => {
    return new Response("Fetch error: " + err.message, { status: 500 });
  });

  if (!(response instanceof Response)) return response;

  const newHeaders = new Headers(response.headers);
  newHeaders.delete("set-cookie");
  newHeaders.set("Access-Control-Allow-Origin", "*");

  return new Response(response.body, {
    status: response.status,
    headers: newHeaders,
  });
}
