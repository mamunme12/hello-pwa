var cacheName = 'hello-pwa';
var filesToCache = [
  'index.html',
  'css/style.css',
  'js/main.js',
  'js/app.js'
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  console.log("starting service worker to cache......");
  try {
	e.waitUntil(
		caches.open(cacheName).then(function(cache) {
				return cache.addAll(filesToCache);
			})
		);
		self.skipWaiting();
  } catch (error) {
	console.log("ERROR=>"+error);
  }
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});

//enabling push notification
self.addEventListener('push', (event) => {
	const json = JSON.parse(event.data.text())
	console.log('Push Data', event.data.text())
	self.registration.showNotification(json.header, json.options)
  });
