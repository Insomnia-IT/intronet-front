/** Уникальные картинки: постер первым, остальное — порядок API. */
export function getVurchelGalleryImages(
  images?: string[] | null
): string[] {
  const unique = [...new Set((images ?? []).filter(Boolean))];
  const poster = unique.find((u) => /poster/i.test(u));
  return poster ? [poster, ...unique.filter((u) => u !== poster)] : unique;
}

export function pickVurchelPoster(images?: string[] | null): string | undefined {
  return getVurchelGalleryImages(images)[0];
}
