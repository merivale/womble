import { ServerRequest } from './deps.ts'
import { assertEquals } from './test_deps.ts'
import { Request } from './request.ts'

Deno.test({
  name: 'Request',
  fn() {
    const serverRequest = new ServerRequest()
    serverRequest.method = 'GET'
    serverRequest.url = 'test?x=foo&y=bar&z=baz'
    const request = new Request(serverRequest)
    assertEquals(request.method, 'GET')
    assertEquals(request.path, '/test')
    assertEquals(request.query, 'x=foo&y=bar&z=baz')
    assertEquals(request.searchParams.get('x'), 'foo')
    assertEquals(request.searchParams.get('y'), 'bar')
    assertEquals(request.searchParams.get('z'), 'baz')
  }
})
