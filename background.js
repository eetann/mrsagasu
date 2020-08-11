chrome.omnibox.setDefaultSuggestion({
  description: "Please type a few words the title of the bookmark."
});

chrome.omnibox.onInputStarted.addListener(() => {
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
});

chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  var fuz = "";
  for (var i = 0; i < text.length; i++) {
    fuz += text.charAt(i) + ".*";
  }
  var re = new RegExp(fuz, "i");
  chrome.storage.local.get("mrsagasu", (value) => {
    var bookmarks = value.mrsagasu;
    if (bookmarks) {
      var sugs = [];
      for (var i = 0; i < bookmarks.length && sugs.length < 7; i++) {
        var item = bookmarks[i];
        if (re.test(item.description)) {
          sugs.push(item);
        }
      }
      suggest(sugs);
    }
  });
});

chrome.omnibox.onInputEntered.addListener((text, disposition) => {
  chrome.storage.local.remove("mrsagasu");
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


chrome.omnibox.onInputCancelled.addListener(() => {
  chrome.storage.local.remove("mrsagasu");
});
