# Getting started
In your `ServiceWorker` (typically `sw.js`) construct a new instance of `Serivce` with a configuration object. This might look like so:
```javascript
self.importScripts('service.min.js', 'sampleHandler.js');

const service = new Service({
	version: 1,
	cache: ['test.html'],
	handlers: [new SampleHandler()],
});
```
In `sampleHandler.js`, register a handler to process requests. You also need to define an URL-pattern to determine, which requests your handler should respond to.

**Pro Tip:** This opens up the opportunity to enable routing for your PWA with multiple handlers.
```javascript
class SampleHandler {
	
	get pattern() {
		return /\/say\/(.+)\/?$/;
	}
	
	async process(request) {
		return new Response('You wanted me to say "'+decodeURI(request.params[1])+'".');
	}
}
```
And that's it! The page `test.html` is now served from cache, and your `SampleHandler` can process requests. You don't need to register any `EventListener`.

For a working example see the contents of `example`.

## Processing requests
The `process` method of a handler is invoked with a `request` object. This consists of:

| Property | Description |
| -------- | ----------- |
| `url` | The request's [URL](https://developer.mozilla.org/en-US/docs/Web/API/URL) object |
| `GET` | Provided GET-paramters |
| `POST` | Provided POST-parameters |
| `params` | The matched groups from the handler's pattern |

## Filtering requests

Besides the `version`, `cache` and `handlers` of a service, there can also be passed *request filters* in the configuration object:
* The `requestFilter` is invoked with every request handled by *any* registered handler. This for example can come in handy when you want to apply pagewide settings via `GET`-parameters across all your handlers.
* The `responseFilter` can modify the result from the corresponding handler, e.g. changing headers of the [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) object.

## Configuration class
The configuration object in the constructor of `Service` can also be an instance of a class like this:
```javascript
class ServiceConfig {
	get cache() {}
	get handlers() {}
	get version() {}
	
	async requestFilter(request) {}
	async responseFilter(response) {}
}
```
This allows for the configuration to be derived from some global controller managing your application.

**Pro Tip:** Pass `version` in the constructor to enforce updates of the `ServiceWorker` due to version-changes in `sw.js`.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.