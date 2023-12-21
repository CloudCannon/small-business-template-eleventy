const fs = require('fs')

const mainCSSFile = './_site/css/main.css'
const bookshopCSSFile = './_site/css/bookshop.css'
let mainCSS = fs.readFileSync(mainCSSFile, 'utf-8');
let bookshopCSS = fs.readFileSync(bookshopCSSFile, 'utf-8');

mainCSS += `\n\n ${bookshopCSS}`

fs.writeFileSync(mainCSSFile, mainCSS)