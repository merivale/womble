import { Status } from './deps.ts'
import { assertEquals, assertRejects } from './test_deps.ts'
import file from './file.ts'
import HttpError from './http_error.ts'
import { headersFromFile } from './headers.ts'

Deno.test({
  name: 'File: found',
  async fn () {
    const filePath = './README.md'
    const [body, headers] = await Promise.all([Deno.readFile(filePath), headersFromFile(filePath)])
    const expectedResponse = new Response(body, { status: Status.OK, headers })
    const actualResponse = await file(filePath)
    assertEquals(expectedResponse, actualResponse)
  }
})

Deno.test({
  name: 'File: not found',
  fn () {
    const expectedToThrow = () => file('nothing_here')
    assertRejects(expectedToThrow, HttpError, 'File not found')
  }
})
