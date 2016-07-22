'use strict';


require( 'app-module-path' ).addPath( __dirname );
require( 'helpers' );


const
    // npm modules
    request = require( 'request' ).defaults( { timeout: 9999 } ),

    // app modules
    log = require( 'log' ),
    finder = require( 'finder' ),

    // app config
    config = require( '../config/app.json' );


module.exports.wpscan = function( data ) {

    // App help
    if ( data['help'] ) {
        return require( 'help' );
    }

    // URL sources
    let sources = data._;

    // Sources from bulk file
    if ( data['bulk-file'] ) {
        try {
            sources = sources.concat(
                finder.readFileLines( data['bulk-file'] )
            );
        } catch( error ) {
            log.warn( error );
        }
    }

    // Loop sources
    sources.forEach( function( url ) {

        fire( {
            'wpURL': url,
            'siteURL': url,
            'rulesDir': data['rules-dir'],
            'userAgent': data['user-agent'],
            'ignoreRule': data['ignore-rule'],
            'silentMode': data['silent']
        } );

    } );

}


/**
 * Initiator method
 *
 * @param   {Object}  data  Initial data
 * @return  void
 */

function fire( data ) {

    // Init
    var siteURL = data.siteURL.normalizeURL();

    // Invalid URL?
    if ( ! siteURL ) {
        return log.warn( data.siteURL + ' is not a valid URL' );
    }

    // Save urls global
    data.siteURL = data.wpURL = siteURL;

    // Lookup for siteURL
    lookupSiteURL( data );

}


/**
 * Lookup for the site URL
 *
 * @param   {Object}  data  Working data
 * @return  void
 */

function lookupSiteURL( data ) {

    // Init
    const
        siteURL = data.siteURL,
        userAgent = data.userAgent,
        silentMode = data.silentMode;

    // Request
    request( {
        url: siteURL,
        method: 'HEAD',
        headers: { 'User-Agent': userAgent }
    }, function( error, response ) {

        // Handle errors
        if ( error ) {
            return log.warn( 'Can not resolve ' + siteURL + ' (' + error.message + ')' );
        }

        // Status code not OK
        if ( response.statusCode !== 200 ) {
            return log.warn( 'Can not resolve ' + siteURL + ' (' + response.statusCode + ' status code)' );
        }

        // Override siteURL
        if ( response.hasRedirects() ) {
            const finalURL = response.redirectURL().normalizeURL();

            if ( finalURL ) {
                data.siteURL = data.wpURL = finalURL;

                log.info( 'New site URL: ' + siteURL + ' \u2192 ' + finalURL, silentMode );
            }
        }

        // Lookup for wpURL
        lookupWpURL( data );

    } );

}


/**
 * Lookup for the WordPress URL
 *
 * @param   {Object}  data  Working data
 * @return  void
 */

function lookupWpURL( data ) {

    // Init
    const
        wpURL = data.wpURL,
        siteURL = data.siteURL,
        userAgent = data.userAgent,
        silentMode = data.silentMode;

    // Test file URL
    const targetURL = siteURL + config.testFile;

    // Request
    request( {
        url: targetURL,
        method: 'HEAD',
        headers: { 'User-Agent': userAgent }
    }, function( error, response ) {

        // Handle errors
        if ( error || response.statusCode !== 200 ) {
            return extractWpURL( data );
        }

        // Override wpURL
        if ( response.hasRedirects() ) {
            const finalURL = response.redirectURL().normalizeURL();

            if ( finalURL ) {
                data.wpURL = finalURL;

                // Small talk
                log.info( 'New WordPress URL: ' + wpURL + ' \u2192 ' + finalURL, silentMode );
            }
        }

        // Load all rules
        return loadRules( data );

    } );

}


/**
 * Extract WordPress URL from page content
 *
 * @param   {Object}  data  Working data
 * @return  void
 */

function extractWpURL( data ) {

    // Init
    const
        wpURL = data.wpURL,
        siteURL = data.siteURL,
        userAgent = data.userAgent,
        silentMode = data.silentMode;

    // Request
    request( {
        url: wpURL,
        method: 'GET',
        headers: { 'User-Agent': userAgent }
    }, function( error, response, body ) {

        // Handle errors
        if ( error || response.statusCode !== 200 ) {
            return log.warn( siteURL + ' is not using WordPress (response error)' );
        }

        // Identifier not found
        if ( body.indexOf('/wp-') === -1 ) {
            return log.warn( siteURL + ' is not using WordPress (no references to wp-*)' );
        }

        // Regexp discovery
        body.match( new RegExp( '["\'](https?[^"\']+)\/wp-(?:content|includes)' ) );

        // Unescape matches
        const parsedURL = RegExp.$1.unescape().normalizeURL();

        // Validate URL
        if ( ! parsedURL ) {
            return log.warn( siteURL + ' is not using WordPress (no valid references)' );
        }

        // Override wpURL
        data.wpURL = parsedURL;

        // Small talk
        log.info( 'New WordPress URL: ' + wpURL + ' \u2192 ' + data.wpURL, silentMode );

        // Load all rules
        return loadRules( data );

    } );

}


/**
 * Load module rules from rules folder
 *
 * @param   {Object}  data  Working data
 * @return  void
 */

function loadRules( data ) {

    // Default rules dir
    var dirPaths = [ config.rulesDir ];

    // Custom rules dir
    if ( data.rulesDir ) {
        dirPaths.push( data.rulesDir );
    }

    // Loop available dirs
    dirPaths.forEach( function( dirPath ) {

        finder.readDir( dirPath, function( error, filePaths ) {

            if ( error ) {
                return log.warn( error );
            }

            filePaths.map( function( filePath ) {

                return finder.joinPaths( dirPath, filePath );

            } ).filter( function( filePath ) {

                return finder.isFile( filePath, '.js' ) && ! finder.isBlacklistedFile( filePath, data.ignoreRule );

            } ).forEach( function( filePath ) {

                try {
                    finder.requireFile( filePath ).fire( data );
                } catch( error ) {
                    return log.warn( error );
                }

            } );

        } );

    } );

}
