chrome.omnibox.onInputChanged.addListener(
  function (text, suggest) {
    var fuz = "";
    for (var i = 0; i < text.length; i++) {
      fuz += text.charAt(i) + ".*";
    }
    var re = new RegExp(fuz, "i");
    chrome.bookmarks.search({}, function (bookmarkItems) {
      var sugs = [];
      for (var i = 0; i < bookmarkItems.length; i++) {
        var item = bookmarkItems[i];
        if ((item.url) && (re.test(item.title))) {
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
