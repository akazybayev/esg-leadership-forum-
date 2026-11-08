(function () {
  function reduced() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function openFromHash() {
    var id = location.hash.replace(/^#/, "");
    if (id.indexOf("topic-") !== 0) return;
    var card = document.getElementById(id);
    if (!card || card.tagName !== "DETAILS") return;
    card.open = true;
    card.scrollIntoView({
      behavior: reduced() ? "auto" : "smooth",
      block: "start",
    });
  }

  function bind() {
    var cards = document.querySelectorAll("details.topic-details");
    cards.forEach(function (card) {
      if (card.dataset.topicBound === "true") return;
      card.dataset.topicBound = "true";
      card.addEventListener("toggle", function () {
        var hash = "#" + card.id;
        if (card.open) {
          history.replaceState(null, "", location.pathname + location.search + hash);
          return;
        }
        if (location.hash === hash) {
          history.replaceState(null, "", location.pathname + location.search);
        }
      });
    });
    openFromHash();
  }

  document.addEventListener("keydown", function (event) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    var summaries = Array.prototype.slice.call(
      document.querySelectorAll("details.topic-details > summary"),
    );
    var index = summaries.indexOf(document.activeElement);
    if (index < 0) return;
    event.preventDefault();
    var next =
      event.key === "ArrowDown"
        ? (index + 1) % summaries.length
        : (index - 1 + summaries.length) % summaries.length;
    summaries[next].focus();
  });

  window.addEventListener("hashchange", openFromHash);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind);
  } else {
    bind();
  }
})();
