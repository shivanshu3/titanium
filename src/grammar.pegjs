/**
 * PegJS Parser Generator Grammar
 * http://pegjs.org/
 */

{
    function makeSymbolOperator(text) {
        return {
            type: 'operator',
            opType: 'symbolOperator',
            name: text
        };
    }

    function makeVariableOperator(opType, text){
        return {
            type: 'operator',
            opType: 'variableOperator',
            variableOpType: opType,
            variableName: text
        };
    }
}

start
    = expression

expression "expression"
    = terms:( _ term _ )+ {
        var result = terms.map(x => {
            return x[1];
        });
        return {terms:result};
    }

procedure "procedure"
    = '(' expr:expression ')' {
        return {
            type: 'procedure',
            expression: expr
        }
    }

term "term"
    = literal
    / operator
    / procedure

operator "operator"
    = wordOperator
    / variableOperator
    / symbolOperator

wordOperator "wordOperator"
    = name:identifier {
        return {
            type: 'operator',
            opType: 'wordOperator',
            name: name
        };
    }

symbolOperator "symbolOperator"
    = '++' { return makeSymbolOperator(text()); }
    / '--' { return makeSymbolOperator(text()); }
    / '[]' { return makeSymbolOperator(text()); }
    / '<=' { return makeSymbolOperator(text()); }
    / '>=' { return makeSymbolOperator(text()); }
    / '==' { return makeSymbolOperator(text()); }
    / '+' { return makeSymbolOperator(text()); }
    / '-' { return makeSymbolOperator(text()); }
    / '*' { return makeSymbolOperator(text()); }
    / '/' { return makeSymbolOperator(text()); }
    / '<' { return makeSymbolOperator(text()); }
    / '>' { return makeSymbolOperator(text()); }

variableOperator "variableOperator"
    = '=' name:identifier { return makeVariableOperator('=', name); }
    / '!' name:identifier { return makeVariableOperator('!', name); }

identifier "identifier"
    = head:[a-zA-Z_] tail:[a-zA-Z_0-9]*
    { return head + tail.join(''); }

literal "literal"
    = number
    / boolean
    / string
    / regex

number "number"
    = digits:[0-9]+ {
        return {
            type: 'literal',
            literalType: 'number',
            value: parseInt(digits.join(''), 10)
        }
    }

boolean "boolean"
    = 'true' {
        return {
            type: 'literal',
            literalType: 'bool',
            value: true
        };
    }
    / 'false' {
        return {
            type: 'literal',
            literalType: 'bool',
            value: false
        };
    }

regex "regular expression"
    = '/' body:regex_char* '/' flags:[a-zA-Z]* {
        var regexBody = body.join('');
        var regexFlags = flags.join('');
        var regex;
        try {
            regex = new RegExp(regexBody, regexFlags);
        } catch (e) {
            error(e.message);
        }
        return {
            type: 'literal',
            literalType: 'regex',
            value: regex
        };
    }

regex_char "regular expression character"
    = [^\0-\x1F\x2F]

string "string"
    = non_verbatim_string
    / verbatim_string

non_verbatim_string "non_verbatim_string"
    = '`' chars:char* '`' {
        return {
            type: 'literal',
            literalType: 'string',
            value: chars.join("")
        };
    }

verbatim_string "verbatim_string"
    = '@`' chars:verbatim_char* '`' {
        return {
            type: 'literal',
            literalType: 'string',
            value: chars.join("")
        };
    }

char "character"
    = unescaped
    / escape
    sequence:(
        '"'
        / '\\'
        / '/'
        / 'b' { return '\b'; }
        / 'f' { return '\f'; }
        / 'n' { return '\n'; }
        / 'r' { return '\r'; }
        / 't' { return '\t'; }
        / 'u' digits:$(HEXDIG HEXDIG HEXDIG HEXDIG) {
            return String.fromCharCode(parseInt(digits, 16));
        }
    )
    { return sequence; }

escape "backslash"
    = '\\'

verbatim_char "verbatim_char"
    = [^\0-\x1F\x60]

unescaped "unescaped character"
    = [^\0-\x1F\x60\x5C]

// ----- Core ABNF Rules -----
// See RFC 4234, Appendix B (http://tools.ietf.org/html/rfc4234).
DIGIT  = [0-9]
HEXDIG = [0-9a-f]i

_ "whitespace"
    = [ \t\n\r]* { return null; }