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

            data.must.have.string( 'is not a valid URL' );

            done();

        } );

    } );


    /**
     * wpscan a non-resolvable URL
     */

    it( 'wpscan http://ma.ttt', function( done ) {

        exec( 'wpscan http://ma.ttt' ).then( function( result ) {

            const data = result.stderr.trim();

            data.must.have.string( 'Can not resolve' );

            done();

        } );

    } );


    /**
     * wpscan a non-WordPress page
     */

    it( 'wpscan https://www.google.de', function( done ) {

        exec( 'wpscan https://www.google.de' ).then( function( result ) {

            const data = result.stderr.trim();

            data.must.have.string( 'is not using WordPress' );

            done();

        } );

    } );


    /**
     * wpscan a single WordPress URL
     */

    it( 'wpscan http://ma.tt', function( done ) {

        exec( 'wpscan http://ma.tt' ).then( function( result ) {

            const data = result.stdout.trim();

            data.must.have.string( 'New site URL: http://ma.tt → https://ma.tt' );
            data.must.have.string( 'New WordPress URL: https://ma.tt → https://ma.tt/blog' );
            data.must.have.string( 'https://ma.tt/.ssh is not public' );
            data.must.have.string( 'https://ma.tt/.gitconfig is not public' );
            data.must.have.string( 'https://ma.tt/.npmrc is not public' );
            data.must.have.string( 'https://ma.tt/.htpasswd is not public' );
            data.must.have.string( 'https://ma.tt/.htaccess is not public' );
            data.must.have.string( 'https://ma.tt/config.gypi is not public' );
            data.must.have.string( 'https://ma.tt/config.json is not public' );
            data.must.have.string( 'https://ma.tt/blog/wp-config.php is public but safe' );
            data.must.have.string( 'https://ma.tt/blog/wp-config-sample.php is not public' );
            data.must.have.string( 'https://ma.tt/blog/wp-admin/maint/repair.php is public but safe' );
            data.must.have.string( 'https://ma.tt/blog/wp-content/debug.log is not public' );
            data.must.have.string( 'https://ma.tt/blog/wp-login.php use HTTPS protocol' );
            data.must.have.string( 'https://ma.tt/blog/wp-login.php is not protected by HTTP Auth' );

            done();

        } );

    } );


    /**
     * wpscan a single WordPress URL with custom rules
     */

    it( 'wpscan http://ma.tt --rules-dir ./examples/rules', function( done ) {

        exec( 'wpscan http://ma.tt --rules-dir ./examples/rules' ).then( function( result ) {

            const data = result.stdout.trim();

            data.must.have.string( 'Custom wpscan rule fired!' );

            done();

        } );

    } );


    /**
     * wpscan a single WordPress URL with non-resolvable rules
     */

    it( 'wpscan http://ma.tt -r ~/examples/rules', function( done ) {

        exec( 'wpscan http://ma.tt -r ~/examples/rules' ).then( function( result ) {

            const data = result.stderr.trim();

            data.must.have.string( 'no such file or directory' );

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

    it( 'wpscan -b ./examples/sources.txt -s', function( done ) {

        exec( 'wpscan -b ./examples/sources.txt -s' ).then( function( result ) {

            const data = result.stdout.trim();

            data.must.be.empty;

            done();

        } );

    } );


    /**
     * wpscan additional WordPress URLs readed from a bulk file in silent mode
     */

    it( 'wpscan ma.tt -b ./examples/sources.txt -s', function( done ) {

        exec( 'wpscan ma.tt -b ./examples/sources.txt -s' ).then( function( result ) {

            const data = result.stdout.trim();

            data.must.be.empty;

            done();

        } );

    } );

} );
