// Bo.js v0.1.0 by Iceli (c) 2017-2017.
'use strict';

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

        console.log(this);
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

function Bo(options) {
    this._init(options);
}

initMixin(Bo);
new Bo({el: '#app'});

module.exports = Bo;
