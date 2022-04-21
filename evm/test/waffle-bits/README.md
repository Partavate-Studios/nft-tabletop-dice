# Test Helper Bits from @ethereum-waffle/chai

The NPM package `@ethereum-waffle` has over 2500 dependencies. It's "subpackage, `@ethereum-waffle/chai` requires 992.

Since we only need two Chai matchers that it implements, we can reduce the size of our code footprint (and improve security)
by taking just what is needed from their project.

Original Source: https://github.com/TrueFiEng/Waffle/tree/%40ethereum-waffle/chai%404.0.0
Version: chai@4.0.0 [git tag]