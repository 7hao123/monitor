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
  window.addEventListener("error", function (event) {
    let lastEvent = getLastEvent(); //最后一个交互事件
    console.log("捕获到js错误:", event);
    console.log("最后一个交互事件:", lastEvent);
    // 这里可以将错误信息发送到服务器进行分析和处理
    let log = {
      kind: "stability", // 稳定性指标
      type: "error", // 错误类型
      errorType: "jsError", // js错误类型
      url: "", // 错误发生的url
      message: event.message, // 错误信息
      filename: event.filename, // 发生错误的文件名
      position: event.lineno + ":" + event.colno, // 错误发生的位置
      stack: getLines(event.error.stack), // 错误堆栈信息
      selector: lastEvent ? getSelector(lastEvent.composedPath()) : "", // 发生错误的元素的选择器,最后一个操作的元素
    };
    sendTracker.send(log);
    console.log("错误日志:", log);
  });
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
