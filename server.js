'use strict'
// Use CAP's built-in server bootstrap — same code path as 'cds-serve'.
// Starts the HTTP listener on process.env.PORT and connects to HANA via VCAP_SERVICES.
require('@sap/cds/server')
