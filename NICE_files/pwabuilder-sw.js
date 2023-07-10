if( 'function' === typeof importScripts) {
	importScripts("https://storage.googleapis.com/workbox-cdn/releases/6.4.0/workbox-sw.js");

	self.addEventListener('message', messageEvent => {
		if (messageEvent.data === 'skipWaiting') return skipWaiting();
	});

	workbox.precaching.precacheAndRoute([
		{ url: 'https://masajid.b-cdn.net/audio/alarm-1.mp3',revision: 'null'},
		{ url: 'https://masajid.b-cdn.net/audio/alarm-2.mp3',revision: 'null'},
		{ url: 'https://masajid.b-cdn.net/audio/azan-makkah-short.mp3',revision: 'null'},
		{ url: 'https://masajid.b-cdn.net/audio/azan-makkah-full.mp3',revision: 'null'},
		{ url: 'https://masajid.b-cdn.net/audio/azan-mishary-short.mp3',revision: 'null'},
		{ url: 'https://masajid.b-cdn.net/audio/azan-mishary-full.mp3',revision: 'null'},
		{ url: 'https://masajid.b-cdn.net/audio/azan-mishary2-short.mp3',revision: 'null'},
		{ url: 'https://masajid.b-cdn.net/audio/azan-mishary2-full.mp3',revision: 'null'},
		{ url: 'https://masajid.b-cdn.net/audio/azan-ahmad-short.mp3',revision: 'null'},
		{ url: 'https://masajid.b-cdn.net/audio/azan-ahmad-full.mp3',revision: 'null'},
		{ url: 'https://masajid.b-cdn.net/audio/azan-hafiz-short.mp3',revision: 'null'},
		{ url: 'https://masajid.b-cdn.net/audio/azan-hafiz-full.mp3',revision: 'null'},
		{ url: 'https://masajid.b-cdn.net/audio/morning-dhikr.mp3',revision: 'null'},
		{ url: 'https://masajid.b-cdn.net/audio/evening-dhikr.mp3',revision: 'null'}
	]);

	workbox.routing.registerRoute(
	  /\.(?:masjid|login)$/,
	  new workbox.strategies.StaleWhileRevalidate({
		cacheName: 'html-cache'
	  })
	);

	workbox.routing.registerRoute(
	  /\.css$/,
	  new workbox.strategies.StaleWhileRevalidate({
		cacheName: 'css-cache',
	  })
	);

	workbox.routing.registerRoute(
	  /\.(?:js|min.js)$/,
	  new workbox.strategies.StaleWhileRevalidate({
		cacheName: 'js-cache',
	  })
	);

	workbox.routing.registerRoute(
	  /\.(?:woff|woff2|ttf|otf)$/,
	  new workbox.strategies.CacheFirst({
		cacheName: 'fonts-cache',
	  })
	);

	workbox.routing.registerRoute(
	  new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
	  new workbox.strategies.CacheFirst({
		cacheName: 'google-fonts-cache',
		plugins: [
			new workbox.expiration.ExpirationPlugin({
				maxEntries: 30,
			}),
			new workbox.cacheableResponse.CacheableResponsePlugin({
				statuses: [0, 200]
			})
		],
	  }),
	);

	workbox.routing.registerRoute(
	  /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
	  new workbox.strategies.CacheFirst({
		cacheName: 'image-cache',
		plugins: [
		  new workbox.expiration.ExpirationPlugin({
			purgeOnQuotaError: true
		  })
		],
	  })
	);

	workbox.routing.registerRoute(
	  /\.(?:wav|mp3|ogg)$/,
	  new workbox.strategies.CacheFirst({
		cacheName: 'media-cache',
		plugins: [
		  new workbox.expiration.ExpirationPlugin({
			purgeOnQuotaError: true
		  })
		],
	  })
	);
}