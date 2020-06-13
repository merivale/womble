import { BufReader, encode, ServerRequest, Status } from './deps.ts'
import { HttpError } from './http_error.ts'

/** An HTTP request object, passed as the argument to route handlers. */
export class Request {
  url: string
  method: HttpMethod
  proto: string
  protoMinor: number
  protoMajor: number
  headers: Headers
  conn: Deno.Conn
  contentLength: number|undefined|null
  path: string
  query?: string
  searchParams: URLSearchParams
  body: Deno.Reader

  constructor (serverRequest: ServerRequest) {
    this.url = serverRequest.url
    this.method = serverRequest.method as HttpMethod
    this.proto = serverRequest.proto
    this.protoMinor = serverRequest.protoMinor
    this.protoMajor = serverRequest.protoMajor
    this.headers = serverRequest.headers
    this.conn = serverRequest.conn
    this.contentLength = serverRequest.contentLength
    const urlBits = serverRequest.url.split('?')
    this.path = urlBits[0]
    this.query = urlBits[1]
    if (this.path[0] !== '/') {
      this.path = `/${this.path}` // enforce leading slash
    }
    if (this.path.length > 1 && this.path[this.path.length - 1] === '/') {
      this.path = this.path.slice(0, -1) // remove trailing slash
    }
    this.searchParams = new URLSearchParams(this.query)
    this.body = serverRequest.body
  }

  async getTextBody (): Promise<string> {
    const rawBody = await Deno.readAll(this.body)
    const decoder = new TextDecoder()
    return decoder.decode(rawBody)
  }

  async getFormBody (validate: boolean = false): Promise<URLSearchParams> {
    try {
      return new URLSearchParams(await this.getTextBody())
    } catch (ignore) {
      if (validate) {
        throw new HttpError(Status.BadRequest, 'Invalid form data.')
      } else {
        return new URLSearchParams()
      }
    }
  }

  async getJsonBody (validate: boolean = false): Promise<any> {
    try {
      return JSON.parse(await this.getTextBody())
    } catch (ignore) {
      if (validate) {
        throw new HttpError(Status.BadRequest, 'Invalid JSON data.')
      } else {
        return {}
      }
    }
  }
}

/** HTTP methods. */
export type HttpMethod =
  | 'DELETE'
  | 'GET'
  | 'HEAD'
  | 'OPTIONS'
  | 'PATCH'
  | 'POST'
  | 'PUT'

/** Creates a mock HTTP request object (for testing). */
export function mockRequest (method: HttpMethod, url: string, options: any = {}): Request {
  const bodyText = options.body && typeof options.body === 'string' ? options.body : ''
  const buffer = new Deno.Buffer(encode(bodyText))
  const serverRequest = new ServerRequest()
  serverRequest.r = new BufReader(buffer)
  serverRequest.method = method
  serverRequest.url = url
  serverRequest.headers = new Headers()
  serverRequest.headers.set('content-length', bodyText.length.toString(10))
  if (options.headers && typeof options.headers === 'object') {
    for (const [header, value] of Object.entries(options.headers)) {
      if (typeof value === 'string') {
        serverRequest.headers.set(header, value)
      }
    }
  }
  return new Request(serverRequest)
}
