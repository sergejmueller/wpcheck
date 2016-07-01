wpscan
============

`wpscan` [Node.js module](https://www.npmjs.com/package/wpscan) allows you to quickly scan a WordPress site looking for known vulnerabilities, security issues and misconfigurations. `wpscan` helps you secure and maintain your WordPress against hackers.

Beginner friendly. Easy to install. Supports custom rules. **Work in progress**, see [the coming features](TODO.md).

[![Dependency Status](https://david-dm.org/sergejmueller/wpscan.svg)](https://david-dm.org/sergejmueller/wpscan)
[![Code Climate](https://codeclimate.com/github/sergejmueller/wpscan/badges/gpa.svg)](https://codeclimate.com/github/sergejmueller/wpscan)
[![Build Status](https://travis-ci.org/sergejmueller/wpscan.svg?branch=master)](https://travis-ci.org/sergejmueller/wpscan)
[![Known Vulnerabilities](https://snyk.io/test/github/sergejmueller/wpscan/badge.svg)](https://snyk.io/test/github/sergejmueller/wpscan)


Install
-----

```
npm install --global wpscan
```


Usage
-----

```bash
wpscan <url> [url] [options]
```

`url` → WordPress site URL (e.g. `https://ma.tt`)

Multiple URLs can be separated by spaces.


Options
-----

`--silent` or `-s` → Disable success and info messages. Warnings only.<br>
`--rules-dir` or `-r` → Load additional rules from any directory (see below).


Quick examples
-----

```bash
wpscan https://ma.tt
wpscan https://ma.tt --silent
wpscan https://ma.tt --rules-dir ~/path/to/custom/rules
```


Custom rules
-----
The argument `--rules-dir` allows loading of user-defined rules from a directory.

- The directory path
  - can be absolute or relative
- The custom rules
  - must be stored as `.js` files
  - need to be structured as follows ([example](examples/rules/custom-rule.js)):

```javascript
'use strict';

exports.fire = function( data ) {
    // Play with data
}
```
