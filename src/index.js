import {initMixin} from './init'

/**
 * vue wheels
 * @param {Object} options
 * @constructor Bo
 */
function Bo(options) {
    this._init(options)
}

initMixin(Bo)
new Bo({el: '#app'})
export default Bo