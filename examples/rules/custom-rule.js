'use strict';


const message = require( 'message' );


/**
 * Initiator method
 *
 * @param   {Object}  data  Data object with request values
 * @return  void
 */

exports.fire = function( data ) {

    message.success( 'Custom wpscan rule fired!', data.silent );

    // console.log( data );

}
