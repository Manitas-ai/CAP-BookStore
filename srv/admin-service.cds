using { bookstore } from '../db/schema';

// Admin service – requires 'admin' role (basic auth: admin / Admin123)
@requires: 'admin'
service AdminService @(path: '/admin') {

  entity Books   as projection on bookstore.Books;
  entity Authors as projection on bookstore.Authors;

  // Orders are read-only in admin – placed by customers via CatalogService
  @readonly entity Orders as projection on bookstore.Orders {
    *,
    book.title       as bookTitle,
    createdAt,
    createdBy
  }
}
