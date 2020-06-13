import { BufReader, ServerRequest, encode } from './deps.ts'
import { assert, assertEquals } from './test_deps.ts'
import { mockRequest, Request } from './request.ts'

Deno.test({
  name: 'Request',
  async fn() {
    const buffer = new Deno.Buffer(encode('Hello'))
    const serverRequest = new ServerRequest()
    serverRequest.r = new BufReader(buffer)
    serverRequest.method = 'GET'
    serverRequest.url = 'test?x=foo&y=bar&z=baz'
    serverRequest.headers = new Headers()
    serverRequest.headers.set('content-length', '5')
    const request = new Request(serverRequest)
    assert(request instanceof Request)
    assertEquals(request.method, 'GET')
    assertEquals(request.path, '/test')
    assertEquals(request.query, 'x=foo&y=bar&z=baz')
    assertEquals(request.searchParams.get('x'), 'foo')
    assertEquals(request.searchParams.get('y'), 'bar')
    assertEquals(request.searchParams.get('z'), 'baz')
    assertEquals(await request.getTextBody(), 'Hello')
  }
})

Deno.test({
  name: 'Mock Request',
  async fn() {
    const options = { headers: { 'content-type': 'text/plain' }, body: 'Hello' }
    const request = mockRequest('GET', 'test?x=foo&y=bar&z=baz', options)
    assert(request instanceof Request)
    assertEquals(request.method, 'GET')
    assertEquals(request.path, '/test')
    assertEquals(request.query, 'x=foo&y=bar&z=baz')
    assertEquals(request.searchParams.get('x'), 'foo')
    assertEquals(request.searchParams.get('y'), 'bar')
    assertEquals(request.searchParams.get('z'), 'baz')
    assertEquals(await request.getTextBody(), 'Hello')
  }
})
