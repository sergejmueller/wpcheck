'use strict';


const finder = {}
const fs = require( 'fs' )
const path = require('path')


/**
 * Checks whether the file path is a regular file
 *
 * @param   {String}   filePath  File name
 * @param   {String}   fileExt   File extension
 * @return  {Boolean}  True if a valid file
 */

finder.isFile = ( filePath, fileExt ) => {

    if ( ! fs.statSync( finder.absolutePath( filePath ) ).isFile() ) {
        return false;
    }

    if ( fileExt ) {
        return path.extname( filePath ) === fileExt;
    }

    return true;

}


/**
 * Checks whether the dirpath is a regular directory
 *
 * @param   {String}   dirPath  Directory name
 * @return  {Boolean}  True if a valid directory
 */

finder.isDir = ( dirPath ) => {

    return fs.statSync( finder.absolutePath( dirPath ) ).isDirectory();

}


/**
 * Reads and returns the content of a file
 *
 * @param   {String}  filePath  File name
 * @return  {Mixed}             File content
 */

finder.readFile = ( filePath ) => {

    return fs.readFileSync( finder.absolutePath( filePath ) );

}


/**
 * Reads the content of a directory
 *
 * @param   {String}   dirPath   Directory name
 * @param   {String}   callback  Callback function
 * @return  {Object}             Content object
 */

finder.readDir = ( dirPath, callback ) => {

    fs.readdir( finder.absolutePath( dirPath ), callback );

}


/**
 * Reads and returns content lines of a file
 *
 * @param   {String}  filePath  File name
 * @return  {Array}             Content lines
 */

finder.readFileLines = ( filePath ) => {
    return finder.readFile( filePath ).toString().split( "\n" ).filter( Boolean )
}


/**
 * Loads a module from a JavaScript file
 *
 * @param   {String}  filePath  File name
 * @return  {Object}            module.exports from the resolved module
 */

finder.requireFile = ( filePath ) => {

    return require( finder.absolutePath( filePath ) );

}


/**
 * Checks if a file is blacklisted
 *
 * @param   {String}  filePath   File name
 * @param   {Array}   blacklist  Blacklisted items
 * @return  {Boolean}            True if the file is blacklisted
 */

finder.isBlacklistedFile = ( filePath, blacklist ) => {

    return blacklist.includes( path.basename( filePath ) );

}


/**
 * Makes a path absolute
 *
 * @param   {String}  objPath  Object path
 * @return  {String}           Absolute path
 */

finder.absolutePath = ( objPath ) => {

    if ( path.isAbsolute( objPath ) ) {
        return objPath;
    }

    return path.join( __dirname, '..', objPath );

}


/**
 * Join two paths
 *
 * @param   {String}  path1  First path
 * @param   {String}  path2  Second path
 * @return  {String}         Joined paths
 */

finder.joinPaths = ( path1, path2 ) => {

    return path.join( path1, path2 );

}


module.exports = finder;
