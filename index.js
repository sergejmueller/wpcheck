#!/usr/bin/env node


'use strict';


require( './lib/app' ).init(
    require( 'minimist' )(
        process.argv.slice( 2 ),
        require( './config.json' ).minimist
    )
);
