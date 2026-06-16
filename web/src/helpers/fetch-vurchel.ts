/** Загрузка метаданных фильма с vurchel.com (CORS разрешён). */
export async function fetchVurchelFilm(
  vurchelId: string | number
): Promise<VurchelFilm | null> {
  try {
    const res = await fetch(
      `https://vurchel.com/export/filminfo/${vurchelId}`
    );
    if (!res.ok) return null;
    const info = (await res.json()) as VurchelFilm;
    return info?.entryID ? info : null;
  } catch {
    return null;
  }
}
