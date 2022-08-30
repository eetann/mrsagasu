import { convertDescriptionXML } from "../common/util";
import Fuse from "fuse.js";

let allBookmarks: chrome.bookmarks.BookmarkTreeNode[] = [];
let fuse: Fuse<chrome.bookmarks.BookmarkTreeNode>;

chrome.omnibox.setDefaultSuggestion({
  description: "Type a few character",
});

chrome.omnibox.onInputStarted.addListener(() => {
  chrome.bookmarks.search(
    {},
    (bookmarkItems: chrome.bookmarks.BookmarkTreeNode[]) => {
      allBookmarks = bookmarkItems.filter((item) => "url" in item);
      fuse = new Fuse(allBookmarks, {
        keys: ["title"],
        includeMatches: true,
        threshold: 0.4,
      });
    }
  );
});

chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  const fuseResult = fuse.search(text);
  const suggestResults: chrome.omnibox.SuggestResult[] = [];
  for (const fuseBookmark of fuseResult) {
    const suggestResult: chrome.omnibox.SuggestResult = {
      content: "",
      description: "",
    };
    suggestResult.content = fuseBookmark.item.url || "";
    const matches = fuseBookmark.matches;
    if (typeof matches === "undefined") {
      continue;
    }
    // TODO: indicesの最初と最後を使って太字にする
    const indices: ReadonlyArray<Fuse.RangeTuple> = matches[0].indices;
    suggestResult.description = convertDescriptionXML(
      fuseBookmark.item.title,
      fuseBookmark.item.url || "",
      indices
    );
    suggestResults.push(suggestResult);
  }
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
