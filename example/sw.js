// Import dependencies
self.importScripts(
	'../service.min.js',
	'serviceConfig.js',
	'sampleHandler.js',
);

// Setup the service
const config = new ServiceConfig(1);
const service = new Service(config);