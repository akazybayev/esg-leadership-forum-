(function () {
  function boot() {
    var root = document.querySelector("[data-program-explorer]");
    if (!root || root.__programBound) return;
    root.__programBound = true;

    var fields = ["line", "room", "format", "access", "q"];
    var selects = {};
    fields.forEach(function (name) {
      selects[name] = root.querySelector('[data-filter="' + name + '"]');
    });
    var countEl = root.querySelector("[data-results]");
    var template = (countEl && countEl.dataset.resultsTemplate) || "COUNT";
    var dayLinks = Array.prototype.slice.call(root.querySelectorAll("[data-day-filter]"));

    function apply() {
      var active = dayLinks.filter(function (link) {
        return link.getAttribute("aria-pressed") === "true";
      })[0];
      var day = active ? active.dataset.dayFilter : "";
      var line = selects.line.value;
      var room = selects.room.value;
      var format = selects.format.value;
      var access = selects.access.value;
      var query = selects.q.value.trim().toLowerCase();
      var count = 0;
      Array.prototype.forEach.call(root.querySelectorAll("[data-session]"), function (card) {
        var visible =
          (!day || card.dataset.day === day) &&
          (!line || card.dataset.line === line) &&
          (!room || card.dataset.room === room) &&
          (!format || card.dataset.format === format) &&
          (!access || card.dataset.access === access) &&
          (!query || (card.dataset.title || "").indexOf(query) !== -1);
        card.hidden = !visible;
        if (visible) count += 1;
      });
      Array.prototype.forEach.call(root.querySelectorAll("[data-day-section]"), function (section) {
        var cards = section.querySelectorAll("[data-session]");
        var any = false;
        Array.prototype.forEach.call(cards, function (card) {
          if (!card.hidden) any = true;
        });
        section.hidden = !any;
      });
      if (countEl) countEl.textContent = template.replace("COUNT", String(count));
    }

    function writeParams() {
      var params = new URLSearchParams();
      var active = dayLinks.filter(function (link) {
        return link.getAttribute("aria-pressed") === "true";
      })[0];
      if (active) params.set("day", active.dataset.dayFilter);
      fields.forEach(function (name) {
        var value = selects[name].value.trim();
        if (value) params.set(name === "q" ? "q" : name, value);
      });
      var next = params.toString();
      history.replaceState(
        null,
        "",
        window.location.pathname + (next ? "?" + next : "") + window.location.hash,
      );
    }

    function setDay(value, scroll) {
      dayLinks.forEach(function (link) {
        link.setAttribute("aria-pressed", value && link.dataset.dayFilter === value ? "true" : "false");
      });
      apply();
      writeParams();
      if (scroll && value) {
        var behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
        var target = document.getElementById("program-day-" + value);
        if (target) target.scrollIntoView({ behavior: behavior, block: "start" });
      }
    }

    var params = new URLSearchParams(window.location.search);
    ["line", "room", "format", "access"].forEach(function (name) {
      var value = params.get(name);
      if (value) selects[name].value = value;
    });
    if (params.get("q")) selects.q.value = params.get("q");

    dayLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        var next = link.getAttribute("aria-pressed") === "true" ? "" : link.dataset.dayFilter;
        setDay(next, Boolean(next));
      });
    });
    fields.forEach(function (name) {
      selects[name].addEventListener("input", function () {
        apply();
        writeParams();
      });
    });

    var initialDay = params.get("day") || "";
    if (initialDay) {
      dayLinks.forEach(function (link) {
        link.setAttribute("aria-pressed", link.dataset.dayFilter === initialDay ? "true" : "false");
      });
    }
    apply();
    if (initialDay) {
      var behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
      window.requestAnimationFrame(function () {
        var target = document.getElementById("program-day-" + initialDay);
        if (target) target.scrollIntoView({ behavior: behavior, block: "start" });
      });
    }
  }

  window.__bootProgramExplorer = boot;
  if (window.__programExplorerRequested) {
    boot();
    return;
  }
  if (document.querySelector('script[src*="/_next/"]')) return;
  if (document.readyState === "complete") boot();
  else window.addEventListener("load", boot, { once: true });
})();
