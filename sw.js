
const CACHE_NAME = "covid19-ui5-v2.2.2";
let RESOURCES_TO_PRELOAD = [
	"index.html",
	"Component-preload.js",
	"css/style.css",
	"manifest.json",
	"manifest.json?sap-language=EN",
	"img/arogya.png",
	"img/cdc.png",
	"img/icmr.png",
	"img/logo.png",
	"img/moh.png",
	"img/mygov.png",
	"img/who.png",
	"i18n/i18n.properties",
	"i18n/i18n_en.properties"
];

// Note: to preload the UI5 core and mobile libraries by install,
const cdnBase = "https://openui5.hana.ondemand.com/resources/";
RESOURCES_TO_PRELOAD = RESOURCES_TO_PRELOAD.concat([
	`${cdnBase}sap-ui-core.js`,
	`${cdnBase}sap/ui/core/library-preload.js`,
	// `${cdnBase}sap/ui/core/themes/sap_fiori_3/library.css`,
	// `${cdnBase}sap/ui/core/themes/sap_fiori_3_dark/library.css`,
	`${cdnBase}sap/ui/core/themes/base/fonts/SAP-icons.woff2`,
	`${cdnBase}sap/m/library-preload.js`,
	`${cdnBase}sap/ui/layout/library-preload.js`,
	// `${cdnBase}sap/ui/core/themes/sap_fiori_3/fonts/72-Bold.woff2`,
	// `${cdnBase}sap/ui/core/themes/sap_fiori_3_dark/fonts/72-Bold.woff2`,
	// `${cdnBase}sap/ui/core/themes/sap_fiori_3/fonts/72-Regular.woff2`,
	// `${cdnBase}sap/ui/core/themes/sap_fiori_3_dark/fonts/72-Regular.woff2`,
	`${cdnBase}sap/ui/core/messagebundle.properties`,
	`${cdnBase}sap/ui/core/messagebundle_en.properties`,
	`${cdnBase}sap/m/messagebundle_en.properties`,
	`${cdnBase}sap/ui/layout/messagebundle.properties`,
	`${cdnBase}sap/ui/layout/messagebundle_en.properties`,
	`${cdnBase}sap/f/library-preload.js`,
]);

// Preload some resources during install
self.addEventListener("install", function (event) {
	event.waitUntil(
		caches
		.open(CACHE_NAME)
		.then(function (cache) {
			return cache.addAll(RESOURCES_TO_PRELOAD);
			// if any item isn't successfully added to
			// cache, the whole operation fails.
		})
		.catch(function (error) {
			console.error(error);
		})
	);
});

// Delete obsolete caches during activate
self.addEventListener("activate", function (event) {
	event.waitUntil(
		caches.keys().then(function (keyList) {
			return Promise.all(
				keyList.map(function (key) {
					if (key !== CACHE_NAME) {
						return caches.delete(key);
					}
				})
			);
		})
	);
});

// During runtime, get files from cache or -> fetch, then save to cache
self.addEventListener("fetch", function (event) {
	// only process GET requests
	if (event.request.method === "GET" && event.request.url.indexOf("api.covid19india.org") < 0) {
		event.respondWith(
			caches.match(event.request).then(function (response) {
				if (response) {
					return response; // There is a cached version of the resource already
				}

				let requestCopy = event.request.clone();
				return fetch(requestCopy)
					.then(function (response) {
						// opaque responses cannot be examined, they will just error
						if (response.type === "opaque") {
							// don't cache opaque response, you cannot validate it's status/success
							return response;
							// response.ok => response.status == 2xx ? true : false;
						} else if (!response.ok) {
							console.error(response.statusText);
						} else {
							return caches
								.open(CACHE_NAME)
								.then(function (cache) {
									cache.put(event.request, response.clone());
									return response;
									// if the response fails to cache, catch the error
								})
								.catch(function (error) {
									console.error(error);
									return error;
								});
						}
					})
					.catch(function (error) {
						// fetch will fail if server cannot be reached,
						// this means that either the client or server is offline
						console.error(error);
						return caches.match("img/logo.png");
					});
			})
		);
	}
});
