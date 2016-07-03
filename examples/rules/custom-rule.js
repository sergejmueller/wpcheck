'use strict';


const log = require( 'log' );


/**
 * Initiator method
 *
 * @param   {Object}  data  Data object with request values
 * @return  void
 */

exports.fire = function( data ) {

    log.ok( 'Custom wpscan rule fired!', data.silent );

    // console.log( data );

}
