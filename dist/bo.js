// Bo.js v0.1.0 by Iceli (c) 2017-2017.
'use strict';

/*  */

/**
 * vue wheels
 * @param o
 * @constructor
 */
function Bo(o) {
    this.init(o);
}

Bo.prototype.init = function (o) {
    console.log(JSON.stringify(o));
};

new Bo({test: 'Hello Booooooooooooooooooom!'});
