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

processExpression(compiledExpression);

function processExpression(expr) {
	for (var i = 0; i < expr.terms.length; i++) {
		var term = expr.terms[i];
		if (!termIsOperator(term)) {
			mainStack.push(expr);
		} else {
			operate(mainStack, term);
		}
	}
}

function operate(stack, term) {
	console.log(term.opType + ' operating...');
}

/**
 * Takes a compiled term as input
 */
function termIsLiteral(term) {
	if (typeof term == 'object') {
		if (term instanceof RegExp) {
			return true;
		} else {
			return false;
		}
	} else {
		return true;
	}
}

function termIsOperator(term) {
	if (termIsLiteral(term)) {
		return false;
	}

	if (term.type == 'operator') {
		return true;
	}

	return false;
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