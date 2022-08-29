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
      fuse = new Fuse(allBookmarks, { keys: ["title"] });
    }
  );
});

chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  const fuseResult = fuse.search(text);
  let suggestResults: chrome.omnibox.SuggestResult[] = fuseResult.map(
    (fuseBookmark) => {
      let suggestResult: chrome.omnibox.SuggestResult = {
        content: "",
        description: "",
      };
      suggestResult.content = fuseBookmark.item.url || "";
      // TODO: indicesの最初と最後を使って太字にする
      suggestResult.description = convertDescriptionXML(
        fuseBookmark.item.title,
        fuseBookmark.item.url || ""
      );
      return suggestResult;
    }
  );
  // for (let i = 0; i < suggestions.length && i < 7; i++) {
  //   result.push({
  //     content: suggestions[i].content,
  //     description: suggestions[i].description,
  //   });
  // }
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
