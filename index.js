var fs = require('fs');
var parser = require('./grammar.js');

var testInput = fs.readFileSync('./test_input').toString();

var foo = parser.parse(testInput);
console.log(JSON.stringify(foo, null, '  '));
debugger;