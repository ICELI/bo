/* @flow */

/**
 * vue wheels
 * @param o
 * @constructor
 */
function Bo(o: Object) {
    this.init(o)
}

Bo.prototype.init = function (o: Object) {
    console.log(JSON.stringify(o))
}

new Bo({test: 'Hello Booooooooooooooooooom!'})