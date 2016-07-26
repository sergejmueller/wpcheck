
/**
 * Required modules
 */

const request = require( 'request' ).defaults( { timeout: 9999 } )
const url = require( './url' )
const log = require( './log' )
const finder = require( './finder' )
const config = require( '../config/app.json' )


/**
 * Initiator method
 *
 * @param   {Object}  data  Initial data
 * @return  void
 */

module.exports.wpscan = ( data ) => {

    // App help
    if ( data.h ) {
        return require( './help' )
    }

    // URL sources
    let sources = data._

    // Bulk file
    if ( data.b ) {
        try {
            sources = [...sources, ...finder.readFileLines( data.b ) ]
        } catch( error ) {
            log.warn( error )
        }
    }

    // Loop sources
    return sources.forEach( url => {

        init( {
            'wpURL': url,
            'siteURL': url,
            'rulesDir': data.r,
            'userAgent': data.u,
            'ignoreRule': data.i,
            'silentMode': data.s
        } ).then( data => {

            return lookupSiteURL( data )

        } ).then( data => {

            return lookupWpURL( data )

        } ).then( data => {

            return loadRules( data )

        } ).catch( error => {

            return log.warn( error )

        } )

    } )

}


/**
 * Validate URl and start lookup
 *
 * @param   {Object}  data  Initial data
 * @return  void
 */

const init = ( data ) => {

    return new Promise( (resolve, reject) => {

        // Init siteURL
        const siteURL = url.normalize( data.siteURL )

        // Invalid URL?
        if ( ! siteURL ) {
            return reject( `${data.siteURL} is not a valid URL` )
        }

        // Save URLs
        data.siteURL = data.wpURL = siteURL

        // Resolve data
        return resolve( data )

    } )

}


/**
 * Lookup for the site URL
 *
 * @param   {Object}  data  Working data
 * @return  void
 */

const lookupSiteURL = ( data ) => {

    return new Promise( (resolve, reject) => {

        // Constants from data
        const { siteURL, userAgent, silentMode } = data

        // Request
        request( {
            url: siteURL,
            method: 'HEAD',
            headers: { 'User-Agent': userAgent }
        }, ( error, response ) => {

            // Handle errors
            if ( error ) {
                return reject( `Can not resolve ${siteURL} (${error.message})` )
            }

            // Status code not OK
            if ( response.statusCode !== 200 ) {
                return reject( `Can not resolve ${siteURL} (${response.statusCode} status code)` )
            }

            // Override siteURL
            if ( url.hasRedirects( response ) ) {
                const finalURL = url.getRedirect( response )

                if ( finalURL ) {
                    data.siteURL = data.wpURL = finalURL

                    log.info( `New site URL: ${siteURL} \u2192 ${finalURL}`, silentMode )
                }
            }

            // Resolve data
            return resolve( data )

        } )

    } )

}


/**
 * Lookup for the WordPress URL
 *
 * @param   {Object}  data  Working data
 * @return  void
 */

const lookupWpURL = ( data ) => {

    return new Promise( (resolve, reject) => {

        // Constants from data
        const { wpURL, siteURL, userAgent, silentMode } = data

        // Test file URL
        const targetURL = `${siteURL}${config.testFile}`

        // Request
        request( {
            url: targetURL,
            method: 'HEAD',
            headers: { 'User-Agent': userAgent }
        }, ( error, response ) => {

            // Extract URL from page content
            if ( error || response.statusCode !== 200 ) {
                return extractWpURL( data ).then( data => {
                    return resolve( data )
                } ).catch( error => {
                    return reject( error )
                } )
            }

            // Override wpURL
            if ( url.hasRedirects( response ) ) {
                const finalURL = url.getRedirect( response )

                if ( finalURL ) {
                    data.wpURL = finalURL

                    // Small talk
                    log.info( `New WordPress URL: ${wpURL} \u2192 ${finalURL}`, silentMode )
                }
            }

            // Resolve data
            return resolve( data )

        } )

    } )
}


/**
 * Extract WordPress URL from page content
 *
 * @param   {Object}  data  Working data
 * @return  void
 */

const extractWpURL = ( data ) => {

    return new Promise( (resolve, reject) => {

        // Constants from data
        const { wpURL, siteURL, userAgent, silentMode } = data

        // Request
        request( {
            url: wpURL,
            method: 'GET',
            headers: { 'User-Agent': userAgent }
        }, ( error, response, body ) => {

            // Handle errors
            if ( error || response.statusCode !== 200 ) {
                return reject( `${siteURL} is not using WordPress (response error)` )
            }

            // Identifier not found
            if ( ! body.includes('/wp-') ) {
                return reject( `${siteURL} is not using WordPress (no references to wp-*)` )
            }

            // Regexp discovery
            body.match( new RegExp( '["\'](https?[^"\']+)\/wp-(?:content|includes)' ) )

            // Unescape matches
            const parsedURL = url.normalize( RegExp.$1 )

            // Validate URL
            if ( ! parsedURL ) {
                return reject( `${siteURL} is not using WordPress (no valid references)` )
            }

            // Override wpURL
            data.wpURL = parsedURL

            // Small talk
            log.info( `New WordPress URL: ${wpURL} \u2192 ${parsedURL}`, silentMode )

            // Resolve data
            return resolve( data )

        } )

    } )
}


/**
 * Load module rules from rules folder
 *
 * @param   {Object}  data  Working data
 * @return  void
 */

const loadRules = ( data ) => {

    // Default rules dir
    let dirPaths = [ config.rulesDir ]

    // Custom rules dir
    if ( data.rulesDir ) {
        dirPaths.push( data.rulesDir )
    }

    // Loop available dirs
    dirPaths.forEach( dirPath => {

        finder.readDir( dirPath, ( error, filePaths ) => {

            if ( error ) {
                return log.warn( error )
            }

            filePaths.map( filePath => {

                return finder.joinPaths( dirPath, filePath )

            } ).filter( filePath => {

                return finder.isFile( filePath, '.js' ) && ! finder.isBlacklistedFile( filePath, data.ignoreRule )

            } ).forEach( filePath => {

                try {
                    return finder.requireFile( filePath ).fire( data )
                } catch( error ) {
                    return log.warn( error )
                }

            } )

        } )

    } )

}
