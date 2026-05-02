// site-components.js
// Shared header and footer for all pages.
// Edit these functions ONCE to update every page.

function siteHeader(options) {
  var cls = options && options.logoLink ? ' class="' + options.logoLink + '"' : '';
  var logo = '<a href="index.html"' + cls + '>Anvar Nabili</a>';

  return ''
    + '<header>\n'
    + '  <nav class="navbar">\n'
    + '    <div class="logo">' + logo + '</div>\n'
    + '    <ul class="nav-links">\n'
    + '      <li><a href="index.html">Home</a></li>\n'
    + '      <li><a href="about.html">About</a></li>\n'
    + '      <li><a href="projects.html">Projects</a></li>\n'
    + '      <li><a href="https://www.linkedin.com/in/anvar-nabili-9962a3397" target="_blank">LinkedIn</a></li>\n'
    + '      <li><a href="https://github.com/ANVAR-99" target="_blank">GitHub</a></li>\n'
    + '    </ul>\n'
    + '  </nav>\n'
    + '</header>';
}

function siteFooter() {
  return ''
    + '<footer class="site-footer">\n'
    + '  <div class="site-footer-inner">\n'
    + '    <div class="site-footer-brand">\n'
    + '      <p class="site-footer-name">Anvar Nabili</p>\n'
    + '      <p class="site-footer-tagline">Mathematics student at ADA University.</p>\n'
    + '      <div class="site-footer-columns">\n'
    + '        <nav class="site-footer-nav" aria-label="Footer navigation">\n'
    + '          <ul>\n'
    + '            <li><a href="index.html">Home</a></li>\n'
    + '            <li><a href="about.html">About</a></li>\n'
    + '            <li><a href="projects.html">Projects</a></li>\n'
    + '            <li><a href="minesweeper.html">Minesweeper</a></li>\n'
    + '          </ul>\n'
    + '        </nav>\n'
    + '        <div class="site-footer-vrule" aria-hidden="true"></div>\n'
    + '        <nav class="site-footer-external" aria-label="Profiles and repositories">\n'
    + '          <ul>\n'
    + '            <li><a href="https://www.linkedin.com/in/anvar-nabili-9962a3397" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>\n'
    + '            <li><a href="https://github.com/ANVAR-99" target="_blank" rel="noopener noreferrer">GitHub</a></li>\n'
    + '            <li><a href="https://www.codecademy.com/profiles/ANVAR_99" target="_blank" rel="noopener noreferrer">Codecademy profile</a></li>\n'
    + '            <li><a href="https://github.com/ANVAR-99/ANVAR-99.github.io" target="_blank" rel="noopener noreferrer">Website repository</a></li>\n'
    + '          </ul>\n'
    + '        </nav>\n'
    + '      </div>\n'
    + '    </div>\n'
    + '    <p class="site-footer-copy">&copy; 2026 Anvar Nabili. All rights reserved.</p>\n'
    + '  </div>\n'
    + '</footer>';
}

// Pages call document.write(siteHeader(...)) and document.write(siteFooter())
// inline where the header/footer should appear — no blank flash.
