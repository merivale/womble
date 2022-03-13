import { deleteCookie, setCookie } from './deps.ts'
import { assertEquals } from './test_deps.ts'
import { ContentType, contentType, headers, headersFromFile, headersWithSetCookie, headersWithUnsetCookie } from './headers.ts'

Deno.test({
  name: 'Headers: headers',
  fn () {
    const date1 = new Date()
    const actualHeaders1 = headers()
    const expectedHeaders1 = new Headers()
    expectedHeaders1.set('date', date1.toUTCString())
    assertEquals(actualHeaders1, expectedHeaders1)
    const contentType = 'test-content-type'
    const date2 = new Date()
    const actualHeaders2 = headers(contentType)
    const expectedHeaders2 = new Headers()
    expectedHeaders2.set('date', date2.toUTCString())
    expectedHeaders2.set('content-type', contentType)
    assertEquals(actualHeaders2, expectedHeaders2)
  }
})

Deno.test({
  name: 'Headers: headersFromFile',
  async fn () {
    const filePath = './test_data/file.html'
    const actualHeaders = await headersFromFile(filePath)
    const fileInfo = await Deno.stat(filePath)
    const expectedHeaders = headers(contentType(filePath))
    expectedHeaders.set('content-length', fileInfo.size.toString())
    if (fileInfo.atime instanceof Date) {
      const date = new Date(fileInfo.atime)
      expectedHeaders.set('date', date.toUTCString())
    }
    if (fileInfo.mtime instanceof Date) {
      const lastModified = new Date(fileInfo.mtime)
      expectedHeaders.set('last-modified', lastModified.toUTCString())
    }
    assertEquals(actualHeaders, expectedHeaders)
  }
})

Deno.test({
  name: 'Headers: headersWithSetCookie',
  fn () {
    const cookie = {
      name: 'cookie',
      value: 'tasty'
    }
    const actualHeaders = headersWithSetCookie(cookie)
    const expectedHeaders = headers()
    setCookie(expectedHeaders, cookie)
    assertEquals(actualHeaders, expectedHeaders)
  }
})

Deno.test({
  name: 'Headers: headersWithUnsetCookie',
  fn () {
    const cookieName = 'cookie'
    const actualHeaders = headersWithUnsetCookie(cookieName)
    const expectedHeaders = headers()
    deleteCookie(expectedHeaders, cookieName)
    assertEquals(actualHeaders, expectedHeaders)
  }
})

