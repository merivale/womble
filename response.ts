import { Status } from './deps.ts'

/** A generic HTTP response. */
export class Response {
  status: Status
  headers: Headers
  body?: string|Uint8Array

  constructor (status: Status, contentType: string, body?: any) {
    this.status = status
    this.headers = new Headers()
    this.headers.set('content-type', contentType)
    this.body = body
  }
}

/** An OK (200) HTTP response. */
export class OkResponse extends Response {
  constructor(contentType: string, body?: any) {
    super(Status.OK, contentType, body)
  }
}

/** An OK HTTP response with an HTML body. */
export class HtmlResponse extends OkResponse {
  constructor (body?: any) {
    if (body && typeof body !== 'string' && body.toString && typeof body.toString === 'function') {
      super('text/html', body.toString())
    } else {
      super('text/html', body)
    }
  }
}

/** An OK HTTP response with a JavaScript body. */
export class JavascriptResponse extends OkResponse {
  constructor (body?: string) {
    super('text/javascript', body)
  }
}

/** An OK HTTP response with a JSON body. */
export class JsonResponse extends OkResponse {
  constructor (body?: any) {
    if (body && typeof body !== 'string') {
      super('application/json', JSON.stringify(body))
    } else {
      super('application/json', body)
    }
  }
}
