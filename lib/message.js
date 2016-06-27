'use strict';


const colors = require('colors');


/**
 * Error output & exit
 *
 * @param   {String}  msg  Error message
 * @return  void
 */

exports.die = function( msg ) {

    console.error( colors.red( '\u2718 %s' ), msg );
    process.exit(1);

};


/**
 * Warning output
 *
 * @param   {String}  msg  Warning message
 * @return  void
 */

exports.warn = function( msg ) {

    console.warn( colors.red( '\u2718 %s' ), msg );

};


/**
 * Success output
 *
 * @param   {String}   msg     Success message
 * @param   {Boolean}  silent  Skip logging if silent is true
 * @return  void
 */

exports.success = function( msg, silent ) {

    if ( silent !== true ) {
        console.log( colors.green( '\u2714 %s' ), msg );
    }

};


/**
 * Info output
 *
 * @param   {String}   msg     Notice message
 * @param   {Boolean}  silent  Skip logging if silent is true
 * @return  void
 */

exports.info = function( msg, silent ) {

    if ( silent !== true ) {
        console.log( colors.yellow( '\u2139 %s' ), msg );
    }

};
