import { assert, assertEquals } from "./test_deps.ts"
import { Status } from "./deps.ts"
import { App } from "./app.ts"
import { HttpError } from "./http_error.ts"
import { Method, MockRequest, Request } from "./request.ts"
import { Response } from "./response.ts"

Deno.test({
  name: "App",
  fn() {
    const app = new App()
    assert(app instanceof App)
    assert(typeof app.handler, "function")
    assert(typeof app.errorHandler, "function")
    assert(typeof app.listen, "function")
  }
})

Deno.test({
  name: "App.handler",
  async fn() {
    const app = new App()
    const request = new MockRequest(Method.GET, "/")
    const response = await app.handler(request as unknown as Request)
    assert(response instanceof Response)
    assertEquals(response.status, Status.OK)
    assertEquals(response.headers.get("content-type"), "text/plain")
    assertEquals(response.body, `Womble is responding to the request for ${request.path}.`)
  }
})

Deno.test({
  name: "App.errorHandler",
  async fn() {
    const app = new App()
    const httpError = new HttpError(Status.NotFound, "Page not found.")
    const response = await app.errorHandler(httpError)
    assert(response instanceof Response)
    assertEquals(response.status, Status.NotFound)
    assertEquals(response.headers.get("content-type"), "text/plain")
    assertEquals(response.body, "Page not found.")
  }
})
