console.log('Generating the parser...');

var fs = require('fs');
var path = require('path');
var peg = require('pegjs');

var grammarTxtPath = path.join(__dirname, '..', 'src', 'grammar.pegjs');
var grammarJsPath = path.join(__dirname, '..', 'out', 'grammar.js');

var grammar = fs.readFileSync(grammarTxtPath).toString();
var parserSource = peg.generate(grammar, {output:'source', format:'commonjs'});

fs.writeFileSync(grammarJsPath, parserSource);

console.log('Successfully generated the parser!');