import { serve, Status } from './deps.ts'
import { HttpError } from './http_error.ts'
import { Request } from './request.ts'
import { Response } from './response.ts'

/** A request handler. */
export type Handler = (request: Request) => Response|Promise<Response>

/** An error handler. */
export type ErrorHandler = (error: HttpError) => Response|Promise<Response>

/** A simple web application framework for Deno. */
export class App {
  handler: Handler = function (request: Request): Response {
    return new Response(Status.OK, 'text/plain', `Womble is responding to the request for ${request.path}.`)
  }

  errorHandler: ErrorHandler = function (error: HttpError): Response {
    return new Response(error.status, 'text/plain', error.message)
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
    const server = serve({ port })
    console.log(`Application is listening on port ${port}...`)
    for await (const serverRequest of server) {
      try {
        const request = new Request(serverRequest)
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
