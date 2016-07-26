
/**
 * wpscan module wp-login.js
 * Scan WordPress login page for mistakes
 */


/**
 * Required modules
 */

const request = require( 'request' ).defaults( { followRedirect: false } )
const log = require( '../log' )


/**
 * Initiator method
 *
 * @param   {Object}  data  Data object with request values
 * @return  void
 */

exports.fire = ( data ) => {

    // Constants from data
    const { wpURL, userAgent, silentMode } = data

    // Target URL
    const targetURL = `${wpURL}/wp-login.php`

    // Request
    request( {
        url: targetURL,
        method: 'HEAD',
        headers: { 'User-Agent': userAgent }
    }, ( error, response ) => {

        // Availability check
        if ( error || response.statusCode === 404 ) {
            return log.info( `${targetURL} is not found`, silentMode )
        }

        // HTTPS check
        if ( response.request.uri.protocol !== 'https:' ) {
            log.info( `${targetURL} is not use HTTPS protocol`, silentMode )
        } else {
            log.ok( `${targetURL} use HTTPS protocol`, silentMode )
        }

        // Authentication check
        if ( ! [401, 403].includes( response.statusCode ) ) {
            return log.info( `${targetURL} is not protected by HTTP Auth`, silentMode )
        }

        return log.ok( `${targetURL} is protected by HTTP Auth`, silentMode )

    } )
}
