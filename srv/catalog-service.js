const cds = require('@sap/cds')

module.exports = cds.service.impl(async function () {

  // ── Validate order before saving ────────────────────────────────────────────
  this.before('CREATE', 'Orders', async (req) => {
    const { book_ID, customerName, customerEmail } = req.data

    if (!book_ID)       return req.reject(400, 'Please select a book.')
    if (!customerName)  return req.reject(400, 'Please enter your name.')
    if (!customerEmail) return req.reject(400, 'Please enter your email address.')

    // Check stock
    const book = await SELECT.one.from('bookstore.Books').where({ ID: book_ID })
    if (!book)          return req.reject(404, 'Book not found.')
    if (book.stock <= 0) return req.reject(400, `Sorry, "${book.title}" is currently out of stock.`)
  })

  // ── Reduce stock after order is successfully created ─────────────────────────
  this.after('CREATE', 'Orders', async (order) => {
    await UPDATE('bookstore.Books')
      .where({ ID: order.book_ID })
      .with({ stock: { '-=': 1 } })
  })
})
