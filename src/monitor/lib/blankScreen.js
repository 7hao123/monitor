import { SendTracker } from "../utils/tracker";
import onload from "../utils/onload";
const sendTracker = new SendTracker();

export function blankScreen() {
  let wrappers = ["html", "body", "#container", ".content"];
  let emptyPoints = 0;
  function getSelector(element) {
    if (element.id) {
      return "#" + element.id;
    } else if (element.className) {
      // a b c -> a.b.c
      return "." + element.className.split(" ").filter(Boolean).join(".");
    } else {
      console.log("element:", element);
      return element.nodeName;
    }
  }
  function isWrapper(element) {
    let selector = getSelector(element);
    if (wrappers.includes(selector)) {
      emptyPoints++;
    }
  }
  onload(function () {
    for (let i = 1; i <= 9; i++) {
      let xElements = document.elementsFromPoint(
        (window.innerWidth * i) / 10,
        window.innerHeight / 2,
      );
      let yElements = document.elementsFromPoint(
        window.innerWidth / 2,
        (window.innerHeight * i) / 10,
      );
      isWrapper(xElements, yElements);
    }
    if (emptyPoints >= 0) {
      let centerElements = document.elementFromPoint(
        window.innerWidth / 2,
        window.innerHeight / 2,
      );
      sendTracker.send({
        kind: "stability",
        type: "blankScreen",
        emptyPoints,
        screen: window.screen.width + "x" + window.screen.height,
        viewPoint: window.innerWidth + "x" + window.innerHeight,
        selector: getSelector(centerElements),
      });
    }
  });
}
