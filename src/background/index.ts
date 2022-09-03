import { searchBookmarksFromRegExp } from "../common/util";

let allBookmarks: chrome.bookmarks.BookmarkTreeNode[] = [];

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
  if (allBookmarks.length === 0 || text.length < 2) {
    suggest([]);
    return;
  }
  chrome.omnibox.setDefaultSuggestion({
    description: "Select ...",
  });
  suggest(searchBookmarksFromRegExp(text, allBookmarks));
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
