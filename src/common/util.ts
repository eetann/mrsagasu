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
