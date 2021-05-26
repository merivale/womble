import { assert, assertEquals } from "./test_deps.ts"
import { Status } from "./deps.ts"
import { Response, OkResponse, HtmlResponse, JavascriptResponse, JsonResponse } from "./response.ts"
import { ContentType, ResponseHeaders } from "./headers.ts"

Deno.test({
  name: "Response",
  fn() {
    const status = Status.OK
    const headers = new ResponseHeaders(ContentType.PlainText, null, {})
    const body = "body"
    const response = new Response(status, headers, body)
    assertEquals(response.status, status)
    assert(response.headers instanceof Headers)
    assertEquals(response.headers.get("content-type"), ContentType.PlainText)
    assertEquals(response.body, body)
  }
})

Deno.test({
  name: "OkResponse",
  fn() {
    const headers = new ResponseHeaders(ContentType.PlainText, null, {})
    const body = "body"
    const response = new OkResponse(headers, body)
    assertEquals(response.status, Status.OK)
    assert(response.headers instanceof Headers)
    assertEquals(response.headers.get("content-type"), ContentType.PlainText)
    assertEquals(response.body, body)
  }
})

Deno.test({
  name: "HtmlResponse",
  fn() {
    const body = "body"
    const response = new HtmlResponse(body)
    assertEquals(response.status, Status.OK)
    assert(response.headers instanceof Headers)
    assertEquals(response.headers.get("content-type"), ContentType.HTML)
    assertEquals(response.body, body)
  }
})

Deno.test({
  name: "JavascriptResponse",
  fn() {
    const body = "body"
    const response = new JavascriptResponse(body)
    assertEquals(response.status, Status.OK)
    assert(response.headers instanceof Headers)
    assertEquals(response.headers.get("content-type"), ContentType.JavaScript)
    assertEquals(response.body, body)
  }
})

Deno.test({
  name: "JsonResponse",
  fn() {
    const stringBody = "body"
    const jsonBody = { foo: "bar", baz: 12 }
    const stringResponse = new JsonResponse(stringBody)
    const stringableResponse = new JsonResponse(jsonBody)
    assertEquals(stringResponse.status, Status.OK)
    assert(stringResponse.headers instanceof Headers)
    assertEquals(stringResponse.headers.get("content-type"), ContentType.JSON)
    assertEquals(stringResponse.body, stringBody)
    assertEquals(stringableResponse.body, JSON.stringify(jsonBody))
  }
})
