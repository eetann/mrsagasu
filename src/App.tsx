import { useEffect, useRef, useState } from "react";

const App = (): JSX.Element => {
  const [allBookmarks, setAllBookMarks] = useState<
    chrome.bookmarks.BookmarkTreeNode[]
  >([]);
  const query = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chrome.bookmarks.search({}, (bookmarkItems) => {
      setAllBookMarks(bookmarkItems.filter((item) => "url" in item));
    });
  }, []);

  return (
    <div>
      <input
        autoFocus={true}
        type="text"
        ref={query}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            const regexp = new RegExp(`#${query.current?.value}(\\s|$)`);
            const bookmarks = allBookmarks.filter((item) =>
              regexp.test(item.title)
            );
            for (const bookmark of bookmarks) {
              chrome.tabs.create({ url: bookmark.url });
            }
          }
        }}
      />
    </div>
  );
};

export default App;
