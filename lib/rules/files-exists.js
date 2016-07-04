/**
 * wpscan module file-exists.js
 * Scans WordPress/Apache system files for vulnerabilities
 */


'use strict';


const
    // npm module
    request = require( 'request' ).defaults( { followRedirect: false } ),

    // app module
    log = require( 'log' );


/**
 * Initiator method
 *
 * @param   {Object}  data  Data object with request values
 * @return  void
 */

exports.fire = function( data ) {

    // Init
    const
        wpURL = data.wpURL,
        siteURL = data.siteURL,
        userAgent = data.userAgent,
        silentMode = data.silentMode;

    // Targets
    const targets = {
        'GET': {
            'DB_PASSWORD': '/wp-config.php'.prepend( wpURL ),
            'repair.php':  '/wp-admin/maint/repair.php'.prepend( wpURL )
        },
        'HEAD': [
            '/.htaccess'.prepend( siteURL ),
            '/.htpasswd'.prepend( siteURL ),
            '/wp-content/debug.log'.prepend( wpURL )
        ]
    };

    // Loop HEAD requests
    targets.HEAD.forEach( function( targetURL ) {

        request( {
            url: targetURL,
            method: 'HEAD',
            headers: { 'User-Agent': userAgent }
        }, function( error, response ) {

            if ( error || response.statusCode !== 200 ) {
                return log.ok( targetURL + ' is not public', silentMode );
            }

            return log.warn( targetURL + ' is public' );

        } );

    } );

    // Loop GET requests
    Object.keys( targets.GET ).forEach( function( ident ) {

        const targetURL = targets.GET[ident];

        request( {
            url: targetURL,
            method: 'GET',
            headers: { 'User-Agent': userAgent }
        }, function( error, response, body ) {

            if ( error || response.statusCode !== 200 ) {
                return log.ok( targetURL + ' is not public', silentMode );
            }

            if ( body.indexOf( ident ) === -1 ) {
                return log.info( targetURL + ' is public but safe', silentMode );
            }

            return log.warn( targetURL + ' is public and not safe' );

        } );

    } );

};
