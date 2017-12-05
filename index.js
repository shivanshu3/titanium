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

var mainStack = [];

var compiledExpression = compileExpression(ast);

for (var i = 0; i < compiledExpression.terms.length; i++) {
	mainStack.push(compiledExpression.terms[i]);
}

function compileExpression(expr) {
	var compiledTerms = [];

	for (var i = 0; i < expr.terms.length; i++) {
		var term = expr.terms[i];

		var compiledTerm = compileTerm(term);
		compiledTerms.push(compiledTerm);
	}

	return {
		terms: compiledTerms
	};
}

function compileTerm(term) {
	if (term.type == 'literal') {
		return compileLiteral(term);
	} else if (term.type == 'operator') {
		return term;
	} else if (term.type == 'procedure') {
		return {
			type: term.type,
			expression: compileExpression(term.expression)
		};
	} else {
		throw 'Invalid term';
	}
}

function compileLiteral(term) {
	return term.value;
}

console.log(JSON.stringify(ast, null, '  '));
debugger;