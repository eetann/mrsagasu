import { convertDescriptionXML, escapeRegExp } from "../common/util";

let allBookmarks: chrome.bookmarks.BookmarkTreeNode[] = [];

type MatchLengthList = {
  index: number;
  matchLength: number;
};

chrome.omnibox.onInputStarted.addListener(() => {
  chrome.omnibox.setDefaultSuggestion({
    description: "Enter at least 2 characters ...",
  });
  chrome.bookmarks.search(
    {},
    (bookmarkItems: chrome.bookmarks.BookmarkTreeNode[]) => {
      allBookmarks = bookmarkItems.filter((item) => "url" in item);
    }
  );
});

chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  let suggestResults: chrome.omnibox.SuggestResult[] = [];
  if (allBookmarks.length === 0 || text.length < 2) {
    suggest(suggestResults);
    return;
  }
  chrome.omnibox.setDefaultSuggestion({
    description: "Select ...",
  });
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
      matchLength - 1
    );
    suggestResults.push({ content, description });
    matchLengthList.push({ index, matchLength });
    index++;
  });
  console.log(suggestResults);
  // sort
  matchLengthList.sort((a, b) => {
    return a.matchLength - b.matchLength;
  });
  console.log(matchLengthList);
  const result = matchLengthList.map((matchLengthItem) => {
    return suggestResults[matchLengthItem.index];
  });
  suggest(result);
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
