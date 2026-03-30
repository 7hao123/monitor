import { SendTracker } from "../utils/tracker";

const sendTracker = new SendTracker();

export function paint() {
  const metrics = {
    fp: 0,
    fcp: 0,
    lcp: 0,
  };

  let reported = false;

  function report() {
    if (reported) return;
    reported = true;

    sendTracker.send({
      kind: "experience",
      type: "paint",
      ...metrics,
    });
  }

  /**
   * =========================
   * FP / FCP
   * =========================
   */
  try {
    const paintObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === "first-paint") {
          metrics.fp = entry.startTime;
        }

        if (entry.name === "first-contentful-paint") {
          metrics.fcp = entry.startTime;
        }
      }
    });

    paintObserver.observe({
      type: "paint",
      buffered: true,
    });
  } catch (e) {
    // fallback（极少用到）
    const entries = performance.getEntriesByType("paint");
    entries.forEach((entry) => {
      if (entry.name === "first-paint") {
        metrics.fp = entry.startTime;
      }
      if (entry.name === "first-contentful-paint") {
        metrics.fcp = entry.startTime;
      }
    });
  }

  /**
   * =========================
   * LCP（核心优化点🔥）
   * =========================
   */
  let lcpObserver;

  try {
    lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();

      // 👉 永远取最后一个（最新的）
      const lastEntry = entries[entries.length - 1];

      if (lastEntry) {
        metrics.lcp = lastEntry.startTime;
      }
    });

    lcpObserver.observe({
      type: "largest-contentful-paint",
      buffered: true,
    });
  } catch (e) {}

  /**
   * =========================
   * 页面隐藏时 -> 上报最终 LCP
   * =========================
   */
  function onHidden() {
    if (lcpObserver) {
      lcpObserver.takeRecords(); // ⭐拿最后一次
      lcpObserver.disconnect();
    }
    report();
  }

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      onHidden();
    }
  });

  window.addEventListener("pagehide", onHidden);

  /**
   * =========================
   * 兜底（防止不触发 hidden）
   * =========================
   */
  window.addEventListener(
    "load",
    () => {
      setTimeout(() => {
        report();
      }, 3000);
    },
    { once: true },
  );
}
