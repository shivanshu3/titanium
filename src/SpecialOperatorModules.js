/**
 * These special modules require special handling currently
 * and users can't write these in their own custom modules file.
 */

var processExpression;

var modules = {
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

modules.initialize = function(_processExpression) {
	processExpression = _processExpression;
};

module.exports = modules;