# Compatibility Layer by Sebastian Silva
#
# This file fills missing functionality for parity with other compilers.
#

from org.transcrypt.stubs.browser import __pragma__

print("Hello from Transcrypt")

def _new(cls, arg):
    return __new__(cls(arg))

_print = print
stdlib = None

#def JS(code):
#    return __pragma__('js', code)
