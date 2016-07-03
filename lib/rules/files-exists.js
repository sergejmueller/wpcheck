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
        silent = data.silent;

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
    targets.HEAD.forEach( function( target ) {

        request.head( target, function( error, response ) {

            if ( error || response.statusCode !== 200 ) {
                return log.ok( target + ' is not public', silent );
            }

            return log.warn( target + ' is public' );

        } );

    } );

    // Loop GET requests
    Object.keys( targets.GET ).forEach( function( ident ) {

        const target = targets.GET[ident];

        request.get( target, function( error, response, body ) {

            if ( error || response.statusCode !== 200 ) {
                return log.ok( target + ' is not public', silent );
            }

            if ( body.indexOf( ident ) === -1 ) {
                return log.info( target + ' is public but safe', silent );
            }

            return log.warn( target + ' is public and not safe' );

        } );

    } );

};
