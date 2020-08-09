chrome.omnibox.onInputChanged.addListener(
  function (text, suggest) {
    chrome.bookmarks.search(text, function (bookmarkItems) {
      var sugs = [];
      for (var i = 0, limit = bookmarkItems.length > 5 ? 5 : bookmarkItems.length;
        i < limit; i++) {
        var item = bookmarkItems[i];
        if (item.url) {
          sugs.push({content: item.url, description: item.title});
        }
      }
      suggest(sugs);
    });
  }
);

chrome.omnibox.onInputEntered.addListener(
  function (text) {
    navigate(text);
  }
);

function navigate(url) {
  chrome.tabs.getSelected(null, function (tab) {
    chrome.tabs.update(tab.id, {url: url});
  });
}
