import { assert, assertEquals } from "./test_deps.ts"
import { Cookie, Options, UnsetCookie } from "./cookie.ts"

Deno.test({
  name: "Cookie",
  fn() {
    const options: Options = {
      expires: new Date(),
      maxAge: 10,
      domain: "domain",
      path: "path",
      secure: false,
      httpOnly: false,
      sameSite: "Strict",
      unparsed: ["foo"]
    }
    const cookie = new Cookie("name", "value", options)
    assert(cookie instanceof Cookie)
    assertEquals(cookie.name, "name")
    assertEquals(cookie.value, "value")
    assertEquals(cookie.expires, options.expires)
    assertEquals(cookie.maxAge, options.maxAge)
    assertEquals(cookie.domain, options.domain)
    assertEquals(cookie.path, options.path)
    assertEquals(cookie.secure, options.secure)
    assertEquals(cookie.httpOnly, options.httpOnly)
    assertEquals(cookie.sameSite, options.sameSite)
    assertEquals(cookie.unparsed, options.unparsed)
  }
})

Deno.test({
  name: "UnsetCookie",
  fn() {
    const cookie = new UnsetCookie("name", {})
    assert(cookie instanceof Cookie)
    assertEquals(cookie.name, "name")
    assertEquals(cookie.value, "")
    assertEquals(cookie.expires, new Date(0))
  }
})
