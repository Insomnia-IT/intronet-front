import { Fn } from "@cmmn/core";
import { Binary } from "mongodb";
import { Database } from "./database";

const locationsDB = Database.Get<InsomniaLocation>("locations");

export const MAX_DESCRIPTION_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export function stripLocationBinary(items: InsomniaLocation[]) {
  return items.map((item) => {
    const { descriptionImage, ...rest } = item;
    return {
      ...rest,
      hasDescriptionImage: rest.hasDescriptionImage ?? !!descriptionImage,
    };
  });
}

export async function getLocationDescriptionImage(id: string) {
  const doc = await locationsDB.get(id);
  if (!doc?.descriptionImage) return null;
  const binary = doc.descriptionImage as Binary;
  const buffer = Buffer.isBuffer(binary) ? binary : binary.buffer;
  return {
    buffer,
    mime: doc.descriptionImageMime ?? "application/octet-stream",
  };
}

export async function setLocationDescriptionImage(
  id: string,
  buffer: Buffer,
  mime: string
) {
  if (!ALLOWED_MIME.has(mime)) {
    throw new ImageError(415, "Unsupported image type");
  }
  if (buffer.length > MAX_DESCRIPTION_IMAGE_SIZE) {
    throw new ImageError(413, "Image too large");
  }
  const existing = await locationsDB.get(id);
  if (!existing) {
    throw new ImageError(404, "Location not found");
  }
  const version = Fn.ulid();
  await locationsDB.updateFields(id, {
    descriptionImage: new Binary(buffer),
    descriptionImageMime: mime,
    hasDescriptionImage: true,
    version,
  });
  return { version };
}

export async function clearLocationDescriptionImage(id: string) {
  const existing = await locationsDB.get(id);
  if (!existing) {
    throw new ImageError(404, "Location not found");
  }
  const version = Fn.ulid();
  await locationsDB.updateFields(
    id,
    {
      hasDescriptionImage: false,
      version,
    },
    {
      descriptionImage: 1,
      descriptionImageMime: 1,
    }
  );
  return { version };
}

export class ImageError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
  }
}
