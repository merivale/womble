# Womble

## What is it?

Womble is a very basic web application framework for [Deno](https://deno.land). It so basic that I hesitate to call it a framework. It is about the least you might need to get a web site up and running.

## Why would I use it?

If you only need something really basic. Otherwise you'd probably prefer [Oak](https://deno.land/x/oak) or [Pogo](https://deno.land/x/pogo).

## How do I use it?

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

The second argument to `app.route` - the path to match - is converted to a regular expression, so you can include wildcards etc. to match multiple paths. But you won't get any paramaters out of it automatically; you'll have to look for them yourself in the handler, via `request.path`.

Add you own custom error handler with `app.error`. Its argument should be a function that takes an `Error` or `HttpError` objects and returns a `Response`.

Serve files with `Deno.readFile`. E.g.:

```ts
async function favicon (request: Request): Promise<Response> {
  const buffer = await Deno.readFile('favicon.ico')
  return new Response(Status.OK, 'image/ico', buffer)
}

app.route('GET', '/favicon.ico', favicon)
```

## How do I use it in production?

Up to you, but in case you don't know about these things, I recommend using nginx on a Linux/Unix system. Set up a reverse proxy in nginx to pass requests on to whatever port you configured your app to listen on (Google can tell you how). Then use systemctl to start the app as a service. I.e. create a `my-web-app.service` file in `/etc/systemd/system/` with the following content:

```toml
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
