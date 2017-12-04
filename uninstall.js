console.log('Deleting grammar.js...');

var fs = require('fs');
var path = require('path');

var grammarJsPath = path.join(__dirname, 'grammar.js');

fs.unlinkSync(grammarJsPath);

console.log('Successfully deleted grammar.js!');