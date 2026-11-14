/* Splash controller: a fixed 3-second sequence, identical on every device and connection (nothing here waits on the
   network). Runs only when the head script added html.splash-active (first homepage visit of a session). */
(function () {
  var d = document, h = d.documentElement, el = d.getElementById("fte-splash"), root = d.getElementById("root");
  if (!el || !root || !h.classList.contains("splash-active")) return;
  h.setAttribute("data-fs", "1"); // tells the head script's failsafe that this controller is running

  var fill = el.querySelector(".fs-fill"), live = el.querySelector(".fs-live");
  var rm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var TOTAL = 3000, EXIT = rm ? 300 : 700, leaving = false;
  var go = function (fn, ms) { return setTimeout(fn, ms); };

  function vh() { h.style.setProperty("--vh", innerHeight * 0.01 + "px"); }
  vh(); addEventListener("resize", vh);

  // Page behind the splash: not focusable, hidden from assistive tech. It stays rendered for crawlers and LCP.
  root.setAttribute("inert", ""); root.setAttribute("aria-hidden", "true");
  go(function () { live.textContent = "Loading Fraternity Engineering"; }, 50);

  function exit() {
    if (leaving) return;
    leaving = true;
    live.textContent = "Ready";
    el.classList.add("is-leaving");
    go(function () { h.classList.add("splash-reveal"); }, rm ? 0 : 300); // hero text starts rising mid-exit
    go(finish, EXIT);
  }

  function finish() {
    el.remove();
    root.removeAttribute("inert"); root.removeAttribute("aria-hidden");
    h.classList.remove("splash-active", "splash-reveal");
    h.style.removeProperty("--vh");
    removeEventListener("resize", vh); d.removeEventListener("keydown", onKey);
    try { sessionStorage.setItem("fte_splash_seen", "1"); } catch (e) {}
    dispatchEvent(new CustomEvent("splash:done"));
  }

  function onKey(e) { if (e.key === "Escape") exit(); }
  d.addEventListener("keydown", onKey);
  el.querySelector(".fs-skip").addEventListener("click", exit);

  // The line fills linearly while the splash is on screen; the exit then runs so everything is gone at TOTAL ms.
  var show = TOTAL - EXIT;
  fill.style.transitionDuration = show + "ms";
  requestAnimationFrame(function () { requestAnimationFrame(function () { fill.style.transform = "scaleX(1)"; }); });
  go(exit, show);
})();
