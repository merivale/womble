import { ServerRequest } from "./deps.ts"
import { assert, assertEquals } from "./test_deps.ts"
import { Method, MockRequest, Request } from "./request.ts"

Deno.test({
  name: "Request",
  fn() {
    const body = "Hello"
    const serverRequest = new ServerRequest()
    serverRequest.method = "GET"
    serverRequest.url = "test?x=foo&y=bar&z=baz"
    serverRequest.headers = new Headers()
    serverRequest.headers.set("content-length", "5")
    const request = new Request(serverRequest, body)
    assert(request instanceof Request)
    assertEquals(request.method, Method.GET)
    assertEquals(request.path, "/test")
    assertEquals(request.query, "x=foo&y=bar&z=baz")
    assertEquals(request.searchParams.get("x"), "foo")
    assertEquals(request.searchParams.get("y"), "bar")
    assertEquals(request.searchParams.get("z"), "baz")
    assertEquals(request.body, "Hello")
  }
})

Deno.test({
  name: "Mock Request",
  fn() {
    const body = "Hello"
    const headers = { "content-type": "text/plain" }
    const request = new MockRequest(Method.GET, "test?x=foo&y=bar&z=baz", body, headers)
    assert(request instanceof MockRequest)
    assert(request instanceof Request)
    assertEquals(request.method, Method.GET)
    assertEquals(request.path, "/test")
    assertEquals(request.query, "x=foo&y=bar&z=baz")
    assertEquals(request.searchParams.get("x"), "foo")
    assertEquals(request.searchParams.get("y"), "bar")
    assertEquals(request.searchParams.get("z"), "baz")
    assertEquals(request.body, "Hello")
  }
})
