class ServiceConfig {
	
	// Setup cached resources
	get cache() {
		return [
			'test.html',
			'octocat.png',
		];
	}
	
	// Setup request handlers
	get handlers() {
		return [
			new SampleHandler(),
		];
	}
	
	// Construct with version
	constructor(version) {
		this.version = version;
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