
/**
 * Required modules
 */

const colors = require( 'colors' )


module.exports = {

    /**
     * Log a warning message
     *
     * @param   {String}  msg  Message to log
     * @return  void
     */

    warn( msg ) {

        console.warn( colors.red( '\u2718 %s' ), msg )

    },


    /**
     * Log a success message
     *
     * @param   {String}   msg     Message to log
     * @param   {Boolean}  silent  Skip logging if silent command fired
     * @return  void
     */

    ok( msg, silent ) {

        if ( silent !== true ) {
            console.log( colors.green( '\u2714 %s' ), msg )
        }

    },


    /**
     * Log a info message
     *
     * @param   {String}   msg     Message to log
     * @param   {Boolean}  silent  Skip logging if silent command fired
     * @return  void
     */

    info( msg, silent ) {

        if ( silent !== true ) {
            console.log( colors.yellow( '\u2139 %s' ), msg )
        }

    }

}
