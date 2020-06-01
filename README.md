# Womble

A simple web application framework for [Deno](https://deno.land).

## 1. Basic usage

```ts
import {
  App,
  Request,
  Response,
  Status
} from 'https://raw.githubusercontent.com/merivale/womble/v0.1.0/mod.ts'

const app = new App()

function home (request: Request): Response {
  return new Response(Status.OK, 'text/plain', 'Hello Womble.')
}

app.route('GET', '/', home)
app.listen(3000)
```

Set up routes with `app.route`. The first argument is the HTTP method, the second argument is the path to match, and the third argument is the handler. The handler is a function that takes a `Request` object as its only argument, and returns a `Response` object (details about these objects below). The path is a string, but it is used to create a regular expression, so you can match paths of arbitrary complexity. If a request path matches more than one of the regular expressions you feed into the router, the handler associated with the _last_ one you fed in will be called.

## 2. Differences from other frameworks

There are a couple of notable things you can't do with Womble, at least not in the way you might be used to from other frameworks. First, you can't put curly brackets (or whatever) around bits of the path, and have those passed directly to your handler as route parameters. Second, you can't use middleware.

These things are by design. Handlers in Womble are (intended to be) pure functions from a request to a response. They don't know which requests the router is going to throw their way, they expect an unmodified request argument, and they must return a complete response. I find this makes code easier to read, maintain, and test.

You can achieve anything you might have done with route parameters and middleware by piping different functions together to create your handlers. For example:

```ts
import {
  App,
  Request,
  Response,
  Status
} from 'https://raw.githubusercontent.com/merivale/womble/v0.1.0/mod.ts'

const app = new App()
app.route('GET', '/data/\\d+', getId |> getData |> renderData)
app.listen(3000)

function getId (request: Request): number {
  const id = parseInt(request.path.split('/')[2])
  if (id === NaN) {
    throw new HttpError(Status.BadRequest, 'Bad request.')
  }
  return id
}

function getData (id: number): any {
  const data = query(id) // do whatever database/file lookup you need here
  if (!data) {
    throw new HttpError(Status.NotFound, 'Data not found.')
  }
  return data
}

function renderData (data: any): Response {
  return new Response(Status.OK, 'application/json', JSON.stringify(data))
}
```

The snag is that the proposed pipe operator `|>` hasn't been implemented yet. In the meantime, you have to do this:

```ts
app.route('GET', '/data/\\d+', complexHandler)

function complexHandler (request) {
  return renderData(getData(getId(request)))
}
```

Or, more concisely:

```ts
app.route('GET', '/data/\\d+', (request) => renderData(getData(getId(request))))
```

Or, to make the above look a bit nicer, you can import Womble's `pipe` function:

```ts
import {
  ...,
  pipe
} from 'https://raw.githubusercontent.com/merivale/womble/v0.1.0/mod.ts'

...

app.route('GET', '/article/\\d+', pipe(articleId, article, render))
```

## 3. Error handling

Handlers can throw errors (intentionally or otherwise). These will be caught by Womble, which will send a suitable response. You can customize this response by feeding your own error handler into the `app.error` function. Your error handler should be a function that takes an `HttpError` object and returns a `Response`. An `HttpError` object is exactly like a regular `Error` object except that it also has an HTTP status code, which should be passed as the first argument to its constructor (the second argument being the optional error message). It defaults to 500 for errors not thrown explicitly in your code.

## 4. Serving files

You can serve files with `Deno.readFile`. E.g.:

```ts
async function favicon (request: Request): Promise<Response> {
  const buffer = await Deno.readFile('favicon.ico')
  return new Response(Status.OK, 'image/ico', buffer)
}

app.route('GET', '/favicon.ico', favicon)
```

## 5. The `Request` object

Notes to follow soon.

## 6. The `Response` object

Notes to follow soon.

## 7. How do I use it in production?

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