Deno.test({
  name: 'Headers: contentType',
  fn () {
    assertEquals(contentType('file.md'), ContentType.Markdown)
    assertEquals(contentType('file.html'), ContentType.HTML)
    assertEquals(contentType('file.htm'), ContentType.HTML)
    assertEquals(contentType('file.json'), ContentType.JSON)
    assertEquals(contentType('file.map'), ContentType.JSON)
    assertEquals(contentType('file.txt'), ContentType.Text)
    assertEquals(contentType('file.ts'), ContentType.TypeScript)
    assertEquals(contentType('file.tsx'), ContentType.ReactTS)
    assertEquals(contentType('file.js'), ContentType.JavaScript)
    assertEquals(contentType('file.jsx'), ContentType.ReactJS)
    assertEquals(contentType('file.gz'), 'application/gzip')
    assertEquals(contentType('file.css'), ContentType.CSS)
    assertEquals(contentType('file.wasm'), 'application/wasm')
    assertEquals(contentType('file.mjs'), ContentType.JavaScript)
    assertEquals(contentType('file.otf'), 'font/otf')
    assertEquals(contentType('file.ttf'), 'font/ttf')
    assertEquals(contentType('file.woff'), 'font/woff')
    assertEquals(contentType('file.woff2'), 'font/woff2')
    assertEquals(contentType('file.conf'), ContentType.Text)
    assertEquals(contentType('file.list'), ContentType.Text)
    assertEquals(contentType('file.log'), ContentType.Text)
    assertEquals(contentType('file.ini'), ContentType.Text)
    assertEquals(contentType('file.vtt'), 'text/vtt')
    assertEquals(contentType('file.yaml'), ContentType.YAML)
    assertEquals(contentType('file.yml'), ContentType.YAML)
    assertEquals(contentType('file.mid'), 'audio/midi')
    assertEquals(contentType('file.midi'), 'audio/midi')
    assertEquals(contentType('file.mp3'), 'audio/mp3')
    assertEquals(contentType('file.mp4a'), 'audio/mp4')
    assertEquals(contentType('file.m4a'), 'audio/mp4')
    assertEquals(contentType('file.ogg'), 'audio/ogg')
    assertEquals(contentType('file.spx'), 'audio/ogg')
    assertEquals(contentType('file.opus'), 'audio/ogg')
    assertEquals(contentType('file.wav'), 'audio/wav')
    assertEquals(contentType('file.webm'), 'audio/webm')
    assertEquals(contentType('file.aac'), 'audio/x-aac')
    assertEquals(contentType('file.flac'), 'audio/x-flac')
    assertEquals(contentType('file.mp4'), 'video/mp4')
    assertEquals(contentType('file.mp4v'), 'video/mp4')
    assertEquals(contentType('file.mkv'), 'video/x-matroska')
    assertEquals(contentType('file.mov'), 'video/quicktime')
    assertEquals(contentType('file.svg'), 'image/svg+xml')
    assertEquals(contentType('file.avif'), 'image/avif')
    assertEquals(contentType('file.bmp'), 'image/bmp')
    assertEquals(contentType('file.gif'), 'image/gif')
    assertEquals(contentType('file.heic'), 'image/heic')
    assertEquals(contentType('file.heif'), 'image/heif')
    assertEquals(contentType('file.jpeg'), 'image/jpeg')
    assertEquals(contentType('file.jpg'), 'image/jpeg')
    assertEquals(contentType('file.png'), 'image/png')
    assertEquals(contentType('file.tiff'), 'image/tiff')
    assertEquals(contentType('file.psd'), 'image/vnd.adobe.photoshop')
    assertEquals(contentType('file.ico'), 'image/vnd.microsoft.icon')
    assertEquals(contentType('file.webp'), 'image/webp')
    assertEquals(contentType('file.es'), 'application/ecmascript')
    assertEquals(contentType('file.epub'), 'application/epub+zip')
    assertEquals(contentType('file.jar'), 'application/java-archive')
    assertEquals(contentType('file.war'), 'application/java-archive')
    assertEquals(contentType('file.webmanifest'), 'application/manifest+json')
    assertEquals(contentType('file.doc'), 'application/msword')
    assertEquals(contentType('file.dot'), 'application/msword')
    assertEquals(contentType('file.docx'), 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    assertEquals(contentType('file.dotx'), 'application/vnd.openxmlformats-officedocument.wordprocessingml.template')
    assertEquals(contentType('file.cjs'), ContentType.Node)
    assertEquals(contentType('file.bin'), 'application/octet-stream')
    assertEquals(contentType('file.pkg'), 'application/octet-stream')
    assertEquals(contentType('file.dump'), 'application/octet-stream')
    assertEquals(contentType('file.exe'), 'application/octet-stream')
    assertEquals(contentType('file.deploy'), 'application/octet-stream')
    assertEquals(contentType('file.img'), 'application/octet-stream')
    assertEquals(contentType('file.msi'), 'application/octet-stream')
    assertEquals(contentType('file.pdf'), 'application/pdf')
    assertEquals(contentType('file.pgp'), 'application/pgp-encrypted')
    assertEquals(contentType('file.asc'), 'application/pgp-signature')
    assertEquals(contentType('file.sig'), 'application/pgp-signature')
    assertEquals(contentType('file.ai'), 'application/postscript')
    assertEquals(contentType('file.eps'), 'application/postscript')
    assertEquals(contentType('file.ps'), 'application/postscript')
    assertEquals(contentType('file.rdf'), 'application/rdf+xml')
    assertEquals(contentType('file.rss'), 'application/rss+xml')
    assertEquals(contentType('file.rtf'), 'application/rtf')
    assertEquals(contentType('file.apk'), 'application/vnd.android.package-archive')
    assertEquals(contentType('file.key'), 'application/vnd.apple.keynote')
    assertEquals(contentType('file.numbers'), 'application/vnd.apple.keynote')
    assertEquals(contentType('file.pages'), 'application/vnd.apple.pages')
    assertEquals(contentType('file.geo'), 'application/vnd.dynageo')
    assertEquals(contentType('file.gdoc'), 'application/vnd.google-apps.document')
    assertEquals(contentType('file.gslides'), 'application/vnd.google-apps.presentation')
    assertEquals(contentType('file.gsheet'), 'application/vnd.google-apps.spreadsheet')
    assertEquals(contentType('file.kml'), 'application/vnd.google-earth.kml+xml')
    assertEquals(contentType('file.mkz'), 'application/vnd.google-earth.kmz')
    assertEquals(contentType('file.icc'), 'application/vnd.iccprofile')
    assertEquals(contentType('file.icm'), 'application/vnd.iccprofile')
    assertEquals(contentType('file.xls'), 'application/vnd.ms-excel')
    assertEquals(contentType('file.xlsx'), 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    assertEquals(contentType('file.xlm'), 'application/vnd.ms-excel')
    assertEquals(contentType('file.ppt'), 'application/vnd.ms-powerpoint')
    assertEquals(contentType('file.pot'), 'application/vnd.ms-powerpoint')
    assertEquals(contentType('file.pptx'), 'application/vnd.openxmlformats-officedocument.presentationml.presentation')
    assertEquals(contentType('file.potx'), 'application/vnd.openxmlformats-officedocument.presentationml.template')
    assertEquals(contentType('file.xps'), 'application/vnd.ms-xpsdocument')
    assertEquals(contentType('file.odc'), 'application/vnd.oasis.opendocument.chart')
    assertEquals(contentType('file.odb'), 'application/vnd.oasis.opendocument.database')
    assertEquals(contentType('file.odf'), 'application/vnd.oasis.opendocument.formula')
    assertEquals(contentType('file.odg'), 'application/vnd.oasis.opendocument.graphics')
    assertEquals(contentType('file.odp'), 'application/vnd.oasis.opendocument.presentation')
    assertEquals(contentType('file.ods'), 'application/vnd.oasis.opendocument.spreadsheet')
    assertEquals(contentType('file.odt'), 'application/vnd.oasis.opendocument.text')
    assertEquals(contentType('file.rar'), 'application/vnd.rar')
    assertEquals(contentType('file.unityweb'), 'application/vnd.unity')
    assertEquals(contentType('file.dmg'), 'application/x-apple-diskimage')
    assertEquals(contentType('file.bz'), 'application/x-bzip')
    assertEquals(contentType('file.crx'), 'application/x-chrome-extension')
    assertEquals(contentType('file.deb'), 'application/x-debian-package')
    assertEquals(contentType('file.php'), 'application/x-httpd-php')
    assertEquals(contentType('file.iso'), 'application/x-iso9660-image')
    assertEquals(contentType('file.sh'), 'application/x-sh')
    assertEquals(contentType('file.sql'), 'application/x-sql')
    assertEquals(contentType('file.srt'), 'application/x-subrip')
    assertEquals(contentType('file.xml'), ContentType.XML)
    assertEquals(contentType('file.zip'), 'application/zip')
  }
})

Deno.test({
  name: 'Headers: content types',
  fn () {
    assertEquals(ContentType.JSON, 'application/json')
    assertEquals(ContentType.JavaScript, 'application/javascript')
    assertEquals(ContentType.TypeScript, 'text/typescript')
    assertEquals(ContentType.ReactJS, 'text/jsx')
    assertEquals(ContentType.ReactTS, 'text/tsx')
    assertEquals(ContentType.Node, 'application/node')
    assertEquals(ContentType.CSS, 'text/css')
    assertEquals(ContentType.HTML, 'text/html')
    assertEquals(ContentType.Markdown, 'text/markdown')
    assertEquals(ContentType.Text, 'text/plain')
    assertEquals(ContentType.XML, 'application/xml')
    assertEquals(ContentType.YAML, 'text/yaml')
    }
})
