#!/usr/bin/env node


'use strict';


if ( ! require( 'semver' ).satisfies(
    process.versions.node,
    require( './package.json' ).engines.node
) ) {
    console.error( 'Incorrect Node.js version' );
    process.exit();
}


require( './lib/app' ).wpscan(
    require( 'minimist' )(
        process.argv.slice( 2 ),
        require( './config.json' ).minimist
    )
);
