const fs = require('fs');
const path = require('path');
const parseTpl = require('../lib/parse-tpl');

const tplStr = fs.readFileSync(path.resolve(__dirname, './test-1.nj')).toString();
console.log(parseTpl(tplStr));
