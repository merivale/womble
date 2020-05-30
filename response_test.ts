import { assert, assertEquals } from './test_deps.ts'
import { Status } from './deps.ts'
import { Response, OkResponse, HtmlResponse, JavascriptResponse, JsonResponse } from './response.ts'

Deno.test({
  name: 'Response',
  fn() {
    const status = Status.OK
    const contentType = 'type'
    const body = 'body'
    const response = new Response(status, contentType, body)
    assertEquals(response.status, status)
    assert(response.headers instanceof Headers)
    assertEquals(response.headers.get('content-type'), contentType)
    assertEquals(response.body, body)
  }
})

Deno.test({
  name: 'OkResponse',
  fn() {
    const contentType = 'type'
    const body = 'body'
    const response = new OkResponse(contentType, body)
    assertEquals(response.status, Status.OK)
    assert(response.headers instanceof Headers)
    assertEquals(response.headers.get('content-type'), contentType)
    assertEquals(response.body, body)
  }
})

Deno.test({
  name: 'HtmlResponse',
  fn() {
    const stringBody = 'body'
    const stringableBody = { toString: () => 'body' }
    const stringResponse = new HtmlResponse(stringBody)
    const stringableResponse = new HtmlResponse(stringableBody)
    assertEquals(stringResponse.status, Status.OK)
    assert(stringResponse.headers instanceof Headers)
    assertEquals(stringResponse.headers.get('content-type'), 'text/html')
    assertEquals(stringResponse.body, stringBody)
    assertEquals(stringableResponse.body, stringableBody.toString())
  }
})

Deno.test({
  name: 'JavascriptResponse',
  fn() {
    const body = 'body'
    const response = new JavascriptResponse(body)
    assertEquals(response.status, Status.OK)
    assert(response.headers instanceof Headers)
    assertEquals(response.headers.get('content-type'), 'text/javascript')
    assertEquals(response.body, body)
  }
})

Deno.test({
  name: 'JsonResponse',
  fn() {
    const stringBody = 'body'
    const jsonBody = { foo: 'bar', baz: 12 }
    const stringResponse = new JsonResponse(stringBody)
    const stringableResponse = new JsonResponse(jsonBody)
    assertEquals(stringResponse.status, Status.OK)
    assert(stringResponse.headers instanceof Headers)
    assertEquals(stringResponse.headers.get('content-type'), 'application/json')
    assertEquals(stringResponse.body, stringBody)
    assertEquals(stringableResponse.body, JSON.stringify(jsonBody))
  }
})
