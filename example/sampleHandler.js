class SampleHandler {
	
	// Setup the URL pattern for this handler
	get pattern() {
		return /\/say\/(.+)\/?$/;
	}
	
	// Setup request processing
	async process(request) {
		return new Response('You wanted me to say "'+decodeURI(request.params[1])+'". Make me say something else by changing the URL.');
	}
}