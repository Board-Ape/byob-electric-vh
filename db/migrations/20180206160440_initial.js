exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('topcompanies', (table) => {
      table.increments('id').primary();
      table.string('companyName');
      table.string('industry');
      table.string('location');
      table.string('revenueGrowth');
      table.timestamps(true, true);
    }),

    knex.schema.createTable('branches', (table) => {
      table.increments('id').primary();
      table.string('companyName');
      table.string('employees');
      table.string('branchName');
      table.string('grossRevenue');
      table.integer('company_id').unsigned();
      table.foreign('company_id').references('topcompanies.id');
      table.timestamps(true, true);
    }),

  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('branches'),
    knex.schema.dropTable('topcompanies')
  ]);
};
