import { Status, readAll, serve } from "./deps.ts"
import { ContentType, ResponseHeaders } from "./headers.ts"
import { HttpError } from "./http_error.ts"
import { Request } from "./request.ts"
import { Response } from "./response.ts"

/** A request handler. */
export type Handler = (request: Request) => Response|Promise<Response>

/** An error handler. */
export type ErrorHandler = (error: HttpError) => Response|Promise<Response>

/** A simple web application framework for Deno. */
export class App {
  handler: Handler = function (request: Request): Response {
    const headers = new ResponseHeaders(ContentType.PlainText, null, {})
    return new Response(Status.OK, headers, `Womble is responding to the request for ${request.path}.`)
  }

  errorHandler: ErrorHandler = function (error: HttpError): Response {
    const headers = new ResponseHeaders(ContentType.PlainText, null, {})
    return new Response(error.status, headers, error.message)
  }

  constructor (handler?: Handler, errorHandler?: ErrorHandler) {
    if (handler) {
      this.handler = handler
    }
    if (errorHandler) {
      this.errorHandler = errorHandler
    }
  }

  /** Starts the server. */
  async listen (port: number) {
    const decoder = new TextDecoder()
    const server = serve({ port })
    console.log(`Application is listening on port ${port}...`)
    for await (const serverRequest of server) {
      try {
        const rawBody = await readAll(serverRequest.body)
        const request = new Request(serverRequest, decoder.decode(rawBody))
        serverRequest.respond(await this.handler(request))
      } catch (error) {
        if (error instanceof HttpError === false) {
          error.status = 500
        }
        serverRequest.respond(await this.errorHandler(error))
      }
    }
  }
}
