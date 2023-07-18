# PWA
This simple tool makes it easy to create Progressive Web Apps featuring ServiceWorker functionality. See [`example`](example) for a demo application.

### Getting started
Import the script into your ServiceWorker:
```javascript
self.importScripts('pwa.js');
```
Now you can construct a new instance of `PWA`:
```javascript
const pwa = new PWA(config);
```
The features of your PWA can be configured using the `config` object as shown in the following sections.

### Caching
You can provide an array `cachedFiles` consisting of files that should be loaded into the cache for offline access. Also define a `cacheVersion` that controls whether the cache needs to be updated. Example:
```javascript
new PWA({
	cacheVersion: 1,
	cachedFiles: ['test.html', 'octocat.png'],
});
```

### Request handling
You can provide an array `requestHandlers` consisting of custom handler objects. If a requested URL matches the regular expression provided by the handlers property `pattern` its method `process` is invoked with the request object as parameter. This consists of:

Property | Type | Description
-- | -- | --
`url` | [URL](https://developer.mozilla.org/en-US/docs/Web/API/URL) | Request URL
`GET` | [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) | Received GET-parameters
`POST` | [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) | Received POST-parameters
`params` | Array | Matched groups from the handler's regular expression

Simple example for a custom handler:
```javascript
new PWA({
	requestHandlers: [{
		pattern: /hello/,
		process: () => new Response('Hello world!'),
	}],
});
```

### Filtering
You can provide a method `requestFilter` that is invoked with the request object before processing it. The filter output is then passed to the custom handlers.
In a smilar way, a `responseFilter` can be used to filter the handler output before sending it back to the browser. Example:
```javascript
new PWA({
	requestHandlers: [{
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
new PWA({
	requestHandlers: [{
		pattern: /hello/,
		process: () => { unknownFunction(); },
	}],
	
	exceptionHandler: e => new Response('Error: '+e.message),
});
```

### Configuration class
The configuration object can also be an instance of a class implementing the desired methods:
```javascript
class Config {
	get cachedFiles() {}
	get cacheVersion() {}
	get requestHandlers() {}
	
	async requestFilter(request) {}
	async responseFilter(response) {}
}

new PWA(new Config());
```
