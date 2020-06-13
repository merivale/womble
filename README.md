# Womble

Womble is a minimalist web application framework for [Deno](https://deno.land).

A web application is essentially a function from HTTP requests to HTTP responses. Womble lets you write it as such, and gives you a bit of sugar to make managing requests and responses a little easier. If you want more than that, you're in the wrong place.

## 1. Basic usage

```ts
import { App, Request, Response, Status } from 'https://raw.githubusercontent.com/merivale/womble/v0.3.0/mod.ts'

function router (request: Request): Response {
  return new Response(Status.OK, 'text/plain', `Womble is responding to the request for ${request.path}.`)
}

const womble = new App(router)
const port = 3000
womble.listen(port)
```

## 2. A more complex example

Womble doesn't come with a router, so your main application function will typically do the routing, and call whatever other functions you need to create and return the responses. E.g.:

```ts
import * as handler from './handler.ts' // put your application logic here

function router (request: Request): Response {
  switch (request.path) {
    case '/':
      return handler.home()

    case '/about':
      return handler.about()
  }

  const blogPathText = request.path.match(/\/post\/(.*)/)
  if (blogPathText) {
    return handler.blog(blogPathText[1])
  }

  return handler.notFoundResponse
}
```

This might seem tedious if you're used to higher level frameworks that let you define your routes and then take care of the routing logic for you. Fair enough. Personally I find this lower level approach easier to read and test. Also I'm a bit obsessive and like having more fine-grained control.

## 3. Asyncronous handlers

Your application can be asyncronous, should you want/need to `await` anything inside any of your handlers. For example, you can read files and serve them up like this:

```ts
async function router (request: Request): Promise<Response> {
  switch (request.path) {
    ...

    case '/favicon.ico':
      return await favicon()
  }

  ...
}

async function favicon (request: Request): Promise<Response> {
  const buffer = await Deno.readFile('favicon.ico')
  return new Response(Status.OK, 'image/ico', buffer)
}
```

## 4. Error handling

Ideally, a web application should never throw an error; instead, it should return an HTTP error response. If your Womble application *does* throw an error, Womble will catch it, and convert it into a plain text error response with the error message in the body, returning that instead.

You can customize this response by giving Womble your own `errorHandler` function, which takes an `HttpError` object and returns a `Response`. An `HttpError` object is exactly like a regular `Error` object except that it also has an HTTP status code, which should be passed as the first argument to its constructor (the second argument being the optional error message). It defaults to 500 for errors not thrown explicitly in your code.

For example:

```ts
import { HttpError, ... } from 'https://raw.githubusercontent.com/merivale/womble/v0.3.0/mod.ts'

async function router (request: Request): Promise<Response> {
  switch (request.path) {
    case '/':
      return new Response(Status.OK, 'text/plain', 'This is the home page.')

    case '/about':
      return new Response(Status.OK, 'text/plain', 'This is the about page.')
  }

  throw new HttpError(Status.NotFound, `No page found for ${request.path}.`)
  }
}

function errorHandler (httpError: HttpError): Response {
  return new Response(httpError.status, 'text/plain', `The following error occured: ${httpError.message}.`)
}

const womble = new App(router, errorHandler)
```

## 5. The `Request` object

Deno's http library passes a `ServerRequest` object to your handlers. Womble converts this into a slightly different `Request` object. The differences are that Womble's `Request` object doesn't have the `respond` method (you should return your `Response` instead), and that it has just a few extra things to make life a bit easier. Namely, the `url` property is split (at the first `?`) into `path` (before the `?`) and `query` (after the `?`) properties. If there is no `?` in the URL, the `query` property will be `undefined`. If there is a `?`, you can also access the query as a `URLSearchParams` object, via the `searchParams` property.

Finally, there are three asynchronous functions added for reading the body of a request: `getTextBody`, `getFormBody`, and `getJsonBody`. The first returns the body (if any) as text, the second returns the body as a `URLSearchParams` object, and the third parses the body as JSON, and returns the resulting object. `getFormBody` and `getJsonBody` take an optional `validate` argument (which defaults to `false`); if set to `true`, these functions will throw a `Status.BadRequest` error if the body cannot be parsed appropriately.

For use in testing your applications, Womble also provides a function for creating your own requests. Feed it a method, a url, and an optional `options` object. The latter can contain a request body (as a string) and some headers.

## 6. The `Response` object

The `Response` object simply consists of a `Status`, some `Headers`, and an optional `body` (either a string or a `Uint8Array`). Construct it with a status, a content type, and a body:

```ts
const reponse = new Response(Status.OK, 'text/plain', 'This is the body of the response')
```

You can then modify the headers with `response.headers.set(key, value)`.

Womble also gives you a few extensions of the basic response to speed things up: `OkResponse`, `HtmlResponse`, `JavascriptResponse`, and `JsonResponse`. The first only takes a content type and body in its constructor (and sets the status to `Status.OK`). The other three set the status to OK and also set the content type appropriately, so you only need to pass the body.

## 7. How do I use Womble in production?

Up to you, but in case you don't know about these things, I recommend using NGINX on a Linux server. Set up a reverse proxy in NGINX to pass requests on to whatever port you configured your app to listen on (Google can tell you how to do this). Then use `systemctl` to start the app as a service. I.e. create a `my-web-app.service` file in `/etc/systemd/system/` with the following content:

```
[Unit]
Description=My Web App
After=network.target

[Service]
Type=simple
User=yourusername
WorkingDirectory=/home/yourusername/my-web-app
ExecStart=/home/yourusername/.deno/bin/deno run --allow-read --allow-net --unstable my-web-app.ts
Restart=always

[Install]
WantedBy=multi-user.target
```

Then start it (`systemctl start my-web-app`), and enable it to start on boot (`systemctl enable my-web-app`).
