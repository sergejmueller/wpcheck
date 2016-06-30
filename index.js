#!/usr/bin/env node


'use strict';


const
    app = require( './lib/app' ),
    minimist = require( 'minimist' );

const argv = minimist(
    process.argv.slice(2),
    {
        alias: {
            's': 'silent',
            'r': 'rules-dir'
        },
        default: {
            'wpURL': null,
            'siteURL': null,
            'silent': false,
            'rules-dir': null
        },
        string: [
            'wpURL',
            'siteURL',
            'rules-dir'
        ],
        boolean: [
            'silent'
        ]
    }
);


argv._.forEach( function( siteURL ) {

    app.fire( {
        'silent': argv['silent'],
        'rulesDir': argv['rules-dir'],
        'wpURL': siteURL,
        'siteURL': siteURL
    } );

} );
