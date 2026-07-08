// MCookieSteal - Genera el índice lateral (árbol de h2/h3) y resalta la sección activa.
(function () {
  var DIACRITICS = new RegExp(
    '[' + String.fromCharCode(0x0300) + '-' + String.fromCharCode(0x036f) + ']',
    'g'
  );

  function slugify(text) {
    return text
      .toString()
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(DIACRITICS, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var content = document.querySelector('.page-shell .container');
    var sidebar = document.getElementById('sidebar-toc');
    if (!content || !sidebar) return;

    var headings = content.querySelectorAll('h2, h3');
    if (!headings.length) return;

    var list = document.createElement('ul');
    var currentSubList = null;

    headings.forEach(function (heading) {
      if (!heading.id) heading.id = slugify(heading.textContent);

      var item = document.createElement('li');
      var link = document.createElement('a');
      link.href = '#' + heading.id;
      link.textContent = heading.textContent;
      item.appendChild(link);

      if (heading.tagName === 'H2') {
        list.appendChild(item);
        currentSubList = null;
      } else {
        if (!currentSubList) {
          currentSubList = document.createElement('ul');
          list.lastElementChild.appendChild(currentSubList);
        }
        currentSubList.appendChild(item);
      }
    });

    var title = document.createElement('p');
    title.className = 'sidebar-toc-title';
    title.textContent = 'En esta página';

    sidebar.appendChild(title);
    sidebar.appendChild(list);

    var links = sidebar.querySelectorAll('a');
    if (!('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = sidebar.querySelector('a[href="#' + entry.target.id + '"]');
          if (!link || !entry.isIntersecting) return;
          links.forEach(function (l) { l.classList.remove('active'); });
          link.classList.add('active');
        });
      },
      { rootMargin: '-15% 0px -70% 0px' }
    );

    headings.forEach(function (heading) { observer.observe(heading); });
  });
})();
