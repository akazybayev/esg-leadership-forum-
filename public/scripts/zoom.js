(function () {
  var dialog = document.querySelector("[data-zoom-dialog]");
  if (!dialog || dialog.dataset.bound) return;
  dialog.dataset.bound = "1";
  var frame = null;

  function open(img) {
    var src = img.currentSrc || img.getAttribute("src");
    if (!src) return;
    if (!frame) {
      frame = document.createElement("img");
      frame.setAttribute("data-zoom-frame", "");
      dialog.appendChild(frame);
    }
    frame.alt = img.getAttribute("alt") || "";
    frame.src = src;
    if (typeof dialog.showModal === "function") dialog.showModal();
    dialog.scrollTop = 0;
    dialog.scrollLeft = 0;
  }

  document.addEventListener("click", function (event) {
    var img = event.target.closest("[data-zoom]");
    if (!img || dialog.contains(img)) return;
    event.preventDefault();
    open(img);
  });

  dialog.querySelector("[data-zoom-close]").addEventListener("click", function () {
    dialog.close();
  });

  dialog.addEventListener("close", function () {
    if (frame) {
      frame.remove();
      frame = null;
    }
  });
})();
