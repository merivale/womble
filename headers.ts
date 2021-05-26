import { Cookie, setCookie } from "./deps.ts"

export class ResponseHeaders extends Headers {
  constructor (contentType: ContentType, cookie: Cookie|null, other: Record<string, string>) {
    super()
    this.set("content-type", contentType)
    for (const key of Object.keys(other)) {
      this.set(key, other[key])
    }
    if (cookie) {
      const dummyResponse = { headers: new Headers() }
      setCookie(dummyResponse, cookie)
      const cookieString = dummyResponse.headers.get("Set-Cookie")
      if (cookieString) {
        this.set("Set-Cookie", cookieString)
      }
    }
  }
}

export enum ContentType {
  PlainText = "text/plain",
  HTML = "text/html",
  JavaScript = "text/javascript",
  JSON = "application/json",
  CSS = "text/css",
  Markdown = "text/markdown",
  SVG = "image/svg+xml"
}

export function contentTypeFromExt (ext: string): ContentType|null {
  switch (ext) {
    case ".css":
      return ContentType.CSS
    case ".htm": // fallthrough
    case ".html":
      return ContentType.HTML
    case ".md":
      return ContentType.Markdown
    case ".txt":
      return ContentType.PlainText
    case ".js":
      return ContentType.JavaScript
    case ".json":
      return ContentType.JSON
    case ".svg":
      return ContentType.SVG
    default:
      return null
  }
}
