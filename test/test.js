
/**
 * Required modules
 */

require( 'must/register' )
const exec = require( 'child-process-promise' ).exec
const testURI = require( '../config/test.json' ).testURI


describe( 'wpscan CLI', () => {


    /**
     * wpscan a invalid URL
     */

    it( 'wpscan https:/google.com', ( done ) => {

        exec( 'wpscan https:/google.com' ).then( result => {

            const data = result.stderr.trim()

            data.must.include( 'is not a valid URL' )

            done()

        } )

    } )


    /**
     * wpscan a non-resolvable URL
     */

    it( 'wpscan https://google.comm', ( done ) => {

        exec( 'wpscan https://google.comm' ).then( result => {

            const data = result.stderr.trim()

            data.must.include( 'Can not resolve' )

            done()

        } )

    } )


    /**
     * wpscan a non-WordPress page
     */

    it( 'wpscan https://www.google.de', ( done ) => {

        exec( 'wpscan https://www.google.de' ).then( result => {

            const data = result.stderr.trim()

            data.must.include( 'is not using WordPress' )

            done()

        } )

    } )


    /**
     * wpscan a single WordPress URL
     */

    it( `wpscan ${testURI}`, ( done ) => {

        exec( `wpscan ${testURI}` ).then( result => {

            const data = result.stdout.trim()

            data.must.include( `New site URL: http://${testURI} → https://${testURI}` )
            data.must.include( `${testURI}/.ssh is not public` )
            data.must.include( `${testURI}/.gitconfig is not public` )
            data.must.include( `${testURI}/.npmrc is not public` )
            data.must.include( `${testURI}/.htpasswd is not public` )
            data.must.include( `${testURI}/.htaccess is not public` )
            data.must.include( `${testURI}/config.json is not public` )
            data.must.include( `${testURI}/wp-config.php is not public` )
            data.must.include( `${testURI}/wp-config-sample.php is not public` )
            data.must.include( `${testURI}/wp-admin/maint/repair.php is not public` )
            data.must.include( `${testURI}/wp-content/debug.log is not public` )
            data.must.include( `${testURI}/wp-login.php use HTTPS protocol` )
            data.must.include( `${testURI}/wp-login.php is protected by HTTP Auth` )

            done()

        } )

    } )


    /**
     * wpscan a single WordPress URL with custom rules
     */

    it( `wpscan ${testURI} --rules-dir ./example/rules`, ( done ) => {

        exec( `wpscan ${testURI} --rules-dir ./example/rules` ).then( result => {

            const data = result.stdout.trim()

            data.must.include( 'Custom wpscan rule is fired' )

            done()

        } )

    } )


    /**
     * wpscan a single WordPress URL with non-resolvable rules
     */

    it( `wpscan ${testURI} -r ~/example/rules`, ( done ) => {

        exec( `wpscan ${testURI} -r ~/example/rules` ).then( result => {

            const data = result.stderr.trim()

            data.must.include( 'no such file or directory' )

            done()

        } )

    } )


    /**
     * wpscan a single WordPress URL in silent mode
     */

    it( `wpscan ${testURI} --silent`, ( done ) => {

        exec( `wpscan ${testURI} --silent` ).then( result => {

            const data = result.stdout.trim()

            data.must.be.empty()

            done()

        } )

    } )


    /**
     * wpscan multiple WordPress URLs in silent mode
     */

    it( `wpscan ${testURI} https://wpengine.com --silent`, ( done ) => {

        exec( `wpscan ${testURI} https://wpengine.com --silent` ).then( result => {

            const data = result.stdout.trim()

            data.must.be.empty()

            done()

        } )

    } )


    /**
     * wpscan a single WordPress URL without protocol in silent mode
     */

    it( `wpscan ${testURI} -s`, ( done ) => {

        exec( `wpscan ${testURI} -s` ).then( result => {

            const data = result.stdout.trim()

            data.must.be.empty()

            done()

        } )

    } )


    /**
     * wpscan multiple WordPress URLs without protocol in silent mode
     */

    it( `wpscan ${testURI} wpengine.com -s`, ( done ) => {

        exec( `wpscan ${testURI} wpengine.com -s` ).then( result => {

            const data = result.stdout.trim()

            data.must.be.empty()

            done()

        } )

    } )


    /**
     * wpscan multiple WordPress URLs readed from a bulk file in silent mode
     */

    it( `wpscan -b ./example/sources/list.txt -s`, ( done ) => {

        exec( `wpscan -b ./example/sources/list.txt -s` ).then( result => {

            const data = result.stdout.trim()

            data.must.be.empty()

            done()

        } )

    } )


    /**
     * wpscan additional WordPress URLs readed from a bulk file in silent mode
     */

    it( `wpscan ${testURI} -b ./example/sources/list.txt -s`, ( done ) => {

        exec( `wpscan ${testURI} -b ./example/sources/list.txt -s` ).then( result => {

            const data = result.stdout.trim()

            data.must.be.empty()

            done()

        } )

    } )


    /**
     * wpscan a single WordPress URL with a ignored rule
     */

    it( `wpscan ${testURI} --ignore-rule wp-login.js`, ( done ) => {

        exec( `wpscan ${testURI} --ignore-rule wp-login.js` ).then( result => {

            const data = result.stdout.trim()

            data.must.not.include( `${testURI}/wp-login.php use HTTPS protocol` )
            data.must.not.include( `${testURI}/wp-login.php is protected by HTTP Auth` )

            done()

        } )

    } )


    /**
     * wpscan a single WordPress URL with multiple ignored rules
     */

    it( `wpscan ${testURI} --ignore-rule wp-login.js --ignore-rule files-exists.js`, ( done ) => {

        exec( `wpscan ${testURI} --ignore-rule wp-login.js --ignore-rule files-exists.js` ).then( result => {

            const data = result.stdout.trim()

            data.must.include( `New site URL: http://${testURI} → https://${testURI}` )

            data.must.not.include( `${testURI}/.ssh is not public` )
            data.must.not.include( `${testURI}/.gitconfig is not public` )
            data.must.not.include( `${testURI}/.npmrc is not public` )
            data.must.not.include( `${testURI}/.htpasswd is not public` )
            data.must.not.include( `${testURI}/.htaccess is not public` )
            data.must.not.include( `${testURI}/config.json is not public` )
            data.must.not.include( `${testURI}/wp-config.php is public but safe` )
            data.must.not.include( `${testURI}/wp-config-sample.php is not public` )
            data.must.not.include( `${testURI}/wp-admin/maint/repair.php is public but safe` )
            data.must.not.include( `${testURI}/wp-content/debug.log is not public` )
            data.must.not.include( `${testURI}/wp-login.php use HTTPS protocol` )
            data.must.not.include( `${testURI}/wp-login.php is not protected by HTTP Auth` )

            done()

        } )

    } )


    /**
     * wpscan a single WordPress URL with a ignored custom rule
     */

    it( `wpscan ${testURI} --rules-dir ./example/rules --ignore-rule custom-rule.js`, ( done ) => {

        exec( `wpscan ${testURI} --rules-dir ./example/rules --ignore-rule custom-rule.js` ).then( result => {

            const data = result.stdout.trim()

            data.must.not.include( 'Custom wpscan rule fired!' )

            done()

        } )

    } )


    /**
     * wpscan Help
     */

    it( 'wpscan --help', ( done ) => {

        exec( 'wpscan --help' ).then( result => {

            const data = result.stdout.trim()

            data.must.include( 'Usage' )
            data.must.include( 'wpscan <url> [url] [options]' )
            data.must.include( 'Options' )
            data.must.include( '-s, --silent       Disable success and info messages' )
            data.must.include( '-r, --rules-dir    Load and execute additional rules from any directory' )
            data.must.include( '-b, --bulk-file    Read and scan additional URLs from a text file' )
            data.must.include( '-u, --user-agent   Define a custom User-Agent string' )
            data.must.include( '-i, --ignore-rule  Skip loading and execution of a specific rule' )
            data.must.include( '-h, --help         Show this help' )

            done()

        } )

    } )

} )
