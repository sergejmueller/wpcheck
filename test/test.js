
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

    it( '1. wpscan https:/google.com', ( done ) => {

        exec( 'wpscan https:/google.com' ).then( result => {

            const data = result.stderr.trim()

            data.must.include( 'is not a valid URL' )

            done()

        } )

    } )


    /**
     * wpscan a non-resolvable URL
     */

    it( '2. wpscan https://google.comm', ( done ) => {

        exec( 'wpscan https://google.comm' ).then( result => {

            const data = result.stderr.trim()

            data.must.include( 'Can not resolve' )

            done()

        } )

    } )


    /**
     * wpscan a non-WordPress page
     */

    it( '3. wpscan https://www.google.de', ( done ) => {

        exec( 'wpscan https://www.google.de' ).then( result => {

            const data = result.stderr.trim()

            data.must.include( 'is not using WordPress' )

            done()

        } )

    } )


    /**
     * wpscan a single WordPress URL
     */

    it( `4. wpscan ${testURI}`, ( done ) => {

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
            data.must.include( `${testURI} is not affected by FPD vulnerability` )

            done()

        } )

    } )


    /**
     * wpscan a single WordPress URL with custom rules
     */

    it( `5. wpscan ${testURI} --rules-dir ./example/rules`, ( done ) => {

        exec( `wpscan ${testURI} --rules-dir ./example/rules` ).then( result => {

            const data = result.stdout.trim()

            data.must.include( 'Custom wpscan rule is fired' )

            done()

        } )

    } )


    /**
     * wpscan a single WordPress URL with non-resolvable rules
     */

    it( `6. wpscan ${testURI} -r ~/example/rules`, ( done ) => {

        exec( `wpscan ${testURI} -r ~/example/rules` ).then( result => {

            const data = result.stderr.trim()

            data.must.include( 'no such file or directory' )

            done()

        } )

    } )


    /**
     * wpscan a single WordPress URL in silent mode
     */

    it( `7. wpscan ${testURI} --silent`, ( done ) => {

        exec( `wpscan ${testURI} --silent` ).then( result => {

            const data = result.stdout.trim()

            data.must.be.empty()

            done()

        } )

    } )


    /**
     * wpscan multiple WordPress URLs in silent mode
     */

    it( `8. wpscan ${testURI} https://wpengine.com --silent`, ( done ) => {

        exec( `wpscan ${testURI} https://wpengine.com --silent` ).then( result => {

            const data = result.stdout.trim()

            data.must.be.empty()

            done()

        } )

    } )


    /**
     * wpscan a single WordPress URL without protocol in silent mode
     */

    it( `9. wpscan ${testURI} -s`, ( done ) => {

        exec( `wpscan ${testURI} -s` ).then( result => {

            const data = result.stdout.trim()

            data.must.be.empty()

            done()

        } )

    } )


    /**
     * wpscan multiple WordPress URLs without protocol in silent mode
     */

    it( `10. wpscan ${testURI} wpengine.com -s`, ( done ) => {

        exec( `wpscan ${testURI} wpengine.com -s` ).then( result => {

            const data = result.stdout.trim()

            data.must.be.empty()

            done()

        } )

    } )


    /**
     * wpscan multiple WordPress URLs readed from a bulk file in silent mode
     */

    it( `11. wpscan -b ./example/sources/list.txt -s`, ( done ) => {

        exec( `wpscan -b ./example/sources/list.txt -s` ).then( result => {

            const data = result.stdout.trim()

            data.must.be.empty()

            done()

        } )

    } )


    /**
     * wpscan additional WordPress URLs readed from a bulk file in silent mode
     */

    it( `12. wpscan ${testURI} -b ./example/sources/list.txt -s`, ( done ) => {

        exec( `wpscan ${testURI} -b ./example/sources/list.txt -s` ).then( result => {

            const data = result.stdout.trim()

            data.must.be.empty()

            done()

        } )

    } )


    /**
     * wpscan a single WordPress URL with a ignored rule
     */

    it( `13. wpscan ${testURI} -i wp-login.js`, ( done ) => {

        exec( `wpscan ${testURI} -i wp-login.js` ).then( result => {

            const data = result.stdout.trim()

            data.must.not.include( `${testURI}/wp-login.php use HTTPS protocol` )
            data.must.not.include( `${testURI}/wp-login.php is protected by HTTP Auth` )

            done()

        } )

    } )


    /**
     * wpscan a single WordPress URL with multiple ignored rules
     */

    it( `14. wpscan ${testURI} -i wp-login.js -i sensitive-files.js -i fpd-vulnerability.js`, ( done ) => {

        exec( `wpscan ${testURI} -i wp-login.js -i sensitive-files.js -i fpd-vulnerability.js` ).then( result => {

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
            data.must.not.include( `${testURI} is not affected by FPD vulnerability` )

            done()

        } )

    } )


    /**
     * wpscan a single WordPress URL with a ignored custom rule
     */

    it( `15. wpscan ${testURI} --rules-dir ./example/rules -i custom-rule.js`, ( done ) => {

        exec( `wpscan ${testURI} --rules-dir ./example/rules -i custom-rule.js` ).then( result => {

            const data = result.stdout.trim()

            data.must.not.include( 'Custom wpscan rule fired!' )

            done()

        } )

    } )


    /**
     * wpscan Help
     */

    it( '16. wpscan --help', ( done ) => {

        exec( 'wpscan --help' ).then( result => {

            const data = result.stdout.trim()

            data.must.include( 'Name' )
            data.must.include( 'Vulnerability scanner for WordPress' )
            data.must.include( 'https://github.com/sergejmueller/wpscan' )

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
