(function () {
  var saved = localStorage.getItem('theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
  function current() {
    return document.documentElement.getAttribute('data-theme') ||
      (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }
  function update(t) {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
    var b = document.getElementById('theme-toggle');
    if (b) b.textContent = '[' + (t === 'dark' ? 'light' : 'dark') + ']';
  }
  window.toggleTheme = function () { update(current() === 'dark' ? 'light' : 'dark'); };
  document.addEventListener('DOMContentLoaded', function () {
    var b = document.getElementById('theme-toggle');
    if (b) b.textContent = '[' + (current() === 'dark' ? 'light' : 'dark') + ']';
  });
})();
