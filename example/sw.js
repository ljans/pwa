// Import dependencies
self.importScripts(
	'../service.js',
	'serviceConfig.js',
	'sampleHandler.js'
);

// Setup the service
const config = new ServiceConfig(1);
const service = new Service(config);