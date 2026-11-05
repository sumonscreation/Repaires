

(function () {
  var root = document.documentElement;
  var theme = null, dir = null;
  try { theme = localStorage.getItem("fixumi-theme"); dir = localStorage.getItem("fixumi-dir"); } catch (e) {}
  if (theme === "system") theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  else if (theme !== "dark") theme = "light";
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  if (dir === "rtl" || dir === "ltr") root.dir = dir;
})();

/*==============================================
 Page Transition: ignore a skipped fade
================================================*/

(function () {
  var quiet = function (e) {
    var vt = e.viewTransition;
    if (!vt) return;
    var noop = function () {};
    vt.ready.catch(noop);
    vt.finished.catch(noop);
    if (vt.updateCallbackDone) vt.updateCallbackDone.catch(noop);
  };
  addEventListener("pagereveal", quiet);
  addEventListener("pageswap", quiet);
})();
