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



let uid$1 = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
class Dep {
  
  
  

  constructor () {
    this.id = uid$1++;
    this.subs = [];
  }

  addSub (sub) {
    this.subs.push(sub);
  }

  removeSub (sub) {
      const index = this.subs.indexOf(sub);
      if (index > -1) {
          return this.subs.splice(index, 1)
      }
  }

  depend () {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  }

  notify () {
    // stabilize the subscriber list first
    const subs = this.subs.slice();
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update();
    }
  }
}

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null;

/*  */

/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 */
class Observer {
    
    

    constructor(value) {
        this.value = value;
        this.dep = new Dep();
        let self = this;
        Object.defineProperty(value, '__ob__', {
            value: self,
            enumerable: false,
            writable: true,
            configurable: true
        });
        if (Array.isArray(value)) {
            this.observeArray(value);
        } else {
            this.walk(value);
        }
    }

    /**
     * Walk through each property and convert them into
     * getter/setters. This method should only be called when
     * value type is Object.
     */
    walk(obj) {
        const keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
            defineReactive(obj, keys[i], obj[keys[i]]);
        }
    }

    /**
     * Observe a list of Array items.
     */
    observeArray(items) {
        for (let i = 0, l = items.length; i < l; i++) {
            observe(items[i]);
        }
    }
}

function observe(value) {
    if (value === null || typeof value !== 'object') {
        return
    }
    let ob;
    if (value.hasOwnProperty('__ob__') && value.__ob__ instanceof Observer) {
        ob = value.__ob__;
    } else if (
        !value._isVue &&
        Object.isExtensible(value) &&
        (Array.isArray(value) || Object.prototype.toString.call(value) === '[object Object]')
    ){
        ob = new Observer(value);
    }

    return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive(obj,
                               key,
                               val) {
    const dep = new Dep();

    const property = Object.getOwnPropertyDescriptor(obj, key);
    if (property && property.configurable === false) {
        return
    }

    // cater for pre-defined getter/setters
    const getter = property && property.get;
    const setter = property && property.set;

    let childOb = observe(val);
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {
            const value = getter ? getter.call(obj) : val;
            if (Dep.target) {
                dep.depend();
                if (childOb) {
                    childOb.dep.depend();
                }
                if (Array.isArray(value)) {
                    dependArray(value);
                }
            }
            return value
        },
        set: function reactiveSetter(newVal) {
            const value = getter ? getter.call(obj) : val;
            /* eslint-disable no-self-compare */
            if (newVal === value || (newVal !== newVal && value !== value)) {
                return
            }
            if (setter) {
                setter.call(obj, newVal);
            } else {
                val = newVal;
            }
            childOb = observe(newVal);
            dep.notify();
        }
    });
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray(value) {
    for (let e, i = 0, l = value.length; i < l; i++) {
        e = value[i];
        e && e.__ob__ && e.__ob__.dep.depend();
        if (Array.isArray(e)) {
            dependArray(e);
        }
    }
}

/*  */

let uid = 0;

function initMixin(Bo) {
    Bo.prototype.$mount = function (el) {
        if (typeof el === 'string' && typeof window !== 'undefined') {
            el = document.querySelector(el);
            if (!el) {
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

        vm._isVue = true;
        vm._uid = uid++;
        vm._watchers = [];
        vm._directives = [];

        vm.$options = o || {};
        vm._data = vm.$options.data;

        for(let key in vm._data) {
            this._proxy(key);
        }

        observe(vm._data, this);

        if (vm.$options.el) {
            vm.$mount(vm.$options.el);
        }
    };

    Bo.prototype._proxy = function (val) {

        let self = this;

        Object.defineProperty(self, val, {
            configurable: true,
            enumerable: true,
            get() {
                return self._data[val]
            },
            set(v) {
                self._data[val] = v;
            }
        });
    };

}

function Bo(options) {
    this._init(options);
}

initMixin(Bo);

return Bo;

})));
