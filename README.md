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

`--silent` → Disable success and notice messages. Warning errors only.
`--rules-dir` → Load additional rules from this directory (absolute path)


Examples
-----

```bash
wpscan https://ma.tt
```
