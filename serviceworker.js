var CACHE_NAME = 'v1';
var urlsToCache = [
    '/',
    'assets/img/teddy.gif',
    'manifest.json',
    'fallback.json'
];

// SW install
this.addEventListener('install', function (event) {
    event.waitUntil(
        (async () => {
            try {
                //  install default files
                console.log('SW 1st Install!')
                const cacheOpen = await caches.open(CACHE_NAME)
                const cacheAddFiles = await cacheOpen.addAll(urlsToCache)
                return cacheAddFiles
            }
            catch (err) {
                console.log("error occured while 1st caching...", err)
            }
        })()
    );
});

this.addEventListener('activate', event => {
    const api = "https://my-json-server.typicode.com/barasia/api-fake/animals";
    event.waitUntil(
        (async () => {
            try {
                // write 1st fetch to cache
                const cacheOpenAnimals = await caches.open('cache-animals')
                const liveResponse = await fetch(api)
                cacheOpenAnimals.put(CACHE_NAME, liveResponse.clone())
                // check first load
                const cacheMatchFirstReload = await caches.match('firstReload.json')
                if(!cacheMatchFirstReload){
                    console.log('No FirstLoad in cache')
                    const cacheOpenV1 = await caches.open(CACHE_NAME)
                    await cacheOpenV1.add(['firstReload.json'])
                }
            }
            catch (err) {
                console.log("error occured while SW Active ...", err)
            }
        })()
    );
});

// SW fetch
this.addEventListener('fetch', function (event) {
    var request = event.request
    var url = new URL(request.url)

    // split request from live dan cache
    if (url.origin === location.origin) {
        event.respondWith(
            (async () => {
                // Try to get the response from a cache.
                const cacheMatch = await caches.match(request);
                // Return it if we found one.
                if (cacheMatch) return cacheMatch;
                // If we didn't find a match in the cache, use the network.
                return fetch(request);
            })()
        )
    } else {
        event.respondWith(
            (async () => {
                try {
                    const cacheOpen = await caches.open('cache-animals')
                    const liveResponse = await fetch(request)
                    cacheOpen.put(request, liveResponse.clone())
                    console.log('LIVE response and insert into cache')
                    return liveResponse
                } catch {
                    const cachedMatch = await caches.match(request)
                    console.log('OFFLINE response and data from cached match')
                    if (cachedMatch) return cachedMatch
                    console.log('data from fallback')
                    const cachedFallback = await caches.match('fallback.json')
                    return cachedFallback
                }
            })()
        )

    }
});