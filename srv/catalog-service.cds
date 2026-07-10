using { bookstore } from '../db/schema';

// Public service – no authentication required
service CatalogService @(path: '/browse') {

  // Books: read-only, author fields flattened for easy UI binding
  @readonly entity Books as projection on bookstore.Books {
    ID,
    title,
    publishedDate,
    publishHouse,
    abstract,
    stock,
    author.name    as authorName,
    author.country as authorCountry,
    author.about   as authorAbout
  }

  // Orders: customers can only place (insert) orders
  @insertonly entity Orders as projection on bookstore.Orders {
    ID, book, customerName, customerEmail, status
  }
}
