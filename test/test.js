
/**
 * Required modules
 */

require( 'must/register' )
const exec = require( 'child-process-promise' ).exec
const testURI = require( '../config/test.json' ).testURI


describe( 'wpcheck CLI', () => {


    /**
     * wpcheck a invalid URL
     */

    it( '1. wpcheck https:/google.com', ( done ) => {

        exec( 'wpcheck https:/google.com' ).then( result => {

            const data = result.stderr.trim()

            data.must.include( 'is not a valid URL' )

            done()

        } )

    } )


    /**
     * wpcheck a non-resolvable URL
     */

    it( '2. wpcheck https://google.comm', ( done ) => {

        exec( 'wpcheck https://google.comm' ).then( result => {

            const data = result.stderr.trim()

            data.must.include( 'Can not resolve' )

            done()

        } )

    } )


    /**
     * wpcheck a non-WordPress page
     */

    it( '3. wpcheck https://www.google.de', ( done ) => {

        exec( 'wpcheck https://www.google.de' ).then( result => {

            const data = result.stderr.trim()

            data.must.include( 'is not using WordPress' )

            done()

        } )

    } )


    /**
     * wpcheck a single WordPress URL
     */

    it( `4. wpcheck ${testURI}`, ( done ) => {

        exec( `wpcheck ${testURI}` ).then( result => {

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
            data.must.include( `${testURI}/wp-login.php uses HTTPS protocol` )
            data.must.include( `${testURI}/wp-login.php is protected by HTTP Auth` )
            data.must.include( `${testURI} is not affected by FPD vulnerability` )
            data.must.include( `${testURI} has directory listing off` )

            data.must.include( 'wp-login' )
            data.must.include( 'sensitive-files' )
            data.must.include( 'fpd-vulnerability' )
            data.must.include( 'directory-listing' )

            done()

        } )

    } )


    /**
     * wpcheck a single WordPress URL with custom rules
     */

    it( `5. wpcheck ${testURI} --rules-dir ./example/rules`, ( done ) => {

        exec( `wpcheck ${testURI} --rules-dir ./example/rules` ).then( result => {

            const data = result.stdout.trim()

            data.must.include( 'Custom wpcheck rule is fired' )

            done()

        } )

    } )


    /**
     * wpcheck a single WordPress URL with non-resolvable rules
     */

    it( `6. wpcheck ${testURI} -r ~/example/rules`, ( done ) => {

        exec( `wpcheck ${testURI} -r ~/example/rules` ).then( result => {

            const data = result.stderr.trim()

            data.must.include( 'no such file or directory' )

            done()

        } )

    } )


    /**
     * wpcheck a single WordPress URL in silent mode
     */

    it( `7. wpcheck ${testURI} --silent`, ( done ) => {

        exec( `wpcheck ${testURI} --silent` ).then( result => {

            const data = result.stdout.trim()

            data.must.be.empty()

            done()

        } )

    } )


    /**
     * wpcheck multiple WordPress URLs in silent mode
     */

    it( `8. wpcheck ${testURI} https://wpengine.com --silent`, ( done ) => {

        exec( `wpcheck ${testURI} https://wpengine.com --silent` ).then( result => {

            const data = result.stdout.trim()

            data.must.be.empty()

            done()

        } )

    } )


    /**
     * wpcheck a single WordPress URL without protocol in silent mode
     */

    it( `9. wpcheck ${testURI} -s`, ( done ) => {

        exec( `wpcheck ${testURI} -s` ).then( result => {

            const data = result.stdout.trim()

            data.must.be.empty()

            done()

        } )

    } )


    /**
     * wpcheck multiple WordPress URLs without protocol in silent mode
     */

    it( `10. wpcheck ${testURI} wpengine.com -s`, ( done ) => {

        exec( `wpcheck ${testURI} wpengine.com -s` ).then( result => {

            const data = result.stdout.trim()

            data.must.be.empty()

            done()

        } )

    } )


    /**
     * wpcheck multiple WordPress URLs readed from a bulk file in silent mode
     */

    it( `11. wpcheck -b ./example/sources/list.txt -s`, ( done ) => {

        exec( `wpcheck -b ./example/sources/list.txt -s` ).then( result => {

            const data = result.stdout.trim()

            data.must.be.empty()

            done()

        } )

    } )


    /**
     * wpcheck additional WordPress URLs readed from a bulk file in silent mode
     */

    it( `12. wpcheck ${testURI} -b ./example/sources/list.txt -s`, ( done ) => {

        exec( `wpcheck ${testURI} -b ./example/sources/list.txt -s` ).then( result => {

            const data = result.stdout.trim()

            data.must.be.empty()

            done()

        } )

    } )


    /**
     * wpcheck a single WordPress URL with a ignored rule
     */

    it( `13. wpcheck ${testURI} -i wp-login.js`, ( done ) => {

        exec( `wpcheck ${testURI} -i wp-login.js` ).then( result => {

            const data = result.stdout.trim()

            data.must.not.include( `${testURI}/wp-login.php uses HTTPS protocol` )
            data.must.not.include( `${testURI}/wp-login.php is protected by HTTP Auth` )

            done()

        } )

    } )


    /**
     * wpcheck a single WordPress URL with multiple ignored rules
     */

    it( `14. wpcheck ${testURI} -i wp-login.js -i sensitive-files.js -i fpd-vulnerability.js -i directory-listing.js`, ( done ) => {

        exec( `wpcheck ${testURI} -i wp-login.js -i sensitive-files.js -i fpd-vulnerability.js -i directory-listing.js` ).then( result => {

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
            data.must.not.include( `${testURI}/wp-login.php uses HTTPS protocol` )
            data.must.not.include( `${testURI}/wp-login.php is not protected by HTTP Auth` )
            data.must.not.include( `${testURI} is not affected by FPD vulnerability` )
            data.must.not.include( `${testURI} has directory listing off` )

            done()

        } )

    } )


    /**
     * wpcheck a single WordPress URL with a ignored custom rule
     */

    it( `15. wpcheck ${testURI} --rules-dir ./example/rules -i custom-rule.js`, ( done ) => {

        exec( `wpcheck ${testURI} --rules-dir ./example/rules -i custom-rule.js` ).then( result => {

            const data = result.stdout.trim()

            data.must.not.include( 'Custom wpcheck rule fired!' )

            done()

        } )

    } )


    /**
     * wpcheck Help
     */

    it( '16. wpcheck --help', ( done ) => {

        exec( 'wpcheck --help' ).then( result => {

            const data = result.stdout.trim()

            data.must.include( 'Name' )
            data.must.include( 'Vulnerability scanner for WordPress' )
            data.must.include( 'https://github.com/sergejmueller/wpcheck' )

            data.must.include( 'Usage' )
            data.must.include( 'wpcheck <url> [url] [options]' )

            data.must.include( 'Options' )
            data.must.include( '-s, --silent       Disable success and info messages' )
            data.must.include( '-r, --rules-dir    Load and execute additional rules from any directory' )
            data.must.include( '-b, --bulk-file    Read and scan additional URLs from a text file' )
            data.must.include( '-u, --user-agent   Define a custom User-Agent string' )
            data.must.include( '-i, --ignore-rule  Skip loading and execution of a specific rule' )
            data.must.include( '-v, --version      Print wpcheck version' )
            data.must.include( '-h, --help         Show this help' )

            done()

        } )

    } )


    /**
     * wpcheck version
     */

    it( `17. wpcheck --version`, ( done ) => {

        exec( `wpcheck --version` ).then( result => {

            const data = result.stdout.trim()

            data.must.equal( require( '../package.json' ).version )

            done()

        } )

    } )

} )
