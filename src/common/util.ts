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

export function convertDescriptionXML(title: string, url: string): string {
  return "<dim>" + title + "</dim><url>" + escapeXML(url) + "</url>";
  // const description =
  //   "<dim>" +
  //   title.slice(0, match.index) +
  //   "</dim><match>" +
  //   title.slice(match.index, match.index + match[0].length) +
  //   "</match><dim>" +
  //   title.slice(match.index + match[0].length) +
  //   "</dim> <url>" +
  //   url +
  //   "</url>";
}
