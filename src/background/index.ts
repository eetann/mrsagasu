import { convertDescriptionXML, escapeRegExp } from "../common/util";

let allBookmarks: chrome.bookmarks.BookmarkTreeNode[] = [];

type MatchLengthList = {
  index: number;
  matchLength: number;
};

chrome.omnibox.setDefaultSuggestion({
  description: "Type a few character",
});

chrome.omnibox.onInputStarted.addListener(() => {
  chrome.bookmarks.search(
    {},
    (bookmarkItems: chrome.bookmarks.BookmarkTreeNode[]) => {
      allBookmarks = bookmarkItems.filter((item) => "url" in item);
    }
  );
});

chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  let suggestResults: chrome.omnibox.SuggestResult[] = [];
  if (allBookmarks.length === 0) {
    suggest(suggestResults);
  }
  const matchLengthList: MatchLengthList[] = [];
  let searchText = "";
  for (const char of text) {
    searchText += escapeRegExp(char) + ".*?";
  }
  // delete last regexp .*?
  searchText = searchText.substring(0, text.length - 3);
  const re = new RegExp(searchText, "i");
  for (let index = 0, len = allBookmarks.length; index < len; index++) {
    const bookmark = allBookmarks[index];
    const match = re.exec(bookmark.title);
    if (match == null) {
      continue;
    }
    const content: string = bookmark.url || "";
    const matchLength: number = match[0].length;
    const description: string = convertDescriptionXML(
      bookmark.title,
      content,
      match.index,
      matchLength
    );
    suggestResults.push({ content, description });
    matchLengthList.push({ index, matchLength });
  }
  // sort
  matchLengthList.sort((a, b) => {
    return a.matchLength - b.matchLength;
  });
  suggestResults = matchLengthList.map((matchLengthItem) => {
    return suggestResults[matchLengthItem.index];
  });
  suggest(suggestResults);
});

chrome.omnibox.onInputEntered.addListener((text, disposition) => {
  switch (disposition) {
    case "currentTab":
      chrome.tabs.update({ url: text });
      break;
    case "newForegroundTab":
      chrome.tabs.create({ url: text });
      break;
    case "newBackgroundTab":
      chrome.tabs.create({ url: text, active: false });
      break;
  }
});
