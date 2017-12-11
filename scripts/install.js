console.log('Generating the parser...');

var fs = require('fs');
var path = require('path');
var peg = require('pegjs');

var grammarTxtPath = path.join(__dirname, '..', 'grammar.txt');
var grammarJsPath = path.join(__dirname, '..', 'grammar.js');

var grammar = fs.readFileSync(grammarTxtPath).toString();
var parserSource = peg.generate(grammar, {output:'source', format:'commonjs'});

fs.writeFileSync(grammarJsPath, parserSource);

console.log('Successfully generated the parser!');