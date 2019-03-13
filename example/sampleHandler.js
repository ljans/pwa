class SampleHandler {
	
	// Setup the URL pattern for this handler
	get pattern() {
		return /\/say\/(.+)\/?$/;
	}
	
	// Setup request processing
	async process(request) {
		const input = decodeURI(request.params[1]);
		if(input.length > 11) throw 'Cannot say that';
		return new Response('You wanted me to say "'+input+'". Make me say something else by changing the URL. Note that I can only say up to 11 characters.');
	}
}