'use strict';


var message = require( 'message' ),
    request = require( 'request' ).defaults( { followRedirect: false } );


/**
 * Initiator method
 *
 * @param   {Object}  data  Data object with request values
 * @return  void
 */

exports.fire = function( data ) {

    // Init vars
    var wpURL = data.wpURL,
        siteURL = data.siteURL;

    // Targets
    var targets = {
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
                if ( data.silent !== true ) {
                    message.success( target + ' is not public' );
                }

                return;
            }

            return message.warn( target + ' is public' );

        } );

    } );

    // Loop GET requests
    Object.keys(targets.GET).forEach( function( ident ) {

        var target = targets.GET[ident];

        request.get( target, function( error, response, body ) {

            if ( error || response.statusCode !== 200 ) {
                if ( data.silent !== true ) {
                    message.success( target + ' is not public' );
                }

                return;
            }

            if ( body.indexOf( ident ) === -1 ) {
                if ( data.silent !== true ) {
                    message.notice( target + ' is public but safe' );
                }

                return;
            }

            return message.warn( target + ' is public and not safe' );

        } );

    } );

};
