export default function (path) {
  console.log("path:", path);
  if (Array.isArray(path)) {
    return getSelectors(path);
  }
}

function getSelectors(path) {
  return path
    .reverse()
    .filter((element) => {
      return element !== document && element !== window;
    })
    .map((element) => {
      let selector = "";
      if (element.id) {
        return `${element.tagName.toLowerCase()}#${element.id}`;
      } else if (element.className && typeof element.className === "string") {
        return `${element.tagName.toLowerCase()}.${element.className}`;
      } else {
        selector = element.tagName.toLowerCase();
      }
      return selector;
    })
    .join(" ");
}
