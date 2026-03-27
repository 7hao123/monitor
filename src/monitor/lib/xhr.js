import { SendTracker } from "../utils/tracker";

const sendTracker = new SendTracker();

export function injectXHR() {
  let XMLHttpRequest = window.XMLHttpRequest;
  let oldOpen = XMLHttpRequest.prototype.open;

  XMLHttpRequest.prototype.open = function (method, url, async) {
    // Skip collecting the log endpoint itself to avoid recursive reporting.
    if (typeof url === "string" && url.match("/log")) {
      this.__skipLog = true;
      return oldOpen.apply(this, arguments);
    }

    this.__skipLog = false;
    this.logData = {
      method,
      url,
      async,
    };

    return oldOpen.apply(this, arguments);
  };

  let oldSend = XMLHttpRequest.prototype.send;
  let startTime;

  XMLHttpRequest.prototype.send = function (body) {
    if (this.logData && !this.__skipLog) {
      startTime = Date.now();

      let handler = (type) => (event) => {
        let duration = Date.now() - startTime;
        let statusText = this.statusText;
        let statusCode = this.status;

        sendTracker.send({
          kind: "stability",
          type: "xhr",
          eventType: event.type,
          pathname: this.logData.url,
          status: statusCode + "-" + statusText,
          duration,
          response: this.response ? JSON.stringify(this.response) : "",
          param: body || "",
        });
      };

      this.addEventListener("load", handler("load"), false);
      this.addEventListener("error", handler("error"), false);
      this.addEventListener("abort", handler("abort"), false);

      this.logData.body = body;
      sendTracker.send(this.logData);
    }

    return oldSend.apply(this, arguments);
  };
}
