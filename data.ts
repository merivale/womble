import { Status, dirname, ensureDir, v4 } from './deps.ts'
import { ContentType, headers } from './headers.ts'
import HttpError from './http_error.ts'

/** Handles an API data request. */
export default async (path: string, request: Request): Promise<Response> => {
  const pathBits = path.split('/')
  const objectType = pathBits[0]
  const objectId = pathBits[1]
  switch (request.method) {
    case 'POST':
      if (objectId) {
        throw new HttpError(Status.NotFound, 'Invalid route.')
      } else {
        return await createObject(objectType, await request.text())
      }
    case 'GET':
      if (objectId) {
        return await readObject(objectType, objectId)
      } else {
        throw new HttpError(Status.NotFound, 'Invalid route.')
      }
    case 'PUT':
      if (objectId) {
        return await updateObject(objectType, objectId, await request.text())
      } else {
        throw new HttpError(Status.NotFound, 'Invalid route.')
      }
    case 'DELETE':
      if (objectId) {
        return await deleteObject(objectType, objectId)
      } else {
        throw new HttpError(Status.NotFound, 'Invalid route.')
      }
    default:
      throw new HttpError(Status.MethodNotAllowed, 'Method not allowed.')
  }
}

/** Handles a POST (create) API data request. */
const createObject = async (objectType: string, payload: string): Promise<Response> => {
  try {
    const object = JSON.parse(payload)
    object.id = globalThis.crypto.randomUUID()
    const path = objectPath(objectType, object.id)
    const json = JSON.stringify(object)
    await ensureDir(dirname(path))
    await Deno.writeTextFile(path, json)
    return new Response(json, { status: Status.OK, headers: headers(ContentType.JSON) })
  } catch {
    throw new HttpError(Status.BadRequest, 'Invalid JSON.')
  }
}

/** Handles a GET (read) API data request. */
const readObject = async (objectType: string, objectId: string): Promise<Response> => {
  const path = objectPath(objectType, objectId)
  try {
    const json = await Deno.readTextFile(path)
    return new Response(json, { status: Status.OK, headers: headers(ContentType.JSON) })
  } catch {
    throw new HttpError(Status.NotFound, 'Object not found.')
  }
}

/** Handles a PUT (update) API data request. */
const updateObject = async (objectType: string, objectId: string, payload: string): Promise<Response> => {
  // TODO: queue updates to avoid data being overwritten by a concurrent request
  try {
    const newData = JSON.parse(payload)
    const path = objectPath(objectType, objectId)
    try {
      const object = JSON.parse(await Deno.readTextFile(path))
      for (const key of Object.keys(newData)) {
        object[key] = newData[key]
      }
      const json = JSON.stringify(object)
      await Deno.writeTextFile(path, json)
      return new Response(json, { status: Status.OK, headers: headers(ContentType.JSON) })
    } catch {
      throw new HttpError(Status.NotFound, 'Object not found.')
    }
  } catch {
    throw new HttpError(Status.BadRequest, 'Invalid JSON.')
  }
}

/** Handles a DELETE (delete) API data request. */
const deleteObject = async (objectType: string, objectId: string): Promise<Response> => {
  const path = objectPath(objectType, objectId)
  try {
    await Deno.remove(path)
    return new Response('Object deleted.', { status: Status.OK, headers: headers(ContentType.JSON) })
  } catch {
    throw new HttpError(Status.NotFound, 'Object not found.')
  }
}

/** Gets the path of a data object. */
const objectPath = (objectType: string, objectId: string): string => {
  return `./data/${objectType}/${objectId}.json`
}
