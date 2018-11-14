const headingRegExp = /^([#]{1,6})[ ](.*)$/; /* ## heading */
const unorderedListRegExp = /^[-][ ](.*)$/g; /* - unordered list */
const orderedListRegExp = /^\d+[.][ ](.*)$/g; /* 1. orderedList */
const blockquoteRegExp = /^[>][ ](.*)$/g; /* > text */
const linkRegExp = /\[([^\[]*)\]\(([^\(]*)\)/g; /* [textl](url) */
const boldRegExp = /[*][*]/g; /* **bold text** */
const italicRegExp = /([^\\]{0,1})_/g; /* _italic text_ */
const codeRegExp = /`([^\`]*)`/g;

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

function parseCode(line) {
  return line.replace(codeRegExp, `<code>$1</code>`)
}

/* must go before parseBold and parseItalic */
function parseBoldAndItalic(line) {
  return line.replace(/[\*]{3}([^\*]*)[\*]{3}/g, `'''''$1'''''`)
}

function parseBlockqoute(line) {
  return line.match(/^[>][ ](.*)$/g) ?
    '<blockquote>' + line.slice(2, line.length) + '</blockquote>' :
    line
}

function parseLink(line) {
  return line.replace(linkRegExp, `[$2 $1]`); /* [textl](url) */
}

function parseBold(line) {
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
  .map(parseCode)
  .map(parseBlockqoute)
  .map(parseLink)
  .map(parseBoldAndItalic)
  .map(parseBold)
  .map(parseItalic)
  .join('\n')
