const headingRegExp = /^([#]{1,6})[ ](.*)$/; /* ## heading */
const unorderedListRegExp = /^[-][ ](.*)$/g; /* - unordered list */
const orderedListRegExp = /^\d+[.][ ](.*)$/g; /* 1. orderedList */
const blockquoteRegExp = /^[>][ ](.*)$/g; /* > text */
const linkRegExp = /\[([^\[])+\]\(([^\(])+\)/g; /* [textl](url) */
const boldRegExp = /[*][*]/g; /* **bold text** */
const italicRegExp = /([^\\]{0,1})_/g; /* _italic text_ */

function parseHeadings(line) {
  return line.match(headingRegExp) ?
    line.replace(headingRegExp, ("=".repeat(RegExp.$1.length)) + RegExp.$2 + ("=".repeat(RegExp.$1.length))) :
    line
}

function parseUnorderedList(line) {
  return line.match(/^[-][ ](.*)$/g) ?
    '*' + line.slice(1, line.length) :
    line
}

function parseOrderedList(line) {
  return line.match(/^\d+[.][ ](.*)$/g) ?
    '#' + line.slice(2, line.length) :
    line
}

function parseBlockqoute(line) {
  return line.match(/^[>][ ](.*)$/g) ?
    '<blockquote>' + line.slice(2, line.length) + '</blockquote>' :
    line
}

// function parseLink(line) {
//   const countLinks = line.match(new RegExp(linkRegExp, 'g'))
//   if (!countLinks) {
//     return line
//   } else {
//     for (let i = 0; i < countLinks.length; i++) {
//       let firstSymbolOfLink = line.search(new RegExp(linkRegExp, 'i'))
//
//       let text = ''
//       while (line[++firstSymbolOfLink] !== ']') { /* find text */
//         text += line[firstSymbolOfLink]
//       }
//
//       let url = ''
//       ++firstSymbolOfLink;
//       while (line[++firstSymbolOfLink] !== ')') { /* find url */
//         url += line[firstSymbolOfLink]
//       }
//
//       line = line.replace(linkRegExp, `[${url} ${text}]`)
//     }
//     return line
//   }
// };
function parseLink(line) {
  const countLinks = line.match(new RegExp(linkRegExp, 'g'))
  if (!countLinks) {
    return line
  } else {
    for (let i = 0; i < countLinks.length; i++) {
      let firstSymbolOfLink = line.search(new RegExp(linkRegExp, 'i'))

      let text = ''
      while (line[++firstSymbolOfLink] !== ']') { /* find text */
        text += line[firstSymbolOfLink]
      }

      let url = ''
      ++firstSymbolOfLink;
      while (line[++firstSymbolOfLink] !== ')') { /* find url */
        url += line[firstSymbolOfLink]
      }

      line = line.replace(linkRegExp, `[${url} ${text}]`)
    }
    return line
  }
};

function parseBoldStyle(line) {
  return line.replace(boldRegExp, `'''`)
}

function parseItalic(line) {
  return line
    .replace(italicRegExp, `$1''`) /* first take `_` in markdown meanings and translate it to '' and '' */
    .replace(/\\[_]/g, '_') /* then take all simple symbol `_` who is screened and write it without `\` */
}

module.exports = text => text.split('\n')
  .map(parseHeadings)
  .map(parseUnorderedList)
  .map(parseOrderedList)
  .map(parseBlockqoute)
  .map(parseLink)
  .map(parseBoldStyle)
  .map(parseItalic)
  .join('\n')
