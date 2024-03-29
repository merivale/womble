import type { Status } from './deps.ts'

/** An HTTP Error object. */
export default class HttpError extends Error {
  status: Status
    
  constructor (status: Status, message: string) {
    super(message)
    this.status = status
  }
}
