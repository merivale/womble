import { assert, assertEquals } from "./test_deps.ts"
import { setCookie } from "./deps.ts"
import { Cookie } from "./cookie.ts"
import { ContentType, ResponseHeaders, contentTypeFromExt } from "./headers.ts"

Deno.test({
  name: "ResponseHeaders",
  fn() {
    const contentType = ContentType.PlainText
    const cookie = new Cookie("cookie-name", "cookie-value", {})
    const dummyResponse = { headers: new Headers() }
    setCookie(dummyResponse, cookie)
    const cookieString = dummyResponse.headers.get("Set-Cookie")
    const other = { "foo": "bar" }
    const headers = new ResponseHeaders(contentType, cookie, other)
    assert(headers instanceof ResponseHeaders)
    assertEquals(headers.get("content-type"), contentType)
    assertEquals(headers.get("Set-Cookie"), cookieString)
    assertEquals(headers.get("foo"), "bar")
  }
})

Deno.test({
  name: "contentTypeFromExt",
  fn() {
    assertEquals(contentTypeFromExt(".css"), "text/css")
    assertEquals(contentTypeFromExt(".htm"), "text/html")
    assertEquals(contentTypeFromExt(".html"), "text/html")
    assertEquals(contentTypeFromExt(".md"), "text/markdown")
    assertEquals(contentTypeFromExt(".txt"), "text/plain")
    assertEquals(contentTypeFromExt(".js"), "text/javascript")
    assertEquals(contentTypeFromExt(".json"), "application/json")
    assertEquals(contentTypeFromExt(".svg"), "image/svg+xml")
  }
})
