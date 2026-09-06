(function () {
  "use strict";

  var SCRIPT = document.currentScript;
  if (!SCRIPT) return;

  var src = SCRIPT.getAttribute("data-src") || SCRIPT.getAttribute("src");
  if (!src) return;

  var base = new URL(src, window.location.href);
  var calculator = SCRIPT.getAttribute("data-calculator") || "metal-weight";
  if (!/\/embed\//.test(base.pathname)) {
    base.pathname = "/embed/" + calculator;
  }

  var params = ["theme", "family", "designation", "length", "quantity"];
  params.forEach(function (name) {
    var value = SCRIPT.getAttribute("data-" + name);
    if (value !== null && value !== "") base.searchParams.set(name, value);
  });

  var iframe = document.createElement("iframe");
  iframe.src = base.toString();
  iframe.title = SCRIPT.getAttribute("data-title") || "AnyTools calculator";
  iframe.loading = "lazy";
  iframe.style.width = "100%";
  iframe.style.height = SCRIPT.getAttribute("data-height") || "560px";
  iframe.style.minHeight = "320px";
  iframe.style.border = "0";
  iframe.style.display = "block";
  iframe.style.borderRadius = SCRIPT.getAttribute("data-radius") || "16px";
  iframe.setAttribute("loading", "lazy");

  SCRIPT.parentNode.insertBefore(iframe, SCRIPT.nextSibling);

  window.addEventListener("message", function (event) {
    if (event.source !== iframe.contentWindow) return;
    if (event.origin !== base.origin) return;
    var data = event.data || {};
    if (data.type !== "anytools-resize") return;

    var height = Number(data.height);
    if (!Number.isFinite(height)) return;
    iframe.style.height = Math.max(320, Math.ceil(height)) + "px";
  });
})();
