import { Cookie, extname, setCookie, deleteCookie } from './deps.ts'

/** Creates a minimal set of headers with an optional contentType. */
export const headers = (contentType?: string): Headers => {
  const h = new Headers()
  h.set('date', new Date().toUTCString())
  if (contentType) {
    h.set('content-type', contentType)
  }
  return h
}

/** Creates headers based on a file. */
export const headersFromFile = async (filePath: string): Promise<Headers> => {
  const fileInfo = await Deno.stat(filePath)
  const h = headers(contentType(filePath))
  h.set('content-length', fileInfo.size.toString())
  if (fileInfo.atime instanceof Date) {
    const date = new Date(fileInfo.atime)
    h.set('date', date.toUTCString())
  }
  if (fileInfo.mtime instanceof Date) {
    const lastModified = new Date(fileInfo.mtime)
    h.set('last-modified', lastModified.toUTCString())
  }
  return h
}

/** Creates headers with a set-cookie. */
export const headersWithSetCookie = (cookie: Cookie, contentType?: ContentType): Headers => {
  const h = headers(contentType)
  setCookie(h, cookie)
  return h
}

/** Creates headers with an unset-cookie. */
export const headersWithUnsetCookie = (cookieName: string, contentType?: ContentType): Headers => {
  const h = headers(contentType)
  deleteCookie(h, cookieName)
  return h
}

/** Returns the content-type based on the extension of a path. */
export const contentType = (filePath: string): string | undefined => {
  return MEDIA_TYPES[extname(filePath)]
}

/** Enum of common text-based media types likely to be created on the fly. */
export enum ContentType {
  JSON = 'application/json',
  JavaScript = 'application/javascript',
  TypeScript = 'text/typescript',
  ReactJS = 'text/jsx',
  ReactTS = 'text/tsx',
  Node = 'application/node',
  CSS = 'text/css',
  HTML = 'text/html',
  Markdown = 'text/markdown',
  Text = 'text/plain',
  XML = 'application/xml',
  YAML = 'text/yaml',
}

/** Record of common filename extensions with their corresponding media types. */
export const MEDIA_TYPES: Record<string, string> = {
  '.md': ContentType.Markdown,
  '.html': ContentType.HTML,
  '.htm': ContentType.HTML,
  '.json': ContentType.JSON,
  '.map': ContentType.JSON,
  '.txt': ContentType.Text,
  '.ts': ContentType.TypeScript,
  '.tsx': ContentType.ReactTS,
  '.js': ContentType.JavaScript,
  '.jsx': ContentType.ReactJS,
  '.gz': 'application/gzip',
  '.css': ContentType.CSS,
  '.wasm': 'application/wasm',
  '.mjs': ContentType.JavaScript,
  '.otf': 'font/otf',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.conf': ContentType.Text,
  '.list': ContentType.Text,
  '.log': ContentType.Text,
  '.ini': ContentType.Text,
  '.vtt': 'text/vtt',
  '.yaml': ContentType.YAML,
  '.yml': ContentType.YAML,
  '.mid': 'audio/midi',
  '.midi': 'audio/midi',
  '.mp3': 'audio/mp3',
  '.mp4a': 'audio/mp4',
  '.m4a': 'audio/mp4',
  '.ogg': 'audio/ogg',
  '.spx': 'audio/ogg',
  '.opus': 'audio/ogg',
  '.wav': 'audio/wav',
  '.webm': 'audio/webm',
  '.aac': 'audio/x-aac',
  '.flac': 'audio/x-flac',
  '.mp4': 'video/mp4',
  '.mp4v': 'video/mp4',
  '.mkv': 'video/x-matroska',
  '.mov': 'video/quicktime',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.bmp': 'image/bmp',
  '.gif': 'image/gif',
  '.heic': 'image/heic',
  '.heif': 'image/heif',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.tiff': 'image/tiff',
  '.psd': 'image/vnd.adobe.photoshop',
  '.ico': 'image/vnd.microsoft.icon',
  '.webp': 'image/webp',
  '.es': 'application/ecmascript',
  '.epub': 'application/epub+zip',
  '.jar': 'application/java-archive',
  '.war': 'application/java-archive',
  '.webmanifest': 'application/manifest+json',
  '.doc': 'application/msword',
  '.dot': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.dotx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
  '.cjs': ContentType.Node,
  '.bin': 'application/octet-stream',
  '.pkg': 'application/octet-stream',
  '.dump': 'application/octet-stream',
  '.exe': 'application/octet-stream',
  '.deploy': 'application/octet-stream',
  '.img': 'application/octet-stream',
  '.msi': 'application/octet-stream',
  '.pdf': 'application/pdf',
  '.pgp': 'application/pgp-encrypted',
  '.asc': 'application/pgp-signature',
  '.sig': 'application/pgp-signature',
  '.ai': 'application/postscript',
  '.eps': 'application/postscript',
  '.ps': 'application/postscript',
  '.rdf': 'application/rdf+xml',
  '.rss': 'application/rss+xml',
  '.rtf': 'application/rtf',
  '.apk': 'application/vnd.android.package-archive',
  '.key': 'application/vnd.apple.keynote',
  '.numbers': 'application/vnd.apple.keynote',
  '.pages': 'application/vnd.apple.pages',
  '.geo': 'application/vnd.dynageo',
  '.gdoc': 'application/vnd.google-apps.document',
  '.gslides': 'application/vnd.google-apps.presentation',
  '.gsheet': 'application/vnd.google-apps.spreadsheet',
  '.kml': 'application/vnd.google-earth.kml+xml',
  '.mkz': 'application/vnd.google-earth.kmz',
  '.icc': 'application/vnd.iccprofile',
  '.icm': 'application/vnd.iccprofile',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.xlm': 'application/vnd.ms-excel',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.pot': 'application/vnd.ms-powerpoint',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.potx': 'application/vnd.openxmlformats-officedocument.presentationml.template',
  '.xps': 'application/vnd.ms-xpsdocument',
  '.odc': 'application/vnd.oasis.opendocument.chart',
  '.odb': 'application/vnd.oasis.opendocument.database',
  '.odf': 'application/vnd.oasis.opendocument.formula',
  '.odg': 'application/vnd.oasis.opendocument.graphics',
  '.odp': 'application/vnd.oasis.opendocument.presentation',
  '.ods': 'application/vnd.oasis.opendocument.spreadsheet',
  '.odt': 'application/vnd.oasis.opendocument.text',
  '.rar': 'application/vnd.rar',
  '.unityweb': 'application/vnd.unity',
  '.dmg': 'application/x-apple-diskimage',
  '.bz': 'application/x-bzip',
  '.crx': 'application/x-chrome-extension',
  '.deb': 'application/x-debian-package',
  '.php': 'application/x-httpd-php',
  '.iso': 'application/x-iso9660-image',
  '.sh': 'application/x-sh',
  '.sql': 'application/x-sql',
  '.srt': 'application/x-subrip',
  '.xml': ContentType.XML,
  '.zip': 'application/zip',
}
