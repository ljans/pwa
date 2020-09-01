class Config {
	
	// Setup the cache
	get cachedFiles() {
		return [
			'test.html',
			'octocat.png',
		];
	}
	
	// Setup request handlers
	get requestHandlers() {
		return [
			new SampleHandler(),
		];
	}
	
	// Construct with version
	constructor(version) {
		this.cacheVersion = version;
	}
	
	// Filter requests
	async requestFilter(request) {
		console.log('Incoming request', request);
		return request;	
	}
	
	// Filter responses
	async responseFilter(response) {
		console.log('Outgoing response', response);
		return response;
	}
	
	// Handle exceptions
	async exceptionHandler(exception) {
		return new Response(null, {
			status: 500,
			statusText: exception,
		});
	}
}