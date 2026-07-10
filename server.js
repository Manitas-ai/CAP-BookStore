'use strict'
// Custom server entry point for CF deployment.
// bookstore.db is pre-built during 'mbt build' (npx cds deploy --to sqlite:bookstore.db)
// and shipped inside the MTA archive — no runtime deploy needed.
const cds = require('@sap/cds')

cds.serve('all').catch(err => {
  console.error('Startup failed:', err)
  process.exit(1)
})
