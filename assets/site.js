// 首頁清單：依 data/notes.js 的 COURSES 與 NOTES 產生
(function () {
  var root = document.getElementById("courses");
  if (!root || !window.COURSES || !window.NOTES) return;

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text) node.textContent = text;
    return node;
  }

  window.COURSES.forEach(function (course) {
    var section = el("section", "course");
    section.appendChild(el("h2", null, course.name));
    section.appendChild(el("p", "course-desc", course.description));

    var notes = window.NOTES.filter(function (n) { return n.course === course.slug; })
      .sort(function (a, b) { return a.file.localeCompare(b.file); });

    if (notes.length === 0) {
      section.appendChild(el("p", "empty", "尚無筆記。"));
    } else {
      var list = el("ul", "note-list");
      notes.forEach(function (n) {
        var li = el("li");
        var a = el("a", "note-card");
        a.href = "notes/" + n.course + "/" + n.file;
        a.appendChild(el("h3", null, n.title));
        a.appendChild(el("p", null, n.summary));
        var meta = el("div", "meta");
        meta.appendChild(el("time", null, n.date));
        (n.tags || []).forEach(function (t) { meta.appendChild(el("span", "tag", t)); });
        a.appendChild(meta);
        li.appendChild(a);
        list.appendChild(li);
      });
      section.appendChild(list);
    }
    root.appendChild(section);
  });

  var count = document.getElementById("note-count");
  if (count) count.textContent = window.NOTES.length;
})();
