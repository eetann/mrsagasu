chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  var fuz = "";
  for (var i = 0; i < text.length; i++) {
    fuz += text.charAt(i) + ".*";
  }
  var re = new RegExp(fuz, "i");
  chrome.bookmarks.search({}, (bookmarkItems) => {
    var sugs = [];
    for (var i = 0; i < bookmarkItems.length && sugs.length < 7; i++) {
      var item = bookmarkItems[i];
      if ((item.url) && (re.test(item.title))) {
        sugs.push({content: item.url, description: item.title});
      }
    }
    suggest(sugs);
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
