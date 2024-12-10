browser.contextMenus.create({
  id: "save",
  title: "Mixura | Save",
  contexts: ["all"],
});

browser.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "save") {
    let popupUrl;

    if (info.pageUrl) {
      popupUrl = `http://localhost:5173/save?image=${encodeURIComponent(
        info.pageUrl
      )}`;
    } else if (info.srcUrl) {
      popupUrl = `http://localhost:5173/save?image=${encodeURIComponent(
        info.srcUrl
      )}`;
    }

    // Get the screen dimensions
    let screenWidth = screen.width;
    let screenHeight = screen.height;

    // Set popup dimensions
    let popupWidth = 500;
    let popupHeight = 1000;

    // Calculate the centered position
    let left = Math.round((screenWidth - popupWidth) / 2);
    let top = Math.round((screenHeight - popupHeight) / 2);

    // Open the centered popup
    browser.windows.create({
      url: popupUrl,
      type: "popup",
      width: popupWidth,
      height: popupHeight,
      left: left,
      top: top,
    });
  }
});
