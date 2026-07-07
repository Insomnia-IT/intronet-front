import { searchDataValidator } from "@helpers/search-normalize";

export function highlight(text: string, query: string | undefined) {
  text = searchDataValidator(text);
  text = text.replaceAll('&#039;', "'");
  query = searchDataValidator(query).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (!query || !text) return text;
  if (!text.toLowerCase().includes(query.toLowerCase())) {
    return text;
  }
  const r = new RegExp("[^\\s]*" + query.trim() + "[^\\s]*", "gi");
  const split = text.split(r);
  const matches = text.match(r);
  return <>
    {new Array(split.length + matches.length)
      .fill(0)
      .map((_, i) =>
        i % 2 == 0 ? <span dangerouslySetInnerHTML={{__html: split[i / 2] ?? ""}}/> : <mark dangerouslySetInnerHTML={{__html: matches[(i - 1) / 2] ?? ""}}></mark>
    )}
  </>
}
