/*!
 * pwa.js ServiceWorker wrapper v1.5
 * Licensed under the MIT license
 * Copyright (c) 2020 Lukas Jans
 * https://github.com/luniverse/pwa
 */
PWA = class {
	
	// Construct with configuration
	constructor(config) {
		this.config = config;
		
		// Register events
		self.addEventListener('install', e => e.waitUntil(this.install()));
		self.addEventListener('activate', e => e.waitUntil(this.activate()));
		self.addEventListener('fetch', e => e.respondWith(this.fetch(e)));
	}
	
	// Install the ServiceWorker (if the promise gets rejected, the browser dismisses the installation)
	async install() {
			
		// When ready, immediately replace the current ServiceWorker (if existing) by skipping the waiting-phase
		self.skipWaiting();
		
		// Cache resources (an exception causes the promise to reject)
		if(this.config.cachedFiles) {
			const cache = await caches.open(this.config.cacheVersion);
			cache.addAll(this.config.cachedFiles);
		}
	}
	
	// Activate the ServiceWorker (it now is the only one responsible for this scope)
	async activate() {

		// Claim control over all clients in this scope
		await clients.claim();
		
		// Delete caches from older versions of this PWA
		for(const cache of await caches.keys()) {
			if(cache != this.config.cacheVersion) await caches.delete(cache);
		}
	}
	
	// Respond to fetch events
	async fetch(e) {
			
		// Load the request
		let request = {}
		request.url = new URL(e.request.url);
		request.GET = request.url.searchParams;
		request.POST = new URLSearchParams(await e.request.clone().text());
		
		// Return cached resources
		const cached = await caches.match(e.request);
		if(cached) return cached;
		
		// Match request against handlers
		if(this.config.requestHandlers) for(let handler of this.config.requestHandlers) {
			if(request.params = handler.pattern.exec(request.url.pathname)) {
				
				// Apply filters and process request
				try {
					if(this.config.requestFilter) request = await this.config.requestFilter(request);
					let response = await handler.process(request);
					if(this.config.responseFilter) response = await this.config.responseFilter(response);
					return response;
					
				// Exception handling
				} catch(exception) {
					return this.config.exceptionHandler ? this.config.exceptionHandler(exception) : Response.error();
				}
			}
		}
		
		// Network fallback
		return fetch(e.request);
	}
}