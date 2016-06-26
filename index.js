#!/usr/bin/env node


'use strict';


var app = require( './lib/app' ),
    argv = require( 'minimist' )( process.argv.slice(2) );


argv._.forEach( function( siteURL ) {

    app.fire( {
        'silent': argv['silent'],
        'rules-dir': argv['rules-dir'],
        'wpURL': siteURL,
        'siteURL': siteURL
    } );

} );
