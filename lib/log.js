
/**
 * Required modules
 */

const colors = require( 'colors' )
const padEnd = require( 'pad-end' )


module.exports = {

    /**
     * Log a warning message
     *
     * @param   {String}  userMsg  Message to log
     * @param   {Object}           Filter name
     * @return  void
     */

    warn( userMsg, { filterName } = {} ) {

        const msgPrimary = colors.red( `\u2718 ${userMsg}` )

        if ( filterName ) {
            const msgSecondary = colors.gray( filterName )

            return console.warn(
                this.padEnd( msgPrimary, msgSecondary )
            )
        }

        return console.warn( msgPrimary )

    },


    /**
     * Log a success message
     *
     * @param   {String}  userMsg  Message to log
     * @param   {Object}           Silent mode, filter name
     * @return  void
     */

    ok( userMsg, { silentMode, filterName } = {} ) {

        if ( silentMode ) {
            return
        }

        const msgPrimary = colors.green( `\u2714 ${userMsg}` )

        if ( filterName ) {
            const msgSecondary = colors.gray( filterName )

            return console.log(
                this.padEnd( msgPrimary, msgSecondary )
            )
        }

        return console.log( msgPrimary )

    },


    /**
     * Log a info message
     *
     * @param   {String}  userMsg  Message to log
     * @param   {Object}           Silent mode, filter name
     * @return  void
     */

    info( userMsg, { silentMode, filterName } = {} ) {

        if ( silentMode ) {
            return
        }

        const msgPrimary = colors.yellow( `\u2139 ${userMsg}` )

        if ( filterName ) {
            const msgSecondary = colors.gray( filterName )

            return console.log(
                this.padEnd( msgPrimary, msgSecondary )
            )
        }

        return console.log( msgPrimary )

    },


    /**
     * Pads the current string with spaces and add a string
     *
     * @param   {String}  msgPrimary    Primary string
     * @param   {String}  msgSecondary  Secondary (gray) string
     * @return  {String}                Concated string
     */

    padEnd( msgPrimary, msgSecondary ) {

        return `${padEnd( msgPrimary, 99 )} ${msgSecondary}`

    }

}
