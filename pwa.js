/*!
 * pwa.js ServiceWorker wrapper v1.8
 * Licensed under the MIT license
 * Copyright (c) 2024 Lukas Jans
 * https://github.com/ljans/pwa
 */
class PWA {
	
	// Construct with configuration
	constructor(config) {
		this.config = config;
		
		// Register events (waitUntil ensures that the service worker does not change state until the promise is resolved)
		self.addEventListener('install', e => e.waitUntil(this.install()));
		self.addEventListener('activate', e => e.waitUntil(this.activate()));
		self.addEventListener('fetch', e => e.respondWith(this.fetch(e.request)));
	}
	
	// Install the ServiceWorker (if the promise gets rejected, the browser dismisses the installation)
	async install() {
			
		// When ready, immediately replace the current ServiceWorker (if existing) by skipping the waiting-phase
		self.skipWaiting();
		
		// Cache resources (an exception causes the promise to reject)
		if(this.config.cachedFiles) {
			const cache = await caches.open(this.config.cacheVersion);
			await cache.addAll(this.config.cachedFiles);
		}
	}
	
	// Activate the ServiceWorker (it now is the only one responsible for this scope)
	async activate() {

		// Claim control over all clients in this scope (otherwise they won't use the sw if they were opened before the sw was registered)
		await clients.claim();
		
		// Delete caches from older versions of this PWA
		for(const name of await caches.keys()) {
			if(name != this.config.cacheVersion) await caches.delete(name);
		}
	}
	
	// Respond to fetch events
	async fetch(request) {
			
		// Load the request
		let data = {};
		data.url = new URL(request.url);
		data.GET = data.url.searchParams;
		data.POST = new URLSearchParams(await request.clone().text());
		
		// Try to deliver a cached response
		if(this.config.cachedFiles) {
			
			// Check if the requested file is expected to be in cache (compare by absolute URL)
			let expectedInCache = false;
			for(const file of this.config.cachedFiles) {
				const url = new URL(file, self.location);
				if(url.toString() != data.url.toString()) continue;
				expectedInCache = true;
			}
			
			// Check if the requested file is actually cached
			if(expectedInCache) {
				const cached = await caches.match(request);
				if(cached) return cached;
				
				// Try to restore cache integrity
				/*if(navigator.onLine) {
					const response = await fetch(request);
					const cache = await caches.open(this.config.version);
					cache.put(request, response.clone());
					return response;
				}*/
				
				// Fail the request otherwise
				throw 'cache loss';
			}
		}
		
		// Let handlers process the request
		if(this.config.requestHandlers) for(let handler of this.config.requestHandlers) {
			
			// Match the handler pattern against the relative path inside the scope
			const absolute = data.url.origin + data.url.pathname;
			const relative = absolute.replace(self.registration.scope, '');
			if(data.params = handler.pattern.exec(decodeURIComponent(relative))) {
				
				// Apply filters and process request
				try {
					if(this.config.requestFilter) data = await this.config.requestFilter(data);
					let response = await handler.process(data);
					if(this.config.responseFilter) response = await this.config.responseFilter(response);
					return response;
					
				// Exception handling
				} catch(exception) {
					return this.config.exceptionHandler ? this.config.exceptionHandler(exception) : Response.error();
				}
			}
		}
		
		// Fall back to network or fail the request
		return navigator.onLine ? fetch(request) : Response.error();
	}
}