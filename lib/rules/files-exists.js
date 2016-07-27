
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

    // Destinations
    const targets = [
        {
            'url': `${wpURL}/wp-config.php`,
            'method': 'HEAD',
            'pattern': 'DB_PASSWORD'
        },
        {
            'url': `${wpURL}/wp-admin/maint/repair.php`,
            'method': 'HEAD',
            'pattern': 'repair.php'
        },
        {
            'url': `${siteURL}/.htaccess`
        },
        {
            'url': `${siteURL}/.htpasswd`
        },
        {
            'url': `${siteURL}/.ssh`
        },
        {
            'url': `${siteURL}/.npmrc`
        },
        {
            'url': `${siteURL}/.gitconfig`
        },
        {
            'url': `${siteURL}/config.json`
        },
        {
            'url': `${wpURL}/wp-config-sample.php`
        },
        {
            'url': `${wpURL}/wp-content/debug.log`
        }
    ]

    targets.forEach( ( { url, method = 'GET', pattern = null } ) => {

        request( {
            'url': url,
            'method': method,
            'headers': { 'User-Agent': userAgent }
        }, ( error, response, body ) => {

            if ( error || response.statusCode !== 200 ) {
                return log.ok( `${url} is not public`, silentMode )
            }

            if ( ! pattern ) {
                return log.warn( `${url} is public` )
            }

            if ( ! body.includes( pattern ) ) {
                return log.info( `${url} is public but safe`, silentMode )
            }

            return log.warn( `${url} is public and not safe` )

        } )

    } )

}
