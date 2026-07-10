using AdminService from '../../srv/admin-service';

// ── Authors: List columns, filter fields, object page layout ─────────────────
annotate AdminService.Authors with @(

  UI.HeaderInfo: {
    TypeName      : 'Author',
    TypeNamePlural: 'Authors',
    Title         : { Value: name },
    Description   : { Value: country }
  },

  UI.SelectionFields: [ name, country ],

  UI.LineItem: [
    { Value: name,    Label: 'Author Name' },
    { Value: country, Label: 'Country' }
  ],

  UI.Facets: [
    {
      $Type : 'UI.ReferenceFacet',
      Label : 'Author Details',
      Target: '@UI.FieldGroup#Details'
    },
    {
      $Type : 'UI.ReferenceFacet',
      Label : 'About the Author',
      Target: '@UI.FieldGroup#About'
    }
  ],

  UI.FieldGroup#Details: {
    Label: 'Author Details',
    Data : [
      { Value: name,    Label: 'Full Name' },
      { Value: country, Label: 'Country' }
    ]
  },

  UI.FieldGroup#About: {
    Label: 'About the Author',
    Data : [
      { Value: about, Label: 'Biography' }
    ]
  }
);
