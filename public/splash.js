/* Splash controller. Runs only when the head script added html.splash-active (first homepage visit of a session). */
(function () {
  var d = document, h = d.documentElement, el = d.getElementById("fte-splash"), root = d.getElementById("root");
  if (!el || !root || !h.classList.contains("splash-active")) return;
  h.setAttribute("data-fs", "1"); // tells the head script's failsafe that this controller is running

  var fill = el.querySelector(".fs-fill"), live = el.querySelector(".fs-live"), bg = el.querySelector(".fs-bg");
  var rm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var t0 = Date.now(), pct = 0, minDone = false, full = false, leaving = false, video, vTimer;
  var go = function (fn, ms) { return setTimeout(fn, ms); };
  var settle = function (p) { return Promise.resolve(p).catch(function () {}); };

  function vh() { h.style.setProperty("--vh", innerHeight * 0.01 + "px"); }
  vh(); addEventListener("resize", vh);

  // Page behind the splash: not focusable, hidden from assistive tech. It stays rendered for crawlers and LCP.
  root.setAttribute("inert", ""); root.setAttribute("aria-hidden", "true");
  go(function () { live.textContent = "Loading Fraternity Engineering"; }, 50);

  function progress(p) {
    if (p <= pct) return;
    pct = p;
    fill.style.transform = "scaleX(" + p / 100 + ")";
    if (p === 100) go(function () { full = true; tryExit(); }, 300); // let the line finish drawing
  }
  function tryExit() { if (full && minDone) exit(); }

  function dropVideo() {
    clearTimeout(vTimer);
    if (!video) return;
    video.pause(); video.removeAttribute("src");
    while (video.firstChild) video.removeChild(video.firstChild);
    video.load(); video.remove(); video = null;
  }

  function exit() {
    if (leaving) return;
    leaving = true;
    progress(100);
    live.textContent = "Ready";
    el.classList.add("is-leaving");
    go(function () { h.classList.add("splash-reveal"); }, rm ? 0 : 300); // hero text starts rising mid-exit
    go(finish, rm ? 300 : 700);
  }

  function finish() {
    dropVideo();
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

  // Real progress: logo shown 25, fonts 55, hero image decoded 85, all of it 100.
  var logo = el.querySelector(".fs-logo"), hero = d.querySelector("#hero img");
  var pLogo = settle(logo.decode && logo.decode()).then(function () {
    return new Promise(function (r) { go(r, Math.max(0, 200 - (Date.now() - t0))); });
  }).then(function () { progress(25); });
  var pFonts = settle(d.fonts && d.fonts.ready).then(function () { progress(55); });
  var pHero = settle(hero && hero.decode && hero.decode()).then(function () { progress(85); });
  Promise.all([pLogo, pFonts, pHero]).then(function () { progress(100); });

  go(function () { minDone = true; tryExit(); }, 1400);
  go(function () { progress(100); exit(); }, 3500); // hard limit

  // Video is an enhancement: decided before the element exists, never needed for the exit.
  var c = navigator.connection || {};
  var useVideo = !rm && !c.saveData && !/^(slow-2g|2g|3g)$/.test(c.effectiveType || "") && d.visibilityState === "visible";
  if (useVideo) go(startVideo, 300);

  function startVideo() {
    if (leaving) return;
    var base = "/assets/splash/splash-" + (innerWidth <= 767 || innerHeight > innerWidth ? "540" : "1280");
    var v = video = d.createElement("video");
    v.muted = true; v.defaultMuted = true; v.loop = false;
    v.setAttribute("muted", ""); v.setAttribute("playsinline", ""); v.setAttribute("webkit-playsinline", "");
    v.setAttribute("autoplay", ""); v.setAttribute("preload", "auto");
    v.setAttribute("disablepictureinpicture", ""); v.setAttribute("disableremoteplayback", "");
    v.setAttribute("controlslist", "nodownload nofullscreen noremoteplayback");
    v.setAttribute("tabindex", "-1"); v.setAttribute("aria-hidden", "true");
    v.poster = base.replace("splash-540", "splash-poster-mobile").replace("splash-1280", "splash-poster") + ".webp";
    [["webm", "video/webm; codecs=vp9"], ["mp4", "video/mp4"]].forEach(function (s) {
      var src = d.createElement("source"); src.src = base + "." + s[0]; src.type = s[1]; v.appendChild(src);
    });
    v.addEventListener("error", dropVideo); v.addEventListener("stalled", dropVideo);
    v.addEventListener("canplaythrough", function () {
      clearTimeout(vTimer);
      try {
        var p = v.play();
        if (p && p.then) p.then(function () { v.classList.add("is-on"); }, dropVideo);
        else v.classList.add("is-on");
      } catch (e) { dropVideo(); }
    }, { once: true });
    vTimer = go(function () { if (!v.classList.contains("is-on")) dropVideo(); }, 1500);
    bg.appendChild(v);
  }
})();
