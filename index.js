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

// this is a hack to make operatorModules a global variable.
// it should not be tied to the exports object.
exports.operatorModules = {
	'+' : function(a, b) {
		return a + b;
	},
	'-' : function(a, b) {
		return a - b;
	},
	'*' : function(a, b) {
		return a * b;
	},
	'/' : function(a, b) {
		return a / b;
	},
	'>' : function(a, b) {
		return a > b;
	},
	'<' : function(a, b) {
		return a < b;
	},
	'>=' : function(a, b) {
		return a >= b;
	},
	'<=' : function(a, b) {
		return a <= b;
	},
	'==' : function(a, b) {
		return a == b;
	},
	'++' : function(a) {
		return a + 1;
	},
	'--' : function(a) {
		return a - 1;
	},
	'[]' : function(arr, index) {
		return arr[index];
	},
	'print' : function(x) {
		console.log(x);
	},
	'newarray' : function() {
		return [];
	},
	'push' : function(arr, element) {
		arr.push(element);
	},
	'map' : function(arr, func) {
		return arr.map(func);
	},
	'length' : function(arr) {
		return arr.length;
	}
};

// this is also a hack. should not be a part of the exports object:
exports.specialOperators = {
	'swap' : function(stack) {
		var a = stack.pop();
		var b = stack.pop();
		stack.push(a);
		stack.push(b);
	},
	'dup' : function(stack) {
		var a = stack.pop();
		stack.push(a);
		stack.push(a);
	},
	'if' : function(stack) {
		var mainBody = stack.pop().expression;
		var ifExpression = stack.pop().expression;
		processExpression(ifExpression, stack);
		var resultIfExpression = stack.pop();
		if (resultIfExpression) {
			processExpression(mainBody, stack);
		}
	},
	'ifelse' : function(stack) {
		var falseBody = stack.pop().expression;
		var trueBody = stack.pop().expression;
		var ifExpression = stack.pop().expression;
		processExpression(ifExpression, stack);
		var resultIfExpression = stack.pop();
		if (resultIfExpression) {
			processExpression(trueBody, stack);
		} else {
			processExpression(falseBody, stack);
		}
	}
};

// The main datastructures:
var mainStack = [];
var theHeap = {};

var compiledExpression = compileExpression(ast);
processExpression(compiledExpression, mainStack);

function processExpression(expr, stack) {
	for (var i = 0; i < expr.terms.length; i++) {
		var term = expr.terms[i];
		if (!termIsOperator(term)) {
			stack.push(term);
		} else {
			operate(stack, term);
		}
	}
}

function operate(stack, operatorTerm) {
	// console.log(operatorTerm.opType + ' operating...');
	if (operatorTerm.opType == 'variableOperator') {
		if (operatorTerm.variableOpType == '^') {
			if (theHeap[operatorTerm.variableName] != undefined) {
				stack.push(theHeap[operatorTerm.variableName]);
			} else if (exports.operatorModules[operatorTerm.variableName] != undefined) {
				stack.push(exports.operatorModules[operatorTerm.variableName]);
			} else {
				throw 'Could not find ' + operatorTerm.variableName;
			}
		} else if (operatorTerm.variableOpType == '=') {
			variableAssign(stack, operatorTerm.variableName);
		} else {
			throw 'bad variable operator?';
		}
	} else if (exports.specialOperators[operatorTerm.name] != undefined) {
		var operatorModule = exports.specialOperators[operatorTerm.name];
		operatorModule(stack);
	} else if (exports.operatorModules[operatorTerm.name] != undefined) {
		var operatorModule = exports.operatorModules[operatorTerm.name];
		applyOperatorModule(stack, operatorModule);
	} else {
		throw 'bad operator? ' + operatorTerm.name;
	}
}

function variableAssign(stack, variableName) {
	theHeap[variableName] = stack.pop();
}

function applyOperatorModule(stack, operatorModule) {
	var args = [];
	for (var i = 0; i < operatorModule.length; i++) {
		args.unshift(stack.pop());
	}

	var returnValue = operatorModule.apply(null, args);
	if (returnValue != undefined) {
		stack.push(returnValue);
	}
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

// console.log(JSON.stringify(ast, null, '  '));
// debugger;