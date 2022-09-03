export function escapeXML(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function escapeRegExp(text: string): string {
  // $&はマッチした部分文字列全体
  return text.replace(/[.*+?^=!:${}()|[\]/\\]/g, "\\$&");
}

export function convertDescriptionXML(
  title: string,
  url: string,
  startIndex: number,
  lastIndex: number
): string {
  let description = `<dim>${title.substring(0, startIndex)}</dim>`;
  description += `<match>${title.substring(startIndex, lastIndex + 1)}</match>`;
  description += `<dim>${title.substring(lastIndex + 1)}</dim>`;
  description += `<url>${escapeXML(url)}</url>`;
  return description;
}

type MatchLengthList = {
  index: number;
  matchLength: number;
};

export function searchBookmarksFromRegExp(
  text: string,
  allBookmarks: chrome.bookmarks.BookmarkTreeNode[]
): chrome.omnibox.SuggestResult[] {
  const suggestResults: chrome.omnibox.SuggestResult[] = [];
  const matchLengthList: MatchLengthList[] = [];

  let searchText = "";
  for (const char of text) {
    searchText += escapeRegExp(char) + ".*?";
  }
  // delete last regexp .*?
  searchText = searchText.substring(0, searchText.length - 3);
  const re = new RegExp(searchText, "i");
  let index = 0;
  allBookmarks.forEach((bookmark) => {
    const match = re.exec(bookmark.title);
    if (match == null) {
      return;
    }
    const content: string = bookmark.url || "";
    const matchLength: number = match[0].length;
    const description: string = convertDescriptionXML(
      bookmark.title,
      content,
      match.index,
      match.index + matchLength - 1
    );
    suggestResults.push({ content, description });
    matchLengthList.push({ index, matchLength });
    index++;
  });
  // sort
  matchLengthList.sort((a, b) => {
    return a.matchLength - b.matchLength;
  });
  return matchLengthList.map((matchLengthItem) => {
    return suggestResults[matchLengthItem.index];
  });
}
