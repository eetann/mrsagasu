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

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const regexp = new RegExp(`#${query.current?.value}(\\s|$)`);
    const bookmarks = allBookmarks.filter((item) => regexp.test(item.title));
    for (const bookmark of bookmarks) {
      chrome.tabs.create({ url: bookmark.url });
    }
  };

  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Bookmark Nickname</h2>
        <form className="form-control" onSubmit={onSubmit}>
          <div className="input-group input-group-md">
            <span className="px-2 text-xl">#</span>
            <input
              placeholder="Type here"
              className="input input-bordered input-md w-full max-w-xs px-2 text-xl"
              autoFocus={true}
              type="text"
              ref={query}
            />
            <button className="btn btn-ghost">
              <kbd className="kbd kbd-sm">Enter</kbd>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default App;
