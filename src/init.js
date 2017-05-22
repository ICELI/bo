/* @flow */
let uid = 0

export function initMixin(Bo: Class) {
    Bo.prototype.$mount = function (el) {
        if(typeof el === 'string' && typeof window !== 'undefined') {
            el = document.querySelector(el)
            if(!el) {
                el = document.createElement('div')
            }
        } else {
            el = undefined
        }

        this.$el = el

        console.log(this)
    };

    Bo.prototype._init = function (o: Object) {
        const vm = this

        vm._uid = uid++

        vm.$options = o || {}
        console.log(JSON.stringify(o))
        if (vm.$options.el) {
            vm.$mount(vm.$options.el)
        }
    }


}