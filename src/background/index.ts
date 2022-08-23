function escapeTitle(text: string) {
  return text
    .replace(/"/g, " ")
    .replace(/'/g, " ")
    .replace(/</g, " ")
    .replace(/>/g, " ")
    .replace(/&/g, " ");
}

type myBookmark = {
  content: string;
  description: string;
};

type mySug = {
  content: string;
  description: string;
  mathchlen: number;
};

function update_bookmarks() {
  chrome.bookmarks.search({}, (bookmarkItems) => {
    if (bookmarkItems) {
      const bookmarks: myBookmark[] = [];
      for (let i = 0; i < bookmarkItems.length; i++) {
        const item = bookmarkItems[i];
        if (item.url) {
          bookmarks.push({
            content: item.url,
            description: escapeTitle(item.title),
          });
        }
      }
      chrome.storage.local.set({ mrsagasu: bookmarks });
    }
  });
}

function escapeXML(text: string) {
  return text
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/&/g, "&amp;");
}

function escapeRegExp(text: string) {
  // $&はマッチした部分文字列全体
  return text.replace(/[.*+?^=!:${}()|[\]\/\\]/g, "\\$&");
}

chrome.runtime.onInstalled.addListener(update_bookmarks);
chrome.bookmarks.onChanged.addListener(update_bookmarks);
chrome.bookmarks.onRemoved.addListener(update_bookmarks);
chrome.bookmarks.onCreated.addListener(update_bookmarks);

chrome.omnibox.setDefaultSuggestion({
  description: "Type a few character",
});

chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  chrome.storage.local.get("mrsagasu", (value) => {
    const bookmarks: myBookmark[] = value.mrsagasu;
    if (bookmarks) {
      let fuz = "";
      for (let i = 0; i < text.length - 1; i++) {
        fuz += escapeRegExp(text.charAt(i)) + ".*?";
      }
      fuz += escapeRegExp(text.charAt(text.length - 1));
      const re = new RegExp(fuz, "i");
      const sugs: mySug[] = [];
      bookmarks.forEach((value) => {
        const mat = re.exec(value.description);
        if (mat) {
          const esd = value.description;
          const esc = escapeXML(value.content);
          const desc =
            "<dim>" +
            esd.slice(0, mat.index) +
            "</dim><match>" +
            esd.slice(mat.index, mat.index + mat[0].length) +
            "</match><dim>" +
            esd.slice(mat.index + mat[0].length) +
            "</dim> <url>" +
            esc +
            "</url>";
          sugs.push({
            content: value.content,
            description: desc,
            mathchlen: mat[0].length,
          });
        }
      });
      sugs.sort((a, b) => {
        return a.mathchlen - b.mathchlen;
      });
      const result = [];
      for (let i = 0; i < sugs.length && i < 7; i++) {
        result.push({
          content: sugs[i].content,
          description: sugs[i].description,
        });
      }
      suggest(result);
    }
  });
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
