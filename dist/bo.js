// Bo.js v0.1.0 by Iceli (c) 2017-2017.
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Bo = factory());
}(this, (function () { 'use strict';

/*  */

function compile(html, options) {
    var re = /{{([^}}]+)?}}/g, reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g, code = 'var r=[];\n', cursor = 0, match;
    var add = function(line, js) {
        js? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
            (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
        return add;
    };
    while(match = re.exec(html)) {
        add(html.slice(cursor, match.index))(match[1], true);
        cursor = match.index + match[0].length;
    }
    add(html.substr(cursor, html.length - cursor));
    code += 'return r.join("");';
    return new Function(code.replace(/[\r\t\n]/g, '')).apply(options);
}

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

        this.$el.innerHTML = compile(this.$el.innerHTML, this._data);


        return this
    };

    Bo.prototype._init = function (o) {
        const vm = this;

        vm._uid = uid++;
        vm._watchers = [];
        vm._directives  = [];

        vm.$options = o || {};
        vm._data = vm.$options.data;

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

return Bo;

})));
