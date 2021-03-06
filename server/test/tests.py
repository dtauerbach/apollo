import unittest

modules = [
    'test-api',
    'test-model'
]

suite = unittest.TestSuite()

for t in modules:
    try:
        # If the module defines a suite() function, call it to get the suite.
        mod = __import__(t, globals(), locals(), ['suite'])
        suitefn = getattr(mod, 'suite')
        suite.addTest(suitefn())
    except (ImportError, AttributeError):
        # else, just load all the test cases from the module.
        suite.addTest(unittest.defaultTestLoader.loadTestsFromName(t))

result = unittest.TextTestRunner().run(suite)
exit(0 if result.wasSuccessful() else 1)
