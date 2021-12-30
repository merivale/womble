import { Status, dirname, ensureDir, exists, getCookies, v4 } from './deps.ts'
import { ContentType, headers, headersWithSetCookie, headersWithUnsetCookie } from './headers.ts'
import HttpError from './http_error.ts'

/** Handles an API user request */
export default async (path: string, request: Request): Promise<Response> => {
  const pathBits = path.split('/')
  const action = pathBits[0]
  const username = pathBits[1]
  switch (request.method) {
    case 'GET':
      switch (path) {
        case 'login':
          return await login(await request.text())
        case 'logout':
          return await logout(getCookies(request.headers))
      }
      break
    case 'POST':
      switch (action) {
        case 'create':
          if (username) {
            throw new HttpError(Status.NotFound, 'Invalid route.')
          } else {
            return await createUser(await request.text())
          }
        case 'delete':
          if (username) {
            return await deleteUser(username)
          } else {
            throw new HttpError(Status.NotFound, 'Invalid route.')
          }
      }
      break
  }
  throw new HttpError(Status.NotFound, 'Invalid route.')
}

/** Handles a create user request. */
const createUser = async (payload: string): Promise<Response> => {
  try {
    const { username, password } = JSON.parse(payload)
    const path = userPath(username)
    const user = { username, password } // TODO: encode password
    const json = JSON.stringify(user)
    await ensureDir(dirname(path))
    await Deno.writeTextFile(path, json)
    return new Response(JSON.stringify({ 'success': 'User created.' }), { status: Status.OK, headers: headers(ContentType.JSON) })
  } catch (_) {
    throw new HttpError(Status.BadRequest, 'Invalid JSON.')
  }
}

/** Handles a delete user request. */
const deleteUser = async (username: string): Promise<Response> => {
  const path = userPath(username)
  if (await exists(path)) {
    await Deno.remove(path)
    return new Response(JSON.stringify({ 'success': 'User deleted.' }), { status: Status.OK, headers: headers(ContentType.JSON) })
  }
  throw new HttpError(Status.NotFound, 'Object not found.')
}

/** Handles a login request. */
const login = async (payload: string): Promise<Response> => {
  try {
    const { username, password } = JSON.parse(payload)
    const path = userPath(username)
    if (await exists(path)) {
      const storedPassword = await Deno.readTextFile(path)
      if (storedPassword === password) {
        const sessionId = v4.generate()
        const path = sessionPath(sessionId)
        await ensureDir(dirname(path))
        await Deno.writeTextFile(path, username)    
        const expires = new Date()
        expires.setDate(expires.getDate() + 1)
        const cookie = { name: 'session_id', value: sessionId, expires }
        return new Response(JSON.stringify({ 'success': 'Logged in.' }), { status: Status.OK, headers: headersWithSetCookie(cookie, ContentType.JSON) })
      }
      throw new HttpError(Status.OK, 'Incorrect password.')
    } else {
      throw new HttpError(Status.OK, 'Username not found.')
    }
  } catch (_) {
    throw new HttpError(Status.BadRequest, 'Invalid JSON.')
  }
}

/** Handles a logout request. */
const logout = async (cookies: Record<string, string>): Promise<Response> => {
  const sessionId = cookies['session_id']
  const path = sessionPath(sessionId)
  if (await exists(path)) {
    await Deno.remove(path)
  }
  return new Response(JSON.stringify({ 'success': 'Logged out.' }), { status: Status.OK, headers: headersWithUnsetCookie('session_id', ContentType.JSON) })
}

/** Gets the path of a user. */
const userPath = (username: string): string => {
  return `./user/${username}.json`
}

/** Gets the path of a session. */
const sessionPath = (sessionId: string): string => {
  return `./session/${sessionId}.json`
}
