using { bookstore } from '../db/schema';

// Admin service – no auth for local/BAS POC (auth via XSUAA when deployed to CF)
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
