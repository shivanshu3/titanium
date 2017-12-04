var fs = require('fs');
var parser = require('./grammar.js');

var testInput = fs.readFileSync('./test_input').toString();

function stringifyErrorLocation(location) {
	function singleLocation (singleLocation) {
		return 'L:' + singleLocation.line + ' C:' + singleLocation.column;
	};
	return singleLocation(location.start) + ' - ' + singleLocation(location.end);
}

var ast;
try {
	ast = parser.parse(testInput);
} catch (ex) {
	if (ex.name == 'SyntaxError') {
		console.error('SyntaxError: ' + ex.message);
		console.error(stringifyErrorLocation(ex.location));
	} else {
		console.error('Unknown Error!');
		throw ex;
	}
}

console.log(JSON.stringify(ast, null, '  '));
debugger;