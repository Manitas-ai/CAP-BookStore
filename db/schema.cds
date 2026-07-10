namespace bookstore;

using { cuid, managed } from '@sap/cds/common';

// ─── Authors ────────────────────────────────────────────────────────────────
entity Authors : cuid {
  name    : String(100) @mandatory;
  country : String(50);
  about   : String(2000); // "About the Author" – maintained here, linked to Books
  books   : Association to many Books on books.author = $self;
}

// ─── Books ───────────────────────────────────────────────────────────────────
entity Books : cuid {
  title         : String(200) @mandatory;
  author        : Association to Authors;
  publishedDate : Date;
  publishHouse  : String(100);
  abstract      : String(2000);
  stock         : Integer default 10;
}

// ─── Orders ──────────────────────────────────────────────────────────────────
entity Orders : cuid, managed {
  book          : Association to Books @mandatory;
  customerName  : String(100) @mandatory;
  customerEmail : String(100) @mandatory;
  status        : String(20) default 'New';
}
