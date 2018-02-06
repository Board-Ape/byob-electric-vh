exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('topcompanies', (table) => {
      table.increments('id').primary();
      table.string('name');

      table.timestamps(true, true);
    }), // no semi-colon here sinse it's an array

    knex.schema.createTable('branches', (table) => {
      table.increments('id').primary();
      table.string('branch');
      // creating a foreign key
      table.integer('company_id').unsigned();
      table.foreign('company_id').references('topcompanies.id');

      table.timestamps(true, true);
    }),

  ]); // end Promise.all
};

exports.down = (knex, Promise) => {
  return Promise.all([
    // be aware of how you are deleting schemas
    // footnotes relies on papers so should come before
    knex.schema.dropTable('branches'),
    knex.schema.dropTable('topcompanies')
  ]);
};
