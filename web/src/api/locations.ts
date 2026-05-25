import { Cell } from "@cmmn/cell";
import { api } from "@stores/api";
import { authStore } from "@stores/auth.store";
import { locationsStore } from "@stores/locations.store";
import { stripLegacyLocationImage } from "@helpers/location-image";

export { stripLegacyLocationImage } from "@helpers/location-image";

export function locationDescriptionImageUrl(id: string, version?: string) {
  const query = version ? `?v=${encodeURIComponent(version)}` : "";
  return `${api}/locations/${id}/description-image${query}`;
}

/** Сохраняет version с API картинки без нового ULID из addOrUpdate. */
export async function syncLocationImageMetadata(
  locationCell: Cell<InsomniaLocation>,
  patch: Partial<InsomniaLocation> & { version: string }
) {
  const updated = stripLegacyLocationImage({
    ...locationCell.get(),
    ...patch,
  } as InsomniaLocation & { version: string });
  locationCell.set(updated);
  const db = locationsStore.db;
  await db.set(updated);
  if (updated.version > db.localVersion) {
    db.localVersion = updated.version;
  }
  db.emit("change", {
    type: "addOrUpdate",
    key: updated._id,
    value: updated,
  });
}
export async function uploadLocationDescriptionImage(
  id: string,
  file: File
): Promise<{ version: string }> {
  const res = await fetch(locationDescriptionImageUrl(id), {
    method: "PUT",
    headers: {
      ...authStore.headers,
      "Content-Type": file.type,
    },
    body: file,
  });
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res.json();
}

export async function deleteLocationDescriptionImage(
  id: string
): Promise<{ version: string }> {
  const res = await fetch(locationDescriptionImageUrl(id), {
    method: "DELETE",
    headers: authStore.headers,
  });
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res.json();
}
