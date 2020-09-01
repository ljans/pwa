// Import dependencies
self.importScripts(
	'../pwa.min.js',
	'config.js',
	'sampleHandler.js'
);

// Setup the PWA
const config = new Config(1);
const pwa = new PWA(config);
