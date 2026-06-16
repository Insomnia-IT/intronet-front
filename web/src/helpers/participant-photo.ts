/** Нормализация имени участника для сопоставления с activities. */
export function normalizeParticipantName(name: string): string {
  return name
    .trim()
    .replace(/\s/g, "")
    .replace(/[^a-zA-Zа-яА-ЯёЁ]/g, "")
    .replace(/ё/g, "е")
    .toLowerCase();
}

/** Карта имя → фото из расписания activities. */
export function buildParticipantPhotos(
  activities: Activity[]
): Map<string, string> {
  const map = new Map<string, string>();
  for (const activity of activities) {
    for (const author of activity.authors ?? []) {
      if (!author.photo || !author.name) continue;
      const key = normalizeParticipantName(author.name);
      if (!map.has(key)) map.set(key, author.photo);
    }
  }
  return map;
}

export function findParticipantPhoto(
  photos: Map<string, string>,
  name: string
): string | undefined {
  return photos.get(normalizeParticipantName(name));
}

/** Уникальные фото авторов для галереи на карточке активности. */
export function getAuthorGalleryImages(
  authors?: { photo?: string }[]
): string[] {
  const seen = new Set<string>();
  const images: string[] = [];
  for (const author of authors ?? []) {
    if (!author.photo || seen.has(author.photo)) continue;
    seen.add(author.photo);
    images.push(author.photo);
  }
  return images;
}
