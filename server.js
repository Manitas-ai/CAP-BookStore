'use strict'
// Custom server entry point for CF deployment.
// Deploys the SQLite schema + CSV seed data, then starts the CAP HTTP server.
// Uses require() instead of the cds CLI so it works on CF where the cds
// binary is not on PATH (packages live in /home/vcap/deps/0/node_modules/).
const cds = require('@sap/cds')

;(async () => {
  await cds.deploy()       // create tables + load CSV seed data into bookstore.db
  await cds.serve('all')   // start HTTP server on process.env.PORT (set by CF)
})().catch(err => {
  console.error('Startup failed:', err)
  process.exit(1)
})
