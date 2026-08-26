// Decorative brand geometry — NOT icons (those live in icons.js). The dashed
// diamond lattice and the diamond field come straight from the brandbook's
// pattern sheet; the ghost mark is the logo's circular geometry blown up as
// a background texture. All draw in currentColor so surfaces tint them.

export default {
  // Dashed lattice with diamond nodes — brandbook pattern, bottom-left sheet.
  diamondGrid:
    '<svg width="480" height="480" viewBox="0 0 480 480" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<g stroke="currentColor" stroke-width="1" stroke-dasharray="5 7" opacity=".55">' +
    '<path d="M0 80h480M0 240h480M0 400h480M80 0v480M240 0v480M400 0v480"/>' +
    '<path d="M80 80 240 240 400 400M400 80 240 240 80 400M240 80 400 240M240 80 80 240M80 240l160 160M400 240 240 400"/>' +
    '</g>' +
    '<g fill="currentColor">' +
    '<path d="M80 68l12 12-12 12-12-12zM240 68l12 12-12 12-12-12zM400 68l12 12-12 12-12-12z"/>' +
    '<path d="M80 228l12 12-12 12-12-12zM240 228l12 12-12 12-12-12zM400 228l12 12-12 12-12-12z"/>' +
    '<path d="M80 388l12 12-12 12-12-12zM240 388l12 12-12 12-12-12zM400 388l12 12-12 12-12-12z"/>' +
    '</g>' +
    '</svg>',

  // Scattered diamond field — the denser brandbook pattern, thinned out.
  diamondField:
    '<svg width="360" height="360" viewBox="0 0 360 360" fill="currentColor" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M60 44l16 16-16 16-16-16z" opacity=".8"/>' +
    '<path d="M180 20l10 10-10 10-10-10z" opacity=".4"/>' +
    '<path d="M300 60l22 22-22 22-22-22z" opacity=".9"/>' +
    '<path d="M110 150l12 12-12 12-12-12z" opacity=".5"/>' +
    '<path d="M240 130l16 16-16 16-16-16z" opacity=".7"/>' +
    '<path d="M40 250l10 10-10 10-10-10z" opacity=".45"/>' +
    '<path d="M170 240l20 20-20 20-20-20z" opacity=".85"/>' +
    '<path d="M320 230l12 12-12 12-12-12z" opacity=".5"/>' +
    '<path d="M100 330l14 14-14 14-14-14z" opacity=".6"/>' +
    '<path d="M260 320l10 10-10 10-10-10z" opacity=".4"/>' +
    '</svg>'
}
