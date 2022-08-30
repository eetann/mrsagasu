import Fuse from "fuse.js";

export function escapeXML(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function escapeRegExp(text: string) {
  // $&はマッチした部分文字列全体
  return text.replace(/[.*+?^=!:${}()|[\]/\\]/g, "\\$&");
}

export function convertDescriptionXML(
  title: string,
  url: string,
  indices: ReadonlyArray<Fuse.RangeTuple>
): string {
  let description = "";
  let nowIndex = 0;
  for (const index of indices) {
    if (nowIndex < index[0]) {
      const dimText = title.substring(nowIndex, index[0]);
      description += `<dim>${dimText}</dim>`;
    }
    nowIndex = index[1] + 1;
    const matchText = title.substring(index[0], nowIndex);
    description += `<match>${matchText}</match>`;
  }
  if (nowIndex < title.length) {
    const dimText = title.substring(nowIndex);
    description += `<dim>${dimText}</dim>`;
  }
  return description + "<url>" + escapeXML(url) + "</url>";
}
