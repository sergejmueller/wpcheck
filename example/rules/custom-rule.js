
/**
 * wpcheck module custom-rule.js
 * Example custom wpcheck module
 */


/**
 * Initiator method
 *
 * @param   {Object}  data  Data object with request values
 * @return  void
 */

exports.fire = ( data ) => {

    console.log( 'Custom wpcheck rule is fired' )

    console.log( data )

}
