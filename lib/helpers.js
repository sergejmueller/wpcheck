'use strict';


/**
 * Add a string to the beginning of a string
 *
 * @param   {String}  str  Custom string
 * @return  {String}       Concated string
 */

String.prototype.prepend = function( str ) {
    return str.toString() + this.toString();
};


/**
 * Replace all escaped slashes from a string
 *
 * @param   void
 * @return  {String}  Cleaned string
 */

String.prototype.unescape = function() {
    return this.replace( /\\/g, '' );
};


/**
 * Checks for existing redirects based on [request] Node.js module
 *
 * @param   void
 * @return  {boolean}  true → has redirects, false → no redirects
 */

Object.prototype.hasRedirects = function() {
    return !!this.request._redirect.redirects.length;
};


/**
 * Returns final redirect URL based on [request] Node.js module
 *
 * @param   void
 * @return  {String}  Redirect URL
 */

Object.prototype.redirectURL = function() {
    return this.request.uri.href;
};
