
/**
 * wpscan module custom-rule.js
 * Example custom wpscan module
 */


/**
 * Initiator method
 *
 * @param   {Object}  data  Data object with request values
 * @return  void
 */

exports.fire = ( data ) => {

    console.log( 'Custom wpscan rule fired!' )

    console.log( data )

}
