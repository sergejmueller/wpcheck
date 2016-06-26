'use strict';


require( 'app-module-path' ).addPath( __dirname );
require( 'helpers' );


var app = {},
    fs = require( 'fs' ),
    path = require( 'path' ),
    rtrim = require( 'rtrim' ),
    request = require( 'request' ),
    validUrl = require( 'valid-url' );

var config = require( 'config' ),
    message = require( 'message' );


/**
 * Initiator method
 *
 * @param   {Object}  data  Initial data
 * @return  void
 */

app.fire = function( data ) {

    // Clean siteURL
    var siteURL = rtrim( data.siteURL, '/' );

    // Validate site url
    if ( ! validUrl.isWebUri( siteURL ) ) {
        message.die( 'Invalid site URL' );
    }

    // Save site url global
    data.siteURL = data.wpURL = siteURL;

    // Lookup for siteURL
    app.lookupSiteURL( data );

};


/**
 * Lookup for the site URL
 *
 * @param   {Object}  data  Working data
 * @return  void
 */

app.lookupSiteURL = function( data ) {

    // Init vars
    var siteURL = data.siteURL;

    // HEAD request
    request.head( siteURL, function( error, response ) {

        // Handle errors
        if ( error || response.statusCode !== 200 ) {
            return message.die( 'Can not resolve ' + siteURL );
        }

        // Override siteURL
        if ( response.hasRedirects() ) {
            var finalURL = rtrim( response.redirectURL(), '/' );

            if ( validUrl.isWebUri( finalURL ) ) {
                data.siteURL = data.wpURL = finalURL;

                if ( data.silent !== true ) {
                    message.notice( 'New site URL: ' + siteURL + ' \u2192 ' + data.siteURL );
                }
            }
        }

        // Lookup for wpURL
        app.lookupWpURL( data );

    } );

};


/**
 * Lookup for the WordPress URL
 *
 * @param   {Object}  data  Working data
 * @return  void
 */

app.lookupWpURL = function( data ) {

    // Init vars
    var wpURL = data.wpURL,
        siteURL = data.siteURL;

    // HEAD request
    request.head( config.testFile.prepend( siteURL ), function( error, response ) {

        // Handle errors
        if ( error || response.statusCode !== 200 ) {
            return app.extractWpURL( data );
        }

        // Override wpURL
        if ( response.hasRedirects() ) {
            var finalURL = rtrim( response.redirectURL(), '/' );

            if ( validUrl.isWebUri( finalURL ) ) {
                data.wpURL = finalURL;

                // Small talk
                if ( data.silent !== true ) {
                    message.notice( 'New WordPress URL: ' + wpURL + ' \u2192 ' + data.wpURL );
                }
            }
        }

        // Load all rules
        return app.loadRules( data );

    } );

};


/**
 * Extract WordPress URL from page content
 *
 * @param   {Object}  data  Working data
 * @return  void
 */

app.extractWpURL = function( data ) {

    // Init vars
    var wpURL = data.wpURL,
        siteURL = data.siteURL;

    // GET request
    request( wpURL, function ( error, response, body ) {

        // Handle errors
        if ( error || response.statusCode !== 200 ) {
            return message.die( siteURL + ' is not using WordPress (1)' );
        }

        // Identifier not found
        if ( body.indexOf('/wp-') === -1 ) {
            return message.die( data.siteURL + ' is not using WordPress (2)' );
        }

        // Regexp discovery
        body.match( new RegExp( '["\'](https?[^"\']+)\/wp-(?:content|includes)' ) );

        // Simple unescape
        var parsedURL = RegExp.$1.unescape();

        // Validate URL
        if ( ! validUrl.isWebUri( parsedURL ) ) {
            return message.die( siteURL + ' is not using WordPress (3)' );
        }

        // Override wpURL
        data.wpURL = parsedURL;

        // Small talk
        if ( data.silent !== true ) {
            message.notice( 'New WordPress URL: ' + wpURL + ' \u2192 ' + data.wpURL );
        }

        // Load all rules
        return app.loadRules( data );

    } );

};


/**
 * Load module rules from rules folder
 *
 * @param   {Object}  data  Working data
 * @return  void
 */

app.loadRules = function( data ) {

    // Init rules dirs
    var dirs = [ path.join( __dirname, config.rulesDir ) ];

    // Handle custom rules dir
    if ( data['rules-dir'] ) {
        if ( ! path.isAbsolute( data['rules-dir'] ) ) {
            message.die( 'Rules dir must be absolute' );
        }

        dirs.push( data['rules-dir'].toString() );
    }

    // Normalize paths
    dirs.map( function( dir ) {
        return path.normalize( dir );
    } );

    // Loop available paths
    dirs.forEach( function( dir ) {

        fs.readdir( dir, function( error, files ) {

            if ( error ) {
                throw error;
            }

            files.map( function( file ) {

                return path.join( dir, file );

            } ).filter( function( file ) {

                return fs.statSync( file ).isFile() && path.extname( file ) === '.js';

            } ).forEach( function( file ) {

                // Require & start rule
                require( file ).fire( data );

            } );

        } );

    } );

};

module.exports = app;
