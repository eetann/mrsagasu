[![test and lint](https://github.com/eetann/mrsagasu/actions/workflows/test.yaml/badge.svg)](https://github.com/eetann/mrsagasu/actions/workflows/test.yaml)
[![Release](https://github.com/eetann/mrsagasu/actions/workflows/release.yaml/badge.svg)](https://github.com/eetann/mrsagasu/actions/workflows/release.yaml)

<p align="center">
  <img src="./public/icons/icon-128x128.png" height="120">
</p>


# Mr.Sagasu
This is a Chrome Extension to search bookmark.
[Mr.Sagasu](https://chrome.google.com/webstore/detail/mrsagasu/kkendaacffjgfnjaolejgaopcoakacpb)


## Features
### Bookmark Nickname
Open bookmarks with hashtags at once

![image](./docs/assets/bookmark-nickname.png)

0. Add hashtag to the title of bookmark

1. Enter key bindings(default Ctrl + Shift + Y)
2. Enter hashtags on the popup screen
3. Press Enter key or Enter button on the screen


### Search titles of bookmarks at the address bar
- search to only titles of bookmarks at the address bar
- **fuzzy match** = All you have to do is type a few characters

![demo](./docs/assets/mrsagasu_demo.gif)  

<br><br>
For example,
let's say titles of bookmarks are the following.

- bookmaaark abc
- booookmaaaaark def
- boooookmaark ghi
- goooookmaark

When you want to choice "boooookmaark ghi", All you have to do is type "bg".  
It's brought by fuzzy match like the following.  
**b**oooookmaark **g**hi  

1. Move at the address bar
2. Type "b" and space key
3. Type a few characters
4. Choice a suggest by using arrow keys and enter key


## Author
[@eetann092](https://twitter.com/eetann092)  
