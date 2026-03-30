# 前端监控
## 1.为什么要做监控？
- uv pv(是什么) 
- 监控性能
- 做埋点
## 2.监控的目的
### 2.1稳定性
- js错误
- 资源异常
- 接口错误
- 白屏
### 2.2用户体验
**web-vitals**
- TTFB(time to first byte)（首字节时间）        指的是浏览器发起第一个请求到数据返回第一个字节所消耗的时间，这个时间包含了网络请求，后端处理时间
- FP(First Paint)（首次绘制）                   首次绘制包括了用户自定义的背景绘制，他是将第一个像素点绘制到屏幕的时刻
- FCP(First Content Paint)（首次内容绘制）       首次内容绘制是浏览器将第一个dom渲染到屏幕的时间，可以是任何文本，图像，svg等的时间
- FMP(First Meaningful Paint)（首次有意义绘制）  首次有意义绘制是页面可用性的度量标准
- FID(First Input Delay)(首次输入延迟)           用户首次和页面交互与页面响应交互的时间
- 卡顿（超过50ms的任务）
### 2.3业务
- PV   page view 用户浏览器或者点击量
- UV   访问某个站点不同ip地址的人数
- 页面停留时间 
## 3.前端监控的流程
- 前端埋点
- 数据上报
- 分析和计算 将采集到数据进行加工和汇总
- 可视化展示
- 监控报警


浏览器加载过程

startTime - prompt for unload  - 重定向 - appCache  - dns  -  tcp网络连接  -  request - response - process -load
请求里面有requestStart requestEnd
响应里面有responseStart responseEnd   
所谓的TTFB time to first byte 网络请求耗时 就是 requestStart->responseStart
响应结束之后，执行unloadEventStart,unloadEventEnd
之后进入process截断
开始解析dom
domLoading（开始解析dom）  domInteractive  （dom解析结束）
之后进入（domContentLoadedEventStart）(DomContentLoaded开始)
这中间是domContentLoaded耗时
然后是domContentLoadedEventEnd(DomContentLoaded结束)
这中间是资源加载耗时（js和css）
domComplete（Dom和资源解析完毕）
loadEventStart(开始load回调函数)
loadEventEnd(load结束)

这些时间都是performance api里面


# 🚀 前端性能指标体系（面试高频）

## 🧱 核心加载指标

| 指标 | 全称 | 含义 | 优化手段 | 推荐值 |
|------|------|------|----------|--------|
| FP | First Paint | 首次绘制（页面开始有变化） | 减少阻塞资源 | - |
| FCP | First Contentful Paint | 首次内容绘制（文本/图片） | SSR、减少白屏时间 | < 1.8s |
| LCP | Largest Contentful Paint | 最大内容渲染时间 | 图片优化、CDN、懒加载 | < 2.5s |

---

## ⚡ 交互体验指标

| 指标 | 全称 | 含义 | 优化手段 | 推荐值 |
|------|------|------|----------|--------|
| FID | First Input Delay | 首次交互延迟 | 减少主线程阻塞、拆分JS | < 100ms |
| TTI | Time to Interactive | 完全可交互时间 | 代码分割、延迟加载 | < 5s |
| INP | Interaction to Next Paint | 所有交互响应性能（新标准） | 优化长任务、减少卡顿 | < 200ms |

---

## 📦 页面完整加载

| 指标 | 全称 | 含义 | 优化手段 | 推荐值 |
|------|------|------|----------|--------|
| DCL | DOMContentLoaded | DOM解析完成 | 减少HTML复杂度 | - |
| Load | Load Event | 所有资源加载完成 | 资源按需加载 | - |

---

## 📉 稳定性指标

| 指标 | 全称 | 含义 | 优化手段 | 推荐值 |
|------|------|------|----------|--------|
| CLS | Cumulative Layout Shift | 页面抖动 | 预留尺寸、避免动态插入 | < 0.1 |


4-4要重点看，里面知识点很多
浏览器渲染是先render，然后再paint的，里面先render了一份，一整块画上去

FMP 本质上是一个主观指标，不同页面对“有意义内容”的定义不同，因此浏览器很难标准化实现。
Chrome 已经废弃 FMP，推荐使用 LCP 来衡量页面主要内容加载。
在实际项目中，如果需要类似 FMP，可以通过 Element Timing API 或手动埋点来定义关键元素渲染时间。
h1.setAttribute('elementtiming',meaningful)
用户行为埋点
上报策略（节流 / 批量）


最核心的指标
FP FCP FMP LCP CLS INP(FID)