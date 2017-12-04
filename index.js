var fs = require('fs');
var peg = require('pegjs');

var grammar = fs.readFileSync('./grammar.txt').toString();
var parser = peg.generate(grammar);

var input =  '`sample`';
// input = '787';
var foo = parser.parse(input);

console.log(foo);
debugger;