using AdminService from '../../srv/admin-service';

// ── Books: List columns, filter fields, object page layout ───────────────────
annotate AdminService.Books with @(

  UI.HeaderInfo: {
    TypeName      : 'Book',
    TypeNamePlural: 'Books',
    Title         : { Value: title },
    Description   : { Value: author.name }
  },

  UI.SelectionFields: [ title, author_ID, publishHouse ],

  UI.LineItem: [
    { Value: title,         Label: 'Title' },
    { Value: author.name,   Label: 'Author' },
    { Value: publishedDate, Label: 'Published' },
    { Value: publishHouse,  Label: 'Publisher' },
    { Value: stock,         Label: 'Stock' }
  ],

  UI.Facets: [
    {
      $Type : 'UI.ReferenceFacet',
      Label : 'Book Details',
      Target: '@UI.FieldGroup#Details'
    },
    {
      $Type : 'UI.ReferenceFacet',
      Label : 'Abstract',
      Target: '@UI.FieldGroup#Abstract'
    }
  ],

  UI.FieldGroup#Details: {
    Label: 'Book Details',
    Data : [
      { Value: title,         Label: 'Title' },
      { Value: author_ID,     Label: 'Author' },
      { Value: publishedDate, Label: 'Published Date' },
      { Value: publishHouse,  Label: 'Publisher' },
      { Value: stock,         Label: 'Stock' }
    ]
  },

  UI.FieldGroup#Abstract: {
    Label: 'Short Abstract',
    Data : [
      { Value: abstract, Label: 'Abstract' }
    ]
  }
);

// Author field: show name instead of UUID, value-help dropdown from Authors list
annotate AdminService.Books:author with @(
  Common.Text            : author.name,
  Common.TextArrangement : #TextOnly,
  Common.ValueList: {
    Label         : 'Authors',
    CollectionPath: 'Authors',
    Parameters    : [
      { $Type: 'Common.ValueListParameterOut',         LocalDataProperty: author_ID, ValueListProperty: 'ID' },
      { $Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'name' },
      { $Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'country' }
    ]
  }
);
