/**
 * These modules are just like custom user defined modules.
 * They don't need any special handling.
 */

var fs = require('fs');

var modules = {
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
		return arr;
	},
	'length' : function(arr) {
		return arr.length;
	},
	'del' : function(a) {
	},
	'concat' : function(a, b) {
		return a.concat(b);
	},
	'readlines' : function(fileName) {
		var fileContents = fs.readFileSync(fileName).toString();
		return fileContents.split(/\r?\n/);
	},
	'grep' : function(arr, regex) {
		return arr.filter(x => regex.test(x));
	},
	'searchreplace' : function(str, search, replace) {
		return str.replace(search, replace);
	}
};

module.exports = modules;