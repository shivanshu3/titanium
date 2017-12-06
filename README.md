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

Documentation
-------------

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
