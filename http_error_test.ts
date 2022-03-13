import { assert, assertEquals } from './test_deps.ts'
import { Status } from './deps.ts'
import HttpError from './http_error.ts'

Deno.test({
  name: 'HttpError',
  fn() {
    const status = Status.NotFound
    const message = 'Page not found'
    const httpError = new HttpError(status, message)
    assert(httpError instanceof Error)
    assertEquals(httpError.status, status)
    assertEquals(httpError.message, message)
  }
})
