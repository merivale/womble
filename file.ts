import { Status, exists } from './deps.ts'
import HttpError from './http_error.ts'
import { headersFromFile } from './headers.ts'

/** Given the path to a file, returns a response containing that file. */
export default async (filePath: string): Promise<Response> => {
  if (await exists(filePath)) {
    const [body, headers] = await Promise.all([Deno.readFile(filePath), headersFromFile(filePath)])
    return new Response(body, { status: Status.OK, headers })
  } else {
    throw new HttpError(Status.NotFound, 'File not found.')
  }
}
