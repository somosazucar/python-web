#
# Compatibility Layer by Sebastian Silva <sebastian@fuentelibre.org>
#
# This file is only run by Transcrypt compiler!
#
# Add here missing functionality for parity with other compilers.
#

from org.transcrypt.stubs.browser import __pragma__

if not window.transpiler:
    window.transpiler = "Transcrypt"
    import common

def _new(cls, arg):
    return __new__(cls(arg))

_print = print
stdlib = None

def JS(code):
    window.eval(code)
