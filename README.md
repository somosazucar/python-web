
Python Browser Compatibility Layer
==================================

Quick development environment for writing Python scripts for the browser.

This project template takes advantage of more than one development environment in order to test them out and offer the developer "more than one way to do it".

It is considered as a basis into browser based collaborative educational development environments.

## RapydScript © Alexander Tsepkov

[RapydScript](https://github.com/atsepkov/RapydScript.git) implements Python 3 in Javascript. It offers an interpreter and the possibility to compile in-browser, so a REPL can be implemented, and also code can be edited and tested "live" without the involvement of a server.

* License: BSD-2
* Website: http://rapydscript.com

## Transcrypt © Jacques de Hooge

[Transcrypt](https://github.com/QQuick/Transcrypt) leverages the fully featured Python 3.5 parser at compile time in order to compile your code into fast javascript that is easy to debug.

* License: Apache 2.0
* Website: http://transcrypt.org


How to run
==========

First install dependencies:

```
npm install
pip install -r requirements.txt
```

While the Python dependencies are optional, version 3.5 or superior is required.


Then you can then build:

```
npm run build
```

Or use the live autoreloader:

```
npm run live
```

It will hopefully monitor the main.py file and its imports and trigger a browser reload after an incremental rebuild.

Motivation
==========

There appear to be several options when attempting to use Python in the browser, and the tradeoffs are not really clear at first. This is an attempt at testing them side by side, in order to determine what those tradeoffs are, what are the best practices and the tools better suited for each task.

Our use case
============

We like to teach children to program. Python is a terrific language for it. However we lack a web development platform that supports learners in the following scenarios:

* Have good performance on the client side.
* Work in (smart) mobile devices.
* Ability to deploy offline (or with *very* minimal server).

The ideal environment would allow to define classes (e.g. new Sprites and launch them) without losing the state, but there are a number of other important things to take into consideration such as friendliness of errors reporting, size and performance of resulting code, etc.

We intend to build up to this goal basing on what we currently have.

Open questions
==============

* What are the best practices to wrap Javascript libraries using Python classes?

* Does it make sense to add reporting of compilation speed / size?

* To look at other compilers: Batavia, Javascripthon.

* Which Python transpiler shall we use?
