/** Старое поле URL в документе локации — не используем (фото хранится в descriptionImage Binary). */
export function stripLegacyLocationImage<T extends InsomniaLocation>(
  location: T
): T {
  const { image: _image, ...rest } = location as T & { image?: string };
  return rest as T;
}
