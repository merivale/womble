import { Status } from './deps.ts'
import { assertEquals } from './test_deps.ts'
import data from './data.ts'

Deno.test({
  name: 'API: create',
  async fn () {
    const request = new Request('http://localhost/api/create/foo', { method: 'POST', body: JSON.stringify(testObject) })
    const response = await data('foo', request)
    assertEquals(response.status, Status.OK)
  }
})

const testObject = {
  foo: 'bar',
  baz: ['array', 'of', 'strings'],
  sub: {
    number: 12345
  }
}
