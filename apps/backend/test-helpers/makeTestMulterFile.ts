import { Readable } from "stream";

export function makeTestMulterFile(
  opts: Partial<Express.Multer.File> = {},
): Express.Multer.File {
  const buffer = Buffer.isBuffer(opts.buffer)
    ? (opts.buffer as Buffer)
    : Buffer.from(String(opts.buffer ?? "fake-image-data"));
  return {
    fieldname: opts.fieldname ?? "trackArt",
    originalname: opts.originalname ?? "track-art.jpg",
    encoding: opts.encoding ?? "7bit",
    mimetype: opts.mimetype ?? "image/jpeg",
    size: opts.size ?? buffer.length,
    destination: opts.destination ?? "",
    filename: opts.filename ?? "track-art.jpg",
    path: opts.path ?? "",
    buffer,
    stream: opts.stream ?? Readable.from(buffer),
  } as Express.Multer.File;
}
