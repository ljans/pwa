// Import dependencies
self.importScripts(
	'../pwa.js',
	'config.js',
	'sampleHandler.js'
);

// Setup the PWA
const config = new Config(1);
const pwa = new PWA(config);
