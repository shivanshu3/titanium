var fs = require('fs');
var peg = require('pegjs');

var grammar = fs.readFileSync('./grammar.txt').toString();
var testInput = fs.readFileSync('./test_input').toString();
var parser = peg.generate(grammar);

var foo = parser.parse(testInput);

console.log(JSON.stringify(foo, null, '  '));
debugger;