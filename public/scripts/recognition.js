(function () {
  var dialog = document.querySelector("[data-recognition-dialog]");
  if (!dialog || dialog.dataset.bound) return;
  dialog.dataset.bound = "1";
  var frame = dialog.querySelector("[data-recognition-frame]");
  var caption = dialog.querySelector("[data-recognition-caption]");
  var prev = dialog.querySelector("[data-recognition-prev]");
  var next = dialog.querySelector("[data-recognition-next]");
  var items = [];
  var index = 0;

  function show(i) {
    if (!items.length) return;
    index = (i + items.length) % items.length;
    var item = items[index];
    frame.src = item.src;
    frame.alt = item.alt;
    caption.textContent = item.caption;
    var many = items.length > 1;
    prev.hidden = !many;
    next.hidden = !many;
  }

  document.querySelectorAll("[data-recognition-open]").forEach(function (button) {
    button.addEventListener("click", function () {
      var gallery = button.getAttribute("data-gallery");
      items = Array.prototype.map.call(
        document.querySelectorAll('[data-recognition-open][data-gallery="' + gallery + '"]'),
        function (node) {
          return {
            src: node.getAttribute("data-src"),
            alt: node.getAttribute("data-alt") || "",
            caption: node.getAttribute("data-caption") || "",
          };
        },
      );
      show(Number(button.getAttribute("data-index")) || 0);
      if (typeof dialog.showModal === "function") dialog.showModal();
    });
  });

  prev.addEventListener("click", function () {
    show(index - 1);
  });
  next.addEventListener("click", function () {
    show(index + 1);
  });
  dialog.querySelector("[data-recognition-close]").addEventListener("click", function () {
    dialog.close();
  });
  dialog.addEventListener("click", function (event) {
    var rect = dialog.getBoundingClientRect();
    var inside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;
    if (!inside) dialog.close();
  });
  dialog.addEventListener("close", function () {
    frame.removeAttribute("src");
    frame.alt = "";
  });
})();
