var process = require('process');
var assert = require('assert');
var child_process = require('child_process');

var parser = require('./parser');
var interpreter = require('./interpreter.js');

/**
 * The most basic smoke test which tries to emulate an end user scenario.
 */
function smoke() {
	var output = child_process.execSync('node index.js 3 4 + print').toString();
	assert.equal(output, '7\n');
	return true;
}

/**
 * Parser test
 */
function test1() {
	var ast = parser.parse("3 4 + print");

	assert.equal(typeof ast, "object");
	assert.equal(typeof ast.terms, "object"), assert(ast.terms instanceof Array);
	assert.equal(ast.terms.length, 4);

	for (var i = 0; i < ast.terms.length; i++) {
		assert.equal(typeof ast.terms[i], "object");
	}

	assert.strictEqual(ast.terms[0].type, 'literal');
	assert.strictEqual(ast.terms[0].literalType, 'number');
	assert.strictEqual(ast.terms[0].value, 3);
	
	assert.strictEqual(ast.terms[1].type, 'literal');
	assert.strictEqual(ast.terms[1].literalType, 'number');
	assert.strictEqual(ast.terms[1].value, 4);
	
	assert.strictEqual(ast.terms[2].type, 'operator');
	assert.strictEqual(ast.terms[2].opType, 'symbolOperator');
	assert.strictEqual(ast.terms[2].name, '+');
	
	assert.strictEqual(ast.terms[3].type, 'operator');
	assert.strictEqual(ast.terms[3].opType, 'wordOperator');
	assert.strictEqual(ast.terms[3].name, 'print');

	return true;
}

/**
 * A basic interpreter test
 */
function test2() {
	var program = "3 4 +";
	var result = interpreter.interpret(parser.parse(program), {}).pop();
	assert.strictEqual(result, 7);
	return true;
}

/**
 * User modules
 */
function test3() {
	var program = "3 4 usermodule_square";
	var userModules = {
		'usermodule_square': function(a) {
			return a*a;
		}
	};
	var result = interpreter.interpret(parser.parse(program), userModules).pop();
	assert.strictEqual(result, 16);
	return true;
}

var tests = [smoke, test1, test2, test3];

for (var i = 0; i < tests.length; i++) {
	var testName = tests[i].name;
	var testsResult = true;

	if (tests[i]()) {
		console.log('Success: ' + testName);
	} else {
		console.log('Failure: ' + testName);
		testsResult = false;
	}
}

if (testsResult) {
	console.log('All tests passed!');
} else {
	console.log('One or more tests failed.');
	process.exit(1);
}