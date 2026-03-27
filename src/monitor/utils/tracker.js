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
  }

  send(data) {
    const xhr = new XMLHttpRequest();
    const log = { ...getExtraData(), ...data };

    for (let key in log) {
      if (typeof log[key] === "number") {
        log[key] = log[key].toString();
      }
    }

    console.log("send tracker log", log);

    const body = JSON.stringify(log);

    xhr.open("POST", this.url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("x-log-apiversion", "0.6.0");
    xhr.setRequestHeader("x-log-bodyrawsize", body.length);
    xhr.send(body);

    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        console.log("tracker send success", this.responseText);
      } else {
        console.error("tracker send failed", this.statusText);
      }
    };

    xhr.onerror = function () {
      console.error("tracker send failed", this.statusText);
    };
  }
}
