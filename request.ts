import { Buffer, BufReader, ServerRequest, getCookies } from "./deps.ts"

/** An HTTP request object, passed as the argument to route handlers. */
export class Request {
  url: string
  method: Method
  proto: string
  protoMinor: number
  protoMajor: number
  headers: Headers
  conn: Deno.Conn
  contentLength: number|undefined|null
  path: string
  query?: string
  searchParams: URLSearchParams
  cookies: Record<string, string>
  body: string

  constructor (serverRequest: ServerRequest, body: string) {
    this.url = serverRequest.url
    switch (serverRequest.method) {
      case "DELETE": this.method = Method.DELETE
        break
      case "HEAD": this.method = Method.HEAD
        break
      case "OPTIONS": this.method = Method.OPTIONS
        break
      case "PATCH": this.method = Method.PATCH
        break
      case "POST": this.method = Method.POST
        break
      case "PUT": this.method = Method.PUT
        break
      default: this.method = Method.GET
        break
    }
    this.proto = serverRequest.proto
    this.protoMinor = serverRequest.protoMinor
    this.protoMajor = serverRequest.protoMajor
    this.headers = serverRequest.headers
    this.conn = serverRequest.conn
    this.contentLength = serverRequest.contentLength
    const urlBits = serverRequest.url.split("?")
    this.path = urlBits[0]
    this.query = urlBits[1]
    if (this.path[0] !== "/") {
      this.path = `/${this.path}` // enforce leading slash
    }
    if (this.path.length > 1 && this.path[this.path.length - 1] === "/") {
      this.path = this.path.slice(0, -1) // remove trailing slash
    }
    this.searchParams = new URLSearchParams(this.query)
    this.cookies = getCookies(serverRequest)
    this.body = body
  }
}

/** HTTP methods. */
export enum Method {
  DELETE = "DELETE",
  GET = "GET",
  HEAD = "HEAD",
  OPTIONS = "OPTIONS",
  PATCH = "PATCH",
  POST = "POST",
  PUT = "PUT"
}

/** Creates a mock HTTP request object (for testing). */
export class MockRequest extends Request {
  constructor (method: Method, url: string, body: string = "", headers: Record<string, string> = {}) {
    const buffer = new Buffer(new TextEncoder().encode(body))
    const serverRequest = new ServerRequest()
    serverRequest.r = new BufReader(buffer)
    serverRequest.method = method
    serverRequest.url = url
    serverRequest.headers = new Headers()
    serverRequest.headers.set("content-length", body.length.toString(10))
    for (const [header, value] of Object.entries(headers)) {
      serverRequest.headers.set(header, value)
    }
    super(serverRequest, body)
  }
}
