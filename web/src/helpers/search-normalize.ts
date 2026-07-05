/** Нормализация строки для поиска (ё/е и т.д.) — общая для стора локаций и поиска. Всегда возвращает строку. */
export function searchDataValidator(data: string | null | undefined): string {
  if (data == null || data === "") {
    return "";
  }
  return data.replace(/[е|ё]/g, "е");
}

/** decodeURIComponent без URIError при битом `%` в query (и защита от null). */
export function safeDecodeURIComponent(value: string | null | undefined): string {
  if (value == null || value === "") return "";
  try {
    return decodeURIComponent(value).trim();
  } catch {
    return value.trim();
  }
}
