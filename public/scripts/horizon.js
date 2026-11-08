(function () {
  var root = document.querySelector("[data-countdown]");
  if (!root) return;
  var start = new Date(root.getAttribute("data-countdown")).getTime();
  var early = new Date(root.getAttribute("data-early")).getTime();
  var dayLabel = root.getAttribute("data-day-short") || "";
  var units = {};
  root.querySelectorAll("[data-unit]").forEach(function (node) {
    units[node.getAttribute("data-unit")] = node;
  });
  var earlyNode = document.querySelector("[data-early-left]");

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function tick() {
    var now = Date.now();
    var left = Math.max(0, start - now);
    if (units.d) units.d.textContent = String(Math.floor(left / 86400000));
    if (units.h) units.h.textContent = pad(Math.floor(left / 3600000) % 24);
    if (units.m) units.m.textContent = pad(Math.floor(left / 60000) % 60);
    if (units.s) units.s.textContent = pad(Math.floor(left / 1000) % 60);
    if (earlyNode && !Number.isNaN(early)) {
      var remain = Math.max(0, early - now);
      earlyNode.textContent =
        Math.floor(remain / 86400000) +
        " " +
        dayLabel +
        " " +
        pad(Math.floor(remain / 3600000) % 24) +
        ":" +
        pad(Math.floor(remain / 60000) % 60);
    }
  }

  tick();
  window.setInterval(tick, 1000);
})();
