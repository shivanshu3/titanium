var grammar = require('../out/grammar.js');

var parse = function(source) {
	var ast = grammar.parse(source);
	return ast;
};

module.exports = {
	parse: parse
};