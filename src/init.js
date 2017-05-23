/* @flow */

import {compile} from './compiler'

let uid = 0

export function initMixin(Bo: Class) {
    Bo.prototype.$mount = function (el: string | Element) {
        if(typeof el === 'string' && typeof window !== 'undefined') {
            el = document.querySelector(el)
            if(!el) {
                el = document.createElement('div')
            }
        } else {
            el = undefined
        }

        this.$el = el

        this.$el.innerHTML = compile(this.$el.innerHTML, this._data)


        return this
    }

    Bo.prototype._init = function (o: Object) {
        const vm = this

        vm._uid = uid++
        vm._watchers = []
        vm._directives  = []

        vm.$options = o || {}
        vm._data = vm.$options.data

        console.log(JSON.stringify(o))
        if (vm.$options.el) {
            vm.$mount(vm.$options.el)
        }
    }


}