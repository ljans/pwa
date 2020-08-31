## Getting started
Import the script into your ServiceWorker:
```javascript
self.importScripts('service.min.js');
```
Now you can construct a new instance of `Service`:
```javascript
const service = new Service(config);
```
The features of the service can be configured using the `config` object as shown in the following sections. See [`example`](example) for a demo application.

### Caching
You can provide an array `cache` consisting of files that should be loaded into the cache for offline access. Also define a `version` that controls whether the cache needs to be updated. Example:
```javascript
new Service({
	version: 1,
	cache: ['test.html', 'octocat.png'],
});
```

### Custom handlers
You can provide an array `handlers` consisting of custom handler objects. A handler is called if a requested url matches the regular expression provided by its property `pattern`. Then the handlers method `process` is invoked with the request object as parameter. It consists of:

Property | Type | Description
-- | -- | --
`url` | [URL](https://developer.mozilla.org/en-US/docs/Web/API/URL) | Request URL
`GET` | [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) | Sent GET-parameters
`POST` | [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) | Sent POST-parameters
`params` | [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) | Matched groups from the handler's regular expression

Simple example for a custom handler:
```javascript
new Service({
	handlers: [{
		pattern: /test/,
		process: request => new Response('Hello world!'),
	}],
});
```

### Filtering
You can provide a method `requestFilter` that is invoked with the request object before processing it. The filter output is then passed to the custom handlers.
In a smilar way, a `responseFilter` can be used to filter the handler output before sending it back to the browser. Example:
```javascript
new Service({
	handlers: [{
		pattern: /hello/,
		process: request => 'Hello '+request.POST.get('name'),
	}],
	
	// Manipulating POST parameter in request
	requestFilter: request => {
		request.POST.set('name', 'Alice');
		return request;
	},
	
	// Wrapping the text output in a response object
	responseFilter: text => new Response(text),
});
```

### Exception handling
By default, an exception in a handler results in an error response. You can catch exceptions using an `exceptionHandler`. Example:
```javascript
new Service({
	handlers: [{
		pattern: /test/,
		process: () => { unknownFunction(); },
	}],
	
	exceptionHandler: e => new Response('Error: '+e.message),
});
```

### Configuration class
The configuration object can also be an instance of a class implementing the desired methods:
```javascript
class ServiceConfig {
	get cache() {}
	get handlers() {}
	get version() {}
	
	async requestFilter(request) {}
	async responseFilter(response) {}
}

new Service(new ServiceConfig());
```
