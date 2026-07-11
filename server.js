'use strict'
// Find and run cds-serve via module resolution — bypasses CF PATH limitations.
// require.resolve('@sap/cds/package.json') works even when /home/vcap/deps/0/node_modules/
// is not on PATH, because NODE_PATH is set by the CF buildpack.
const path = require('path')
const { spawn } = require('child_process')

const cdsRoot = path.dirname(require.resolve('@sap/cds/package.json'))
const cdsBin  = path.join(cdsRoot, '../.bin/cds-serve')

console.log('[server] starting:', cdsBin)

const child = spawn(cdsBin, [], { stdio: 'inherit' })

child.on('error', err => {
  console.error('[server] spawn error:', err.message)
  process.exit(1)
})

child.on('exit', code => process.exit(code || 0))
