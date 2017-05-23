// Bo.js v0.1.0 by Iceli (c) 2017-2017.
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Bo = factory());
}(this, (function () { 'use strict';

/*  */
let uid = 0;

function initMixin(Bo) {
    Bo.prototype.$mount = function (el) {
        if(typeof el === 'string' && typeof window !== 'undefined') {
            el = document.querySelector(el);
            if(!el) {
                el = document.createElement('div');
            }
        } else {
            el = undefined;
        }

        this.$el = el;

        return this
    };

    Bo.prototype._init = function (o) {
        const vm = this;

        vm._uid = uid++;

        vm.$options = o || {};
        console.log(JSON.stringify(o));
        if (vm.$options.el) {
            vm.$mount(vm.$options.el);
        }
    };


}

/**
 * vue wheels
 * @param {Object} options
 * @constructor Bo
 */
function Bo(options) {
    this._init(options);
}

initMixin(Bo);

return Bo;

})));
