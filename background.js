function escapeTitle(text) {
  return text
    .replace(/"/g, ' ')
    .replace(/'/g, " ")
    .replace(/</g, ' ')
    .replace(/>/g, ' ')
    .replace(/&/g, ' ');
}

function update_bookmarks() {
  chrome.bookmarks.search({}, (bookmarkItems) => {
    if (bookmarkItems) {
      var bookmarks = [];
      for (var i = 0; i < bookmarkItems.length; i++) {
        var item = bookmarkItems[i];
        if (item.url) {
          bookmarks.push({content: item.url, description: escapeTitle(item.title)});
        }
      }
      chrome.storage.local.set({"mrsagasu": bookmarks});
    }
  })
}

function escapeXML(text) {
  return text
    .replace(/"/g, '&quot;')
    .replace(/'/g, "&apos;")
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/&/g, '&amp;');
}

function escapeRegExp(string) {
  // $&はマッチした部分文字列全体
  return string.replace(/[.*+?^=!:${}()|[\]\/\\]/g, '\\$&');
}

chrome.runtime.onInstalled.addListener(update_bookmarks);
chrome.bookmarks.onChanged.addListener(update_bookmarks);
chrome.bookmarks.onRemoved.addListener(update_bookmarks);
chrome.bookmarks.onCreated.addListener(update_bookmarks);

chrome.omnibox.setDefaultSuggestion({
  description: "Type a few character"
});

chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  chrome.storage.local.get("mrsagasu", (value) => {
    var bookmarks = value.mrsagasu;
    if (bookmarks) {
      var fuz = "";
      for (var i = 0; i < text.length - 1; i++) {
        fuz += escapeRegExp(text.charAt(i)) + ".*?";
      }
      fuz += escapeRegExp(text.charAt(text.length - 1));
      var re = new RegExp(fuz, "i");
      var sugs = [];
      bookmarks.forEach(value => {
        var mat = re.exec(value.description);
        if (mat) {
          var esd = value.description;
          var esc = escapeXML(value.content);
          var desc = "<dim>" + esd.slice(0, mat.index)
            + "</dim><match>"
            + esd.slice(mat.index, mat.index + mat[0].length)
            + "</match><dim>"
            + esd.slice(mat.index + mat[0].length)
            + "</dim> <url>" + esc + "</url>";
          sugs.push({
            content: value.content,
            description: desc,
            mathchlen: mat[0].length
          });
        }
      });
      sugs.sort((a, b) => {
        return a.mathchlen - b.mathchlen;
      })
      var result = [];
      for (var i = 0; i < sugs.length && i < 7; i++) {
        result.push({content: sugs[i].content, description: sugs[i].description});
      }
      suggest(result);
    }
  });
});

chrome.omnibox.onInputEntered.addListener((text, disposition) => {
  switch (disposition) {
    case "currentTab":
      chrome.tabs.update({url: text});
      break;
    case "newForegroundTab":
      chrome.tabs.create({url: text});
      break;
    case "newBackgroundTab":
      chrome.tabs.create({url: text, active: false});
      break;
  }
});

