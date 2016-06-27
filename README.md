wpscan
============

`wpscan` [Node.js module](https://www.npmjs.com/package/wpscan) will allow you to quickly scan a WordPress site looking for known vulnerabilities, security issues and misconfigurations. `wpscan` can help you secure and maintain your WordPress against hackers. Beginner friendly, easy to install, without `gem` dependencies. **Work in progress**, go to [the coming features](TODO.md).


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

`--silent` → Disable success and notice messages. Warning errors only<br>
`--rules-dir` → Load additional rules from this directory (see below)


Examples
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
exports.fire = function( data ) {

    // Play with data

}
```
