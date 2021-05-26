export type Options = {
  expires?: Date,
  maxAge?: number,
  domain?: string,
  path?: string
  secure?: boolean
  httpOnly?: boolean
  sameSite?: "Strict" | "Lax" | "None"
  unparsed?: string[]
}

export class Cookie {
  name: string
  value: string
  expires?: Date
  maxAge?: number
  domain?: string
  path?: string
  secure?: boolean
  httpOnly?: boolean
  sameSite?: "Strict" | "Lax" | "None"
  unparsed?: string[]

  constructor (name: string, value: string, options: Options) {
    this.name = name
    this.value = value
    this.expires = options.expires
    this.maxAge = options.maxAge
    this.domain = options.domain
    this.path = options.path
    this.secure = options.secure
    this.httpOnly = options.httpOnly
    this.sameSite = options.sameSite
    this.unparsed = options.unparsed
  }
}

export class UnsetCookie extends Cookie {
  constructor (name: string, options: Options) {
    super(name, "", options)
    this.expires = new Date(0)
  }
}
