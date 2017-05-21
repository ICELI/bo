const path = require('path')
const flow = require('rollup-plugin-flow-no-whitespace')
const version = require('../package.json').version
const resolve = p => path.resolve(__dirname, p)

module.exports = {
    entry: resolve("../src/bo.js"),
    dest: resolve("../dist/bo.js"),
    format: "cjs",
    banner: `// Bo.js v${version} by Iceli (c) 2017-${new Date().getFullYear()}.`,
    moduleName: 'Bo',
    plugins: [
        flow()
    ]
}