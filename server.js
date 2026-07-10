'use strict'
// CAP server entry point.
// Local dev (cds watch): uses SQLite via default profile in package.json
// CF production: uses HANA Cloud HDI container via [production] profile + VCAP_SERVICES
const cds = require('@sap/cds')

cds.serve('all').catch(err => {
  console.error('Startup failed:', err)
  process.exit(1)
})
