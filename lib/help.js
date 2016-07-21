'use strict';


const config = require( '../config/help.json' );


console.log(
    config.format,
    config.usage,
    config.options.join("\n\t")
);
