titanium-lang
=============
Reverse polish notation (RPN) programming language compatible with JavaScript.

Overview
--------

titanium-lang is a stack based RPN language. It is an interpreted language. The interpreter runs in JS, and can load and call any JS module.

The code looks the way it does because it is an early prototype :)

Features
--------

- Very simple syntax - titanium programs are simply a list of operands and operators.
- Very little nesting is required, making it ideal for writing one liners!
- Ability to use custom JS modules as operators.

Usage
-----

Install the package globally:

    npm install -g titanium-lang

After installing the package, you can either write the program in a file or on the command line.

Examples:

    t "3 4 + ++ print"
    
    t /in:program.ttn

Simple programs which won't confuse your shell can also be written without putting it in quotes on the command line:

    t 3 4 + 70 swap / print

`titanium` can also be used instead of `t` on the command line.

Language Documentation
----------------------

**Literals**

These are the literals which are currently supported:
- numbers (ex, `3.14`)
- booleans (ex, `true`/`false`)
- regexes (ex, `/foo(\d+)/i`)
- strings

Strings look like the following:

    `this is a non verbatim string\r\n`
    @`C:\foo\verbatim_string`

Verbatim strings can contain backslashes, but in non-verbatim strings they have a special meaning (just like any other language).

**Variables**

Variable assignment pops an entry from the stack and assigns it to the variable:

    10 3 + =foo

Variables can be put back on the stack like so:

    10 3 + =foo !foo !foo / print
    
The program above outputs 1 (it divides 13 by itself).

**If statements and loops**

If statements and loops are also stack based! The boolean condition, main body, and the `if`/`ifelse`/`while` operators all go on the stack like so:

    (5 3 >) (`foo` print) (`bar` print) ifelse

The program above prints `foo` if 5 is bigger than 3, `bar` otherwise.

Else blocks can be skipped like so:

    (5 3 >) (`foo` print) if

Currently while loops are the only kind of loops which are implemented, and they look like so:

    (5 3 >) (`foo` print) while
    
(The loop above will obviously loop forever!)

**map operator**

The map operator is one of the very useful operators in this language. (You can find others by looking at the source).

    newarray 3 push 4 push 5 push !print map
    
The example above constructs an array which looks like this `[3,4,5]`. Then the `print` function is placed on the stack, and then the `map` operator is called. The `print` function is applied to all elements of the array, and therefore everything in the array is printed to stdout.

Custom lambda functions can be written and used in addition to the built in ones like so:

    newarray 3 push 4 push 5 push (dup *) map !print map

The `(dup *)` lambda function duplicates the top most item on the stack and multiplies it, which ends up squaring the number. So the numbers printed by the program above should be `9`, `16`, and `25`.

**Reading files**

Files can be read using the `readlines` operator like the following:

    @`C:\foo\file.txt` readlines !print map

**Advanced Example**

    @`C:\test.txt` readlines 100 =id ( /\d+/ !id searchreplace !id ++ =id ) map !print map

The program above takes a files with the lines `foo33`, `foo78`, `foo1`, etc. and outputs `foo100`, `foo101`, `foo102`.

Using Custom JS Modules
-----------------------

A custom JS module should export an object, whose keys would be used as operator identifiers, and the values would be used as the functions which run when the operator is used. Example module file:

    var sqr = function(a) {
        return x*x;
    }
    
    var pi = function() {
        return Math.PI;
    }
    
    export {
        sqr: sqr,
        pi: pi
    };

The module above can be used in a titnaium program like the following:

    3 4 + pi + sqr print

The program above adds 3, 4, pi, and squares the end result.

The module, along with the input titanium source can be specified on the command line:

    t /modules:C:\modules\mymodules.js /in:mysource.ttn
