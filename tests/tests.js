var process = require('process');
var assert = require('assert');
var child_process = require('child_process');
var path = require('path');

var parser = require('../src/parser');
var interpreter = require('../src/interpreter.js');

/**
 * Parses the given program, interprets it, and returns the top value from the stack
 */
function parseAndInterpret(program) {
	return interpreter.interpret(parser.parse(program), {}).pop();
}

/**
 * The most basic smoke test which tries to emulate an end user scenario.
 */
function test0() {
	var output = child_process.execSync('node src/index.js 3 4 + print').toString();
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
	var result = parseAndInterpret("3 4 +");
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

/**
 * If statements
 */
function test4() {
	var result;

	var ifEnter = "100 =a (3 4 <) (200 =a) if !a";
	result = parseAndInterpret(ifEnter);
	assert.strictEqual(result, 200);

	var ifNoEnter = "100 =a (3 4 >) (200 =a) if !a";
	result = parseAndInterpret(ifNoEnter);
	assert.strictEqual(result, 100);

	var ifElseTrue = "(3 4 <) (11) (22) ifelse";
	result = parseAndInterpret(ifElseTrue);
	assert.strictEqual(result, 11);

	var ifElseFalse = "(3 4 >) (11) (22) ifelse";
	result = parseAndInterpret(ifElseFalse);
	assert.strictEqual(result, 22);

	return true;
}

/**
 * Loops
 */
function test5() {
	var counter = "0 =sum 0 =i (!i 10 <) (!sum 2 + =sum !i ++ =i) while !sum";
	result = parseAndInterpret(counter);
	assert.strictEqual(result, 20);
	return true;
}

/**
 * variables
 */
function test6() {
	var counter = "10 =a 20 =b !a !b + =sum !sum";
	result = parseAndInterpret(counter);
	assert.strictEqual(result, 30);
	return true;
}

/**
 * Reading files
 */
function test7() {
	var testFilePath = path.join(__dirname, 'testfile.txt');
	var program = '@`' + testFilePath + '`' + ' readlines';
	var result = parseAndInterpret(program);
	assert.strictEqual(result[0], 'foo');
	assert.strictEqual(result[1], 'bar');
	assert.strictEqual(result[2], 'baz');
	return true;
}

var tests = [test0, test1, test2, test3, test4, test5, test6, test7];

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