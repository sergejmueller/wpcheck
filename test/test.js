'use strict';


require( 'must/register' );


const exec = require( 'child-process-promise' ).exec;


describe( 'wpscan CLI', function() {


    /**
     * wpscan a invalid URL
     */

    it( 'wpscan httpp://ma.tt', function( done ) {

        exec( 'wpscan httpp://ma.tt' ).then( function( result ) {

            const data = result.stderr.trim();

            data.must.include( 'is not a valid URL' );

            done();

        } );

    } );


    /**
     * wpscan a non-resolvable URL
     */

    it( 'wpscan http://ma.ttt', function( done ) {

        exec( 'wpscan http://ma.ttt' ).then( function( result ) {

            const data = result.stderr.trim();

            data.must.include( 'Can not resolve' );

            done();

        } );

    } );


    /**
     * wpscan a non-WordPress page
     */

    it( 'wpscan https://www.google.de', function( done ) {

        exec( 'wpscan https://www.google.de' ).then( function( result ) {

            const data = result.stderr.trim();

            data.must.include( 'is not using WordPress' );

            done();

        } );

    } );


    /**
     * wpscan a single WordPress URL
     */

    it( 'wpscan http://ma.tt', function( done ) {

        exec( 'wpscan http://ma.tt' ).then( function( result ) {

            const data = result.stdout.trim();

            data.must.include( 'New site URL: http://ma.tt → https://ma.tt' );
            data.must.include( 'New WordPress URL: https://ma.tt → https://ma.tt/blog' );
            data.must.include( 'https://ma.tt/.ssh is not public' );
            data.must.include( 'https://ma.tt/.gitconfig is not public' );
            data.must.include( 'https://ma.tt/.npmrc is not public' );
            data.must.include( 'https://ma.tt/.htpasswd is not public' );
            data.must.include( 'https://ma.tt/.htaccess is not public' );
            data.must.include( 'https://ma.tt/config.gypi is not public' );
            data.must.include( 'https://ma.tt/config.json is not public' );
            data.must.include( 'https://ma.tt/blog/wp-config.php is public but safe' );
            data.must.include( 'https://ma.tt/blog/wp-config-sample.php is not public' );
            data.must.include( 'https://ma.tt/blog/wp-admin/maint/repair.php is public but safe' );
            data.must.include( 'https://ma.tt/blog/wp-content/debug.log is not public' );
            data.must.include( 'https://ma.tt/blog/wp-login.php use HTTPS protocol' );
            data.must.include( 'https://ma.tt/blog/wp-login.php is not protected by HTTP Auth' );

            done();

        } );

    } );


    /**
     * wpscan a single WordPress URL with custom rules
     */

    it( 'wpscan http://ma.tt --rules-dir ./example/rules', function( done ) {

        exec( 'wpscan http://ma.tt --rules-dir ./example/rules' ).then( function( result ) {

            const data = result.stdout.trim();

            data.must.include( 'Custom wpscan rule fired!' );

            done();

        } );

    } );


    /**
     * wpscan a single WordPress URL with non-resolvable rules
     */

    it( 'wpscan http://ma.tt -r ~/example/rules', function( done ) {

        exec( 'wpscan http://ma.tt -r ~/example/rules' ).then( function( result ) {

            const data = result.stderr.trim();

            data.must.include( 'no such file or directory' );

            done();

        } );

    } );


    /**
     * wpscan a single WordPress URL in silent mode
     */

    it( 'wpscan http://ma.tt --silent', function( done ) {

        exec( 'wpscan http://ma.tt --silent' ).then( function( result ) {

            const data = result.stdout.trim();

            data.must.be.empty;

            done();

        } );

    } );


    /**
     * wpscan multiple WordPress URLs in silent mode
     */

    it( 'wpscan http://ma.tt https://wpengine.com --silent', function( done ) {

        exec( 'wpscan http://ma.tt https://wpengine.com --silent' ).then( function( result ) {

            const data = result.stdout.trim();

            data.must.be.empty;

            done();

        } );

    } );


    /**
     * wpscan a single WordPress URL without protocol in silent mode
     */

    it( 'wpscan ma.tt -s', function( done ) {

        exec( 'wpscan ma.tt -s' ).then( function( result ) {

            const data = result.stdout.trim();

            data.must.be.empty;

            done();

        } );

    } );


    /**
     * wpscan multiple WordPress URLs without protocol in silent mode
     */

    it( 'wpscan ma.tt wpengine.com -s', function( done ) {

        exec( 'wpscan ma.tt wpengine.com -s' ).then( function( result ) {

            const data = result.stdout.trim();

            data.must.be.empty;

            done();

        } );

    } );


    /**
     * wpscan multiple WordPress URLs readed from a bulk file in silent mode
     */

    it( 'wpscan -b ./example/sources/list.txt -s', function( done ) {

        exec( 'wpscan -b ./example/sources/list.txt -s' ).then( function( result ) {

            const data = result.stdout.trim();

            data.must.be.empty;

            done();

        } );

    } );


    /**
     * wpscan additional WordPress URLs readed from a bulk file in silent mode
     */

    it( 'wpscan ma.tt -b ./example/sources/list.txt -s', function( done ) {

        exec( 'wpscan ma.tt -b ./example/sources/list.txt -s' ).then( function( result ) {

            const data = result.stdout.trim();

            data.must.be.empty;

            done();

        } );

    } );


    /**
     * wpscan a single WordPress URL with a ignored rule
     */

    it( 'wpscan ma.tt --ignore-rule wp-login.js', function( done ) {

        exec( 'wpscan ma.tt --ignore-rule wp-login.js' ).then( function( result ) {

            const data = result.stdout.trim();

            data.must.not.include( 'https://ma.tt/blog/wp-login.php use HTTPS protocol' );
            data.must.not.include( 'https://ma.tt/blog/wp-login.php is not protected by HTTP Auth' );

            done();

        } );

    } );


    /**
     * wpscan a single WordPress URL with multiple ignored rules
     */

    it( 'wpscan ma.tt --ignore-rule wp-login.js --ignore-rule files-exists.js', function( done ) {

        exec( 'wpscan ma.tt --ignore-rule wp-login.js --ignore-rule files-exists.js' ).then( function( result ) {

            const data = result.stdout.trim();

            data.must.include( 'New site URL: http://ma.tt → https://ma.tt' );
            data.must.include( 'New WordPress URL: https://ma.tt → https://ma.tt/blog' );

            data.must.not.include( 'https://ma.tt/.ssh is not public' );
            data.must.not.include( 'https://ma.tt/.gitconfig is not public' );
            data.must.not.include( 'https://ma.tt/.npmrc is not public' );
            data.must.not.include( 'https://ma.tt/.htpasswd is not public' );
            data.must.not.include( 'https://ma.tt/.htaccess is not public' );
            data.must.not.include( 'https://ma.tt/config.gypi is not public' );
            data.must.not.include( 'https://ma.tt/config.json is not public' );
            data.must.not.include( 'https://ma.tt/blog/wp-config.php is public but safe' );
            data.must.not.include( 'https://ma.tt/blog/wp-config-sample.php is not public' );
            data.must.not.include( 'https://ma.tt/blog/wp-admin/maint/repair.php is public but safe' );
            data.must.not.include( 'https://ma.tt/blog/wp-content/debug.log is not public' );
            data.must.not.include( 'https://ma.tt/blog/wp-login.php use HTTPS protocol' );
            data.must.not.include( 'https://ma.tt/blog/wp-login.php is not protected by HTTP Auth' );

            done();

        } );

    } );


    /**
     * wpscan a single WordPress URL with a ignored custom rule
     */

    it( 'wpscan http://ma.tt --rules-dir ./example/rules --ignore-rule custom-rule.js', function( done ) {

        exec( 'wpscan http://ma.tt --rules-dir ./example/rules --ignore-rule custom-rule.js' ).then( function( result ) {

            const data = result.stdout.trim();

            data.must.not.include( 'Custom wpscan rule fired!' );

            done();

        } );

    } );


    /**
     * wpscan Help
     */

    it( 'wpscan --help', function( done ) {

        exec( 'wpscan --help' ).then( function( result ) {

            const data = result.stdout.trim();

            data.must.include( 'Usage' );
            data.must.include( 'wpscan <url> [url] [options]' );
            data.must.include( 'Options' );
            data.must.include( '-s, --silent       Disable success and info messages' );
            data.must.include( '-r, --rules-dir    Load and execute additional rules from any directory' );
            data.must.include( '-b, --bulk-file    Read and scan additional URLs from a text file' );
            data.must.include( '-u, --user-agent   Define a custom User-Agent string' );
            data.must.include( '-i, --ignore-rule  Skip loading and execution of a specific rule' );
            data.must.include( '-h, --help         Show this help' );

            done();

        } );

    } );

} );
