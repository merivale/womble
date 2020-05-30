import { assertEquals } from './test_deps.ts'
import * as mod from './mod.ts'

Deno.test({
  name: 'mod',
  fn() {
    assertEquals(typeof mod.App, 'function')
    assertEquals(typeof mod.HttpError, 'function')
    assertEquals(typeof mod.Request, 'function')
    assertEquals(typeof mod.Response, 'function')
    assertEquals(typeof mod.OkResponse, 'function')
    assertEquals(typeof mod.HtmlResponse, 'function')
    assertEquals(typeof mod.JavascriptResponse, 'function')
    assertEquals(typeof mod.JsonResponse, 'function')
    assertEquals(typeof mod.Status, 'object')
  }
})
