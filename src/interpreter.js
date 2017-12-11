var basicOperatorModules = require('./BasicOperatorModules.js');

var theHeap = {};
var userModules;

var interpret = function(ast, _userModules) {
	// The main datastructures:
	var mainStack = [];

	userModules = _userModules;

	var compiledExpression = compileExpression(ast);
	processExpression(compiledExpression, mainStack);

	return mainStack;
};

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
	},
	'while' : function(stack) {
		var loopBody = stack.pop().expression;
		var ifExpression = stack.pop().expression;

		while(processExpression(ifExpression, stack), stack.pop()) {
			processExpression(loopBody, stack);
		}
	},
	'map' : function(stack) {
		var procedure = stack.pop();
		var array = stack.pop();
		var result = [];

		if (typeof procedure == 'function') {
			result = array.map(procedure);
		} else {
			var titaniumProcedure = procedure.expression;
			for (var i = 0; i < array.length; i++) {
				stack.push(array[i]);
				processExpression(titaniumProcedure, stack);
				var titaniumProcedureResult = stack.pop();
				result.push(titaniumProcedureResult);
			}
		}

		stack.push(result);
	}
};

function operate(stack, operatorTerm) {
	// console.log(operatorTerm.opType + ' operating...');
	if (operatorTerm.opType == 'variableOperator') {
		if (operatorTerm.variableOpType == '!') {
			if (userModules[operatorTerm.variableName] != undefined) {
				stack.push(userModules[operatorTerm.variableName]);
			} else if (theHeap[operatorTerm.variableName] != undefined) {
				stack.push(theHeap[operatorTerm.variableName]);
			} else if (basicOperatorModules[operatorTerm.variableName] != undefined) {
				stack.push(basicOperatorModules[operatorTerm.variableName]);
			} else {
				throw 'Could not find ' + operatorTerm.variableName;
			}
		} else if (operatorTerm.variableOpType == '=') {
			variableAssign(stack, operatorTerm.variableName);
		} else {
			throw 'bad variable operator?';
		}
	} else if (userModules[operatorTerm.name] != undefined) {
		var operatorModule = userModules[operatorTerm.name];
		applyOperatorModule(stack, operatorModule);
	} else if (exports.specialOperators[operatorTerm.name] != undefined) {
		var operatorModule = exports.specialOperators[operatorTerm.name];
		operatorModule(stack);
	} else if (basicOperatorModules[operatorTerm.name] != undefined) {
		var operatorModule = basicOperatorModules[operatorTerm.name];
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

module.exports = {
	interpret: interpret
};