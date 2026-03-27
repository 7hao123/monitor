function getExtraData() {
  return {
    title: document.title,
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
  };
}
export class SendTracker {
  constructor() {
    this.url = "/log";
    this.xhr = new XMLHttpRequest();
  }
  send(data) {
    this.xhr.open("POST", this.url);
    let log = { ...getExtraData(), ...data };
    for (let key in log) {
      if (typeof log[key] === "number") {
        log[key] = log[key].toString();
      }
    }
    console.log("发送日志数据:", log);
    let body = JSON.stringify(data);
    this.xhr.setRequestHeader("Content-Type", "application/json");
    this.xhr.setRequestHeader("x-log-apiversion", "0.6.0");
    this.xhr.setRequestHeader("x-log-bodyrawsize", body.length);
    this.xhr.send(body);
    this.xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        console.log("日志发送成功:", this.responseText);
      } else {
        console.error("日志发送失败:", this.statusText);
      }
    };
    this.xhr.onerror = function () {
      console.error("日志发送失败:", this.statusText);
    };
  }
}
