function update_bookmarks() {
  chrome.bookmarks.search({}, (bookmarkItems) => {
    if (bookmarkItems) {
      var bookmarks = [];
      for (var i = 0; i < bookmarkItems.length; i++) {
        var item = bookmarkItems[i];
        if (item.url) {
          bookmarks.push({content: item.url, description: item.title});
        }
      }
      chrome.storage.local.set({"mrsagasu": bookmarks});
    }
  })
}

chrome.runtime.onInstalled.addListener(update_bookmarks);
chrome.bookmarks.onChanged.addListener(update_bookmarks);
chrome.bookmarks.onRemoved.addListener(update_bookmarks);
chrome.bookmarks.onCreated.addListener(update_bookmarks);

chrome.omnibox.setDefaultSuggestion({
  description: "Please type a few words the title of the bookmark."
});

chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  chrome.storage.local.get("mrsagasu", (value) => {
    var bookmarks = value.mrsagasu;
    if (bookmarks) {
      var fuz = "";
      for (var i = 0; i < text.length; i++) {
        fuz += text.charAt(i) + ".*?";
      }
      var re = new RegExp(fuz, "i");
      var sugs = bookmarks.filter(value => re.test(value.description));
      sugs.sort((a, b) => {
        return re.exec(a.description)[0].length - re.exec(b.description)[0].length;
      })
      suggest(sugs.slice(0, 7));
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

