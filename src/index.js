#!/usr/bin/env node

var fs = require('fs');
var process = require('process');
var parser = require('./parser.js');
var interpreter = require('./interpreter.js');
var path = require('path');

var userModules;

var inputProgram;

if (process.argv.length <= 2) {
	console.log('Titnaium: Read the code for documentation :)');
	process.exit(0);
} else {
	var commandLineOptions = parseCommandLineArgs();

	if (commandLineOptions.options.modules != undefined) {
		userModules = require(path.resolve(commandLineOptions.options.modules));
	} else {
		userModules = {};
	}

	if (commandLineOptions.options.in != undefined) {
		inputProgram = fs.readFileSync(path.resolve(commandLineOptions.options.in)).toString();
	} else {
		inputProgram = commandLineOptions.inputProgram;
	}
}

function parseCommandLineArgs() {
	var inputProgram = '';
	var options = {};

	for (var i = 2; i < process.argv.length; i++) {
		var arg = process.argv[i];

		var cmdArgMatch = arg.match(/\/(\w+)\:(.+)/);
		if (cmdArgMatch) {
			var key = cmdArgMatch[1];
			var value = cmdArgMatch[2];
			options[key] = value;
		} else {
			inputProgram = inputProgram + ' ' + arg;
		}
	}

	return {
		inputProgram: inputProgram,
		options: options
	};
}

function stringifyErrorLocation(location) {
	function singleLocation (singleLocation) {
		return 'L:' + singleLocation.line + ' C:' + singleLocation.column;
	};
	return singleLocation(location.start) + ' - ' + singleLocation(location.end);
}

var ast;
try {
	ast = parser.parse(inputProgram);
} catch (ex) {
	if (ex.name == 'SyntaxError') {
		console.error('SyntaxError: ' + ex.message);
		console.error(stringifyErrorLocation(ex.location));
		process.exit(1);
	} else {
		console.error('Unknown Error!');
		throw ex;
	}
}

interpreter.interpret(ast, userModules);