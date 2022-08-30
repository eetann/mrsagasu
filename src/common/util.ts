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
  startIndex: number,
  lastIndex: number
): string {
  let description: string = `<dim>${title.substring(0, startIndex)}</dim>`;
  description += `<match>${title.substring(startIndex, lastIndex + 1)}</match>`;
  description += `<dim>${title.substring(lastIndex + 1)}</dim>`;
  description += `<url>${escapeXML(url)}</url>`;
  return description;
}
