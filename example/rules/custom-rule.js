
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

    console.log( 'Custom wpscan rule is fired' )

    console.log( data )

}
