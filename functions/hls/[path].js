export default {
  async fetch(request) {
    const parsedUrl = new URL(request.url);
    const targetUrl =
      "https://esraerol2.ronaldovurdu.help" +
      parsedUrl.pathname +
      parsedUrl.search;

    const cache = caches.default;
    let cached = await cache.match(request);

    if (cached) {
      return cached;
    }

    let response = await fetch(targetUrl);
    let newHeaders = new Headers(response.headers);
    newHeaders.delete("set-cookie");
    newHeaders.set("Access-Control-Allow-Origin", "*");

    let modifiedResponse = new Response(response.body, {
      status: response.status,
      headers: newHeaders,
    });

    // Cache'e yaz
    if (response.status === 200) {
      await cache.put(request, modifiedResponse.clone());
    }

    return modifiedResponse;
  },
};
