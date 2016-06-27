#!/usr/bin/env node


'use strict';


const
    app = require( './lib/app' ),
    argv = require( 'minimist' )( process.argv.slice(2) );


argv._.forEach( function( siteURL ) {

    app.fire( {
        'silent': argv['silent'],
        'rulesDir': argv['rules-dir'],
        'wpURL': siteURL,
        'siteURL': siteURL
    } );

} );
