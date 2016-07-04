/**
 * wpscan module wp-login.js
 * Scans WordPress login page for vulnerabilities
 */


'use strict';


const
    // npm module
    request = require( 'request' ).defaults( { followRedirect: false } ),

    // app modules
    log = require( 'log' ),
    config = require( 'config' );


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
        userAgent = data.userAgent,
        silentMode = data.silentMode;

    // Target URL
    const targetURL = wpURL + config.loginPage;

    // Request
    request( {
        url: targetURL,
        method: 'HEAD',
        headers: { 'User-Agent': userAgent }
    }, function( error, response ) {

        // Availability check
        if ( error || response.statusCode === 404 ) {
            return log.warn( targetURL + ' is not found' );
        }

        // HTTPS check
        if ( response.request.uri.protocol !== 'https:' ) {
            log.warn( targetURL + ' is not use HTTPS protocol' );
        } else {
            log.ok( targetURL + ' use HTTPS protocol', silentMode );
        }

        // Authentication check
        if ( [401, 403].indexOf( response.statusCode ) === -1 ) {
            return log.warn( targetURL + ' is not protected by HTTP Auth' );
        }

        return log.ok( targetURL + ' is protected by HTTP Auth', silentMode );

    } );
};
