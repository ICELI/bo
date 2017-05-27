/* @flow */

import {compile} from './compiler'
import {observe} from './observer'

let uid = 0

export function initMixin(Bo: Class) {
    Bo.prototype.$mount = function (el: string | Element) {
        if (typeof el === 'string' && typeof window !== 'undefined') {
            el = document.querySelector(el)
            if (!el) {
                el = document.createElement('div')
            }
        } else {
            el = undefined
        }

        this.$el = el

        this._compile(this.$el.innerHTML, this._data)

        return this
    }

    Bo.prototype._init = function (o: Object) {
        const vm = this

        vm._isVue = true
        vm._uid = uid++
        vm._watchers = []
        vm._directives = []

        // initData
        vm.$options = o || {}
        vm._data = vm.$options.data

        for(let key in vm._data) {
            this._proxy(key)
        }

        observe(vm._data, this)

        // init
        if (vm.$options.el) {
            vm.$mount(vm.$options.el)
        }
    }

    Bo.prototype._proxy = function (val: any) {

        let self = this

        Object.defineProperty(self, val, {
            configurable: true,
            enumerable: true,
            get() {
                return self._data[val]
            },
            set(v) {
                self._data[val] = v
            }
        })
    }

    Bo.prototype._compile = function () {
        let render = this.$options.render = compile(this.$el.innerHTML) || function () {}

        this.$el.innerHTML = render.apply(this._data)
    }
}
