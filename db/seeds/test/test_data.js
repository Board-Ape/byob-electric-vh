
exports.seed = function(knex, Promise) {

  return knex('branches').del()
    .then(() => knex('topcompanies').del())

    .then(function () {

      return Promise.all([
        knex('topcompanies').insert(
          {
            companyName: 'API Industries',
            industry: 'machinery',
            location: 'New South Wales',
            revenueGrowth: '200%'
          }, 'id')
          .then(branches => {
            return knex('branches').insert([
              {
                companyName: 'API Industries',
                employees: '1200',
                branchName: 'New South',
                grossRevenue: '1,200,000',
                company_id: branches[0]
              },
              {
                companyName: 'API Industries',
                employees: '20000',
                branchName: 'Circle Group',
                grossRevenue: '1200000000',
                company_id: branches[0]
              }
            ]);
          })
          .then(() => console.log('seeding complete'))
          .catch(error => console.log(`Error seeding data: ${error}`))
      ]) //end Promise.all
    });
};
