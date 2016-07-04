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
            'r': 'rules-dir',
            'u': 'user-agent'
        },
        default: {
            'silent': false,
            'rules-dir': null,
            'user-agent': '-'
        },
        string: [
            'rules-dir',
            'user-agent'
        ],
        boolean: [
            'silent'
        ]
    }
);


argv._.forEach( function( siteURL ) {

    app.fire( {
        'wpURL': siteURL,
        'siteURL': siteURL,
        'rulesDir': argv['rules-dir'],
        'userAgent': argv['user-agent'],
        'silentMode': argv['silent']
    } );

} );
