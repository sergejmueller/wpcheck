
/**
 * wpscan module file-exists.js
 * Check WordPress/Apache/Dot files for their availability
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
    const { wpURL, siteURL, userAgent, silentMode } = data

    // Targets
    const targets = {
        'GET': new Map( [
            [ 'DB_PASSWORD', `${wpURL}/wp-config.php` ],
            [ 'repair.php', `${wpURL}/wp-admin/maint/repair.php` ]
        ] ),
        'HEAD': [
            // Apache files
            `${siteURL}/.htaccess`,
            `${siteURL}/.htpasswd`,

            // Sensitive dotfiles
            `${siteURL}/.ssh`,
            `${siteURL}/.npmrc`,
            `${siteURL}/.gitconfig`,
            `${siteURL}/config.json`,
            `${siteURL}/config.gypi`,

            // WordPress files
            `${wpURL}/wp-config-sample.php`,
            `${wpURL}/wp-content/debug.log`
        ]
    }

    // Loop HEAD requests
    targets.HEAD.forEach( targetURL => {

        request( {
            url: targetURL,
            method: 'HEAD',
            headers: { 'User-Agent': userAgent }
        }, ( error, response ) => {

            if ( error || response.statusCode !== 200 ) {
                return log.ok( `${targetURL} is not public`, silentMode )
            }

            return log.warn( `${targetURL} is public` )

        } )

    } )

    // Loop GET requests
    for( let [ident, targetURL] of targets.GET.entries() ) {

        request( {
            url: targetURL,
            method: 'GET',
            headers: { 'User-Agent': userAgent }
        }, ( error, response, body ) => {

            if ( error || response.statusCode !== 200 ) {
                return log.ok( `${targetURL} is not public`, silentMode )
            }

            if ( ! body.includes( ident ) ) {
                return log.info( `${targetURL} is public but safe`, silentMode )
            }

            return log.warn( `${targetURL} is public and not safe` )

        } )

    }

}
