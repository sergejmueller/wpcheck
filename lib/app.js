'use strict';


require( 'app-module-path' ).addPath( __dirname );
require( 'helpers' );


const
    // npm modules
    fs = require( 'fs' ),
    path = require( 'path' ),
    request = require( 'request' ).defaults( { timeout: 9999 } ),

    // app modules
    log = require( 'log' ),
    config = require( '../config.json' );


module.exports.wpscan = function( data ) {

    // App help
    if ( data['help'] ) {
        return console.log(
            config.help.format,
            config.help.usage,
            config.help.options.join("\n\t")
        );
    }

    // URL sources
    let sources = data._;

    // Sources from bulk file
    if ( data['bulk-file'] ) {
        data['bulk-file'] = data['bulk-file'].makeAbsolute();

        try {
            if ( fs.statSync( data['bulk-file'] ).isFile() ) {
                sources = sources.concat(
                    fs.readFileSync( data['bulk-file'] ).toString().split("\n").filter(Boolean)
                );
            }
        } catch( error ) {
            log.warn( error );
        }
    }

    // Loop sources
    sources.forEach( function( siteURL ) {

        fire( {
            'wpURL': siteURL,
            'siteURL': siteURL,
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
    const targetURL = siteURL + config.app.testFile;

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

    // Init rules dirs
    var dirs = [ config.app.rulesDir.makeAbsolute() ];

    // Handle custom rules dir
    if ( data.rulesDir ) {
        data.rulesDir = data.rulesDir.makeAbsolute();

        try {
            if ( fs.statSync( data.rulesDir ).isDirectory() ) {
                dirs.push( data.rulesDir );
            }
        } catch( error ) {
            log.warn( error );
        }
    }

    // Loop available paths
    dirs.forEach( function( dir ) {

        fs.readdir( dir, function( error, files ) {

            if ( error ) {
                return log.warn( error );
            }

            files.map( function( file ) {

                return path.join( dir, file );

            } ).filter( function( file ) {

                return fs.statSync( file ).isFile() &&
                    ( path.extname( file ) === '.js' ) &&
                    ( ! data.ignoreRule.includes( path.basename( file ) ) );

            } ).forEach( function( file ) {

                // Require & start rule
                try {
                    require( file ).fire( data );
                } catch( error ) {
                    return log.warn( error );
                }

            } );

        } );

    } );

}
