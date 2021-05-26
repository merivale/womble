import { Status, extname } from "./deps.ts"
import { ContentType, ResponseHeaders, contentTypeFromExt } from "./headers.ts"

/** A generic HTTP response. */
export class Response {
  status: Status
  headers: Headers
  body?: Uint8Array|Deno.Reader|string

  constructor (status: Status, headers: ResponseHeaders, body?: Uint8Array|Deno.Reader|string) {
    this.status = status
    this.headers = headers
    this.body = body
  }
}

/** An OK (200) HTTP response. */
export class OkResponse extends Response {
  constructor(headers: ResponseHeaders, body?: Uint8Array|Deno.Reader|string) {
    super(Status.OK, headers, body)
  }
}

/** An OK HTTP response with an HTML body. */
export class HtmlResponse extends OkResponse {
  constructor (body: Uint8Array|Deno.Reader|string) {
    super(new ResponseHeaders(ContentType.HTML, null, {}), body)
  }
}

/** An OK HTTP response with a JavaScript body. */
export class JavascriptResponse extends OkResponse {
  constructor (body: Uint8Array|Deno.Reader|string) {
    super(new ResponseHeaders(ContentType.JavaScript, null, {}), body)
  }
}

/** An OK HTTP response with a JSON body. */
export class JsonResponse extends OkResponse {
  constructor (body: string|Record<string, unknown>) {
    super(new ResponseHeaders(ContentType.JSON, null, {}))
    this.body = typeof body === "string" ? body : JSON.stringify(body)
  }
}

/** An OK HTTP response from a file. */
export class FileResponse extends OkResponse {
  constructor (path: string, fileInfo: Deno.FileInfo, body: Uint8Array|Deno.Reader) {
    super(new ResponseHeaders(contentTypeFromExt(extname(path)) || ContentType.PlainText, null, {}), body)
    this.headers.set("content-length", fileInfo.size.toString())
  }
}
