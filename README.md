wpscan
============

`wpscan` [Node.js module](https://www.npmjs.com/package/wpscan) allows you to quickly scan a WordPress site looking for known vulnerabilities, security issues and misconfigurations. `wpscan` helps you secure and maintain your WordPress against hackers.

Beginner friendly. Easy to install. Supports custom rules. **Work in progress**, see [todos](TODO.md) and [changelog](CHANGELOG.md).

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
`--rules-dir` or `-r` → Load additional rules from any directory (see below).<br>
`--bulk-file` or `-b` → Read additional WordPress site URLs from a text file (see below).<br>
`--user-agent` or `-u` → Set a custom `User-Agent` string different to `wpscan` (default).


Quick examples
-----

```bash
wpscan https://ma.tt
wpscan https://ma.tt --silent
wpscan https://ma.tt --rules-dir ~/path/to/custom/rules
wpscan https://ma.tt --bulk-file ~/path/to/sources.txt
wpscan https://ma.tt --user-agent "Netscape Gold"
```


Custom rules
-----
The argument `--rules-dir` allows loading of user-defined rules from a custom directory.

- The directory path
  - can be absolute or relative to `wpscan` folder
- The custom rules
  - must be stored as `.js` files
  - need to be structured as follows:

```javascript
'use strict';

exports.fire = function( data ) {
  // Play with data
}
```

Get inspired:
- [example custom rules](examples/rules)
- [wpscan default rules](lib/rules)


Bulk scan
-----
Multiple WordPress site URLs can be imported from a single file. This is a simple text file with one URL per line.

```bash
wpscan -b ~/path/to/sources.txt
```
