import { SendTracker } from "../utils/tracker";

const sendTracker = new SendTracker();

function getNavigationEntry() {
  const entries = performance.getEntriesByType("navigation");
  return entries.length ? entries[0] : null;
}

function duration(start, end) {
  return Math.max(end - start, 0);
}

function collectTiming() {
  const navigation = getNavigationEntry();

  if (!navigation) return;

  const metrics = {
    kind: "experience",
    type: "timing",

    // TCP
    connectTime: duration(navigation.connectStart, navigation.connectEnd),

    // TTFB
    ttfbTime: duration(navigation.requestStart, navigation.responseStart),

    // 下载
    responseTime: duration(navigation.responseStart, navigation.responseEnd),

    // DOM 解析
    parseDOMTime: duration(navigation.responseEnd, navigation.domInteractive),

    // DOMContentLoaded
    domContentLoadedTime: duration(
      navigation.domContentLoadedEventStart,
      navigation.domContentLoadedEventEnd,
    ),

    // 可交互时间（近似）
    timeToInteractive: duration(
      navigation.fetchStart,
      navigation.domContentLoadedEventEnd,
    ),

    // 完整加载
    loadTime: duration(navigation.fetchStart, navigation.loadEventEnd),
  };

  sendTracker.send(metrics);
}

export function timing() {
  // 文档已经加载完
  if (document.readyState === "complete") {
    collectTiming();
  } else {
    window.addEventListener("load", () => {
      // 确保 timing 完整
      requestAnimationFrame(() => {
        setTimeout(collectTiming, 0);
      });
    });
  }
}
// 通过performance api
// export function timing() {
//   const observer = new PerformanceObserver((list) => {
//     const entries = list.getEntries();
//     const navigation = entries[0];

//     if (!navigation) return;

//     const metrics = {
//       kind: "experience",
//       type: "timing",

//       connectTime: navigation.connectEnd - navigation.connectStart,
//       ttfbTime: navigation.responseStart - navigation.requestStart,
//       responseTime: navigation.responseEnd - navigation.responseStart,
//       parseDOMTime: navigation.domInteractive - navigation.responseEnd,
//       domContentLoadedTime:
//         navigation.domContentLoadedEventEnd -
//         navigation.domContentLoadedEventStart,
//       loadTime: navigation.loadEventEnd - navigation.fetchStart,
//     };

//     sendTracker.send(metrics);
//   });

//   observer.observe({
//     type: "navigation",
//     buffered: true, // ⭐关键：能拿到历史数据
//   });
// }
