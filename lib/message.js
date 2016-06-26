'use strict';


var colors = require('colors');


/**
 * Error output & exit
 *
 * @param   {String}  msg  Error message
 * @return  void
 */

exports.die = function(msg) {

    console.error( colors.red( '\u2718 %s' ), msg );
    process.exit(1);

};


/**
 * Warning output
 *
 * @param   {String}  msg  Warning message
 * @return  void
 */

exports.warn = function(msg) {

    console.warn( colors.red( '\u2718 %s' ), msg );

};


/**
 * Success output
 *
 * @param   {String}  msg  Success message
 * @return  void
 */

exports.success = function(msg) {

    console.log( colors.green( '\u2714 %s' ), msg );

};


/**
 * Notice output
 *
 * @param   {String}  msg  Notice message
 * @return  void
 */

exports.notice = function(msg) {

    console.log( colors.yellow( '\u2714 %s' ), msg );

};
