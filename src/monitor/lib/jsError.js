import getLastEvent from "../utils/getLastEvent";
import getSelector from "../utils/getSelector";
import { SendTracker } from "../utils/tracker";
const sendTracker = new SendTracker();
function getLines(stack) {
  return stack
    .split("\n")
    .slice(1)
    .map((item) => item.replace(/^\s+at\s+/g, ""))
    .join("^");
}
export function injectJsError() {
  console.log("正在注入js错误监控...");
  window.addEventListener(
    "error",
    function (event) {
      console.log("捕获到js错误:", event);
      let lastEvent = getLastEvent(); //最后一个交互事件
      // 区分资源加载错误和JS运行时错误
      if (event.target && event.target !== window) {
        // 资源加载错误
        console.log("捕获到资源加载错误:", event);
        let log = {
          kind: "stability",
          type: "error",
          errorType: "resourceError",
          url: "",
          filename: event.target.src || event.target.href || "",
          tagName: event.target.tagName,
          selector: getSelector([event.target]),
        };
        sendTracker.send(log);
        console.log("资源加载错误日志:", log);
      } else {
        // JS运行时错误
        console.log("捕获到运行时错误:", event);
        console.log("最后一个交互事件:", lastEvent);
        let log = {
          kind: "stability",
          type: "error",
          errorType: "jsError",
          url: "",
          message: event.message,
          filename: event.filename,
          position: event.lineno + ":" + event.colno,
          stack: getLines(event.error.stack),
          selector: lastEvent ? getSelector(lastEvent.composedPath()) : "",
        };
        sendTracker.send(log);
        console.log("JS错误日志:", log);
      }
    },
    true,
  );
  window.addEventListener("unhandledrejection", function (event) {
    console.log("捕获到未处理的Promise错误:", event);
    let message;
    let filename;
    let line = 0;
    let column = 0;
    let stack = "";
    let reason = event.reason;
    if (typeof reason === "string") {
      message = reason;
    } else if (typeof reason === "object") {
      message = reason.message;
      if (reason.stack) {
        let matchResult = reason.stack.match(/at\s+(.+):(\d+):(\d+)/);
        if (matchResult) {
          filename = matchResult[1];
          line = matchResult[2];
          column = matchResult[3];
        }
        stack = getLines(reason.stack);
      }
    }
    let log = {
      kind: "stability", // 稳定性指标
      type: "error", // 错误类型
      errorType: "promiseError", // js错误类型
      url: "", // 错误发生的url
      message: message, // 错误信息
      filename: filename, // 发生错误的文件名
      position: line + ":" + column, // 错误发生的位置
      stack: stack, // 错误堆栈信息
      selector: "", // Promise错误与DOM元素无关
    };
    sendTracker.send(log);
  });
}
