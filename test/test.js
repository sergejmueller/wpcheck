'use strict';


const
    expect = require( 'chai' ).expect,
    exec = require( 'child-process-promise' ).exec;


describe( 'wpscan CLI', function() {


    it( 'wpscan http://ma.tt', function( done ) {

        exec( 'wpscan http://ma.tt' ).then( function( result ) {

            const data = result.stdout.trim();

            expect( data ).to.have.string( 'New site URL: http://ma.tt → https://ma.tt' );
            expect( data ).to.have.string( 'New WordPress URL: https://ma.tt → https://ma.tt/blog' );
            expect( data ).to.have.string( 'https://ma.tt/blog/wp-config.php is public but safe' );
            expect( data ).to.have.string( 'https://ma.tt/blog/wp-admin/maint/repair.php is public but safe' );
            expect( data ).to.have.string( 'https://ma.tt/blog/wp-content/debug.log is not public' );
            expect( data ).to.have.string( 'https://ma.tt/.htpasswd is not public' );
            expect( data ).to.have.string( 'https://ma.tt/.htaccess is not public' );

            done();

        } );

    } );


    it( 'wpscan http://ma.tt --rules-dir ../examples/rules', function( done ) {

        exec( 'wpscan http://ma.tt --rules-dir ../examples/rules' ).then( function( result ) {

            const data = result.stdout.trim();

            expect( data ).to.have.string( 'New site URL: http://ma.tt → https://ma.tt' );
            expect( data ).to.have.string( 'New WordPress URL: https://ma.tt → https://ma.tt/blog' );
            expect( data ).to.have.string( 'https://ma.tt/blog/wp-config.php is public but safe' );
            expect( data ).to.have.string( 'https://ma.tt/blog/wp-admin/maint/repair.php is public but safe' );
            expect( data ).to.have.string( 'https://ma.tt/blog/wp-content/debug.log is not public' );
            expect( data ).to.have.string( 'https://ma.tt/.htpasswd is not public' );
            expect( data ).to.have.string( 'https://ma.tt/.htaccess is not public' );
            expect( data ).to.have.string( 'Custom wpscan rule fired!' );

            done();

        } );

    } );


    it( 'wpscan http://ma.tt -r ../examples/rules', function( done ) {

        exec( 'wpscan http://ma.tt -r ../examples/rules' ).then( function( result ) {

            const data = result.stdout.trim();

            expect( data ).to.have.string( 'New site URL: http://ma.tt → https://ma.tt' );
            expect( data ).to.have.string( 'New WordPress URL: https://ma.tt → https://ma.tt/blog' );
            expect( data ).to.have.string( 'https://ma.tt/blog/wp-config.php is public but safe' );
            expect( data ).to.have.string( 'https://ma.tt/blog/wp-admin/maint/repair.php is public but safe' );
            expect( data ).to.have.string( 'https://ma.tt/blog/wp-content/debug.log is not public' );
            expect( data ).to.have.string( 'https://ma.tt/.htpasswd is not public' );
            expect( data ).to.have.string( 'https://ma.tt/.htaccess is not public' );
            expect( data ).to.have.string( 'Custom wpscan rule fired!' );

            done();

        } );

    } );


    it( 'wpscan http://ma.tt --silent', function( done ) {

        exec( 'wpscan http://ma.tt --silent' ).then( function( result ) {

            const data = result.stdout.trim();

            expect( data ).to.be.empty;

            done();

        } );

    } );


    it( 'wpscan http://ma.tt https://wpengine.com --silent', function( done ) {

        exec( 'wpscan http://ma.tt https://wpengine.com --silent' ).then( function( result ) {

            const data = result.stdout.trim();

            expect( data ).to.be.empty;

            done();

        } );

    } );


    it( 'wpscan ma.tt -s', function( done ) {

        exec( 'wpscan ma.tt -s' ).then( function( result ) {

            const data = result.stdout.trim();

            expect( data ).to.be.empty;

            done();

        } );

    } );


    it( 'wpscan ma.tt wpengine.com -s', function( done ) {

        exec( 'wpscan ma.tt wpengine.com -s' ).then( function( result ) {

            const data = result.stdout.trim();

            expect( data ).to.be.empty;

            done();

        } );

    } );


} );
