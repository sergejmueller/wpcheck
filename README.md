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
Option | Shortcut | Description
------ | -------- | -----------
`--silent` | `-s` | Disables success and info messages. Displays warnings only.
`--rules-dir` | `-r` | Loads additional rules from any directory (see below).
`--bulk-file` | `-b` | Reads additional WordPress site URLs from a text file (see below).
`--user-agent` | `-u` | Sets a custom `User-Agent` string. Default is `wpscan`.


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
The option `--rules-dir` allows loading of user-defined rules from a custom directory.

- The directory path
  - can be absolute or relative to the `wpscan` folder
- The custom rules
  - must be stored as `.js` files
  - need to be structured as follows:

```javascript
exports.fire = function( data ) {
  // Play with data
}
```

`wpscan` will run every custom rule file. The file naming does not matter. Feel free to create your own rules, enjoy!

Get inspired
------
- [example custom rules](examples/rules)
- [wpscan default rules](lib/rules)


Bulk scan
-----
Multiple WordPress site URLs can be imported from a single file. This is a simple text file with one URL per line.

```bash
wpscan -b ~/path/to/sources.txt
```


Use, don't abuse!
-----
